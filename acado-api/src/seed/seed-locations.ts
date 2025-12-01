// src/seed/seed-locations.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import { connect, disconnect } from '../db/mongoose.js';
import { loadEnv } from '../config/env.js';
import Location from '../models/Location.js';
import logger from '../utils/logger.js';

interface RawRow {
  [key: string]: any;
}

interface LocationRow {
  country: string;
  state: string;
  city: string;
}

const { MONGO_URI } = loadEnv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const providedPath = args.find((arg) => !arg.startsWith('--'));
const appendMode = args.includes('--append');

const defaultCandidates = [
  path.resolve(__dirname, '../data/locations.sample.xlsx'),
  path.resolve(__dirname, '../data/locations.sample.csv'),
  path.resolve(__dirname, '../data/locations.sample.json'),
];

const resolvedDefault = defaultCandidates.find((candidate) => fs.existsSync(candidate));

const DATA_FILE = path.resolve(
  process.cwd(),
  providedPath || process.env.LOCATIONS_DATA_PATH || resolvedDefault || defaultCandidates[0]
);

if (!fs.existsSync(DATA_FILE)) {
  logger.error({ DATA_FILE }, 'Location data file not found. Provide a valid Excel/CSV file path.');
  process.exit(1);
}

const columnAliases = {
  country: ['country', 'Country', 'COUNTRY', 'nation'],
  state: ['state', 'State', 'STATE', 'province', 'Province'],
  city: ['city', 'City', 'CITY'],
};

const getColumnValue = (row: RawRow, aliases: string[]) => {
  for (const key of Object.keys(row)) {
    if (aliases.some((alias) => alias.toLowerCase() === key.toLowerCase())) {
      const value = row[key];
      if (typeof value === 'string') return value.trim();
      if (value != null) return String(value).trim();
    }
  }
  return '';
};

const readLocationRows = (filePath: string): LocationRow[] => {
  const workbook = xlsx.readFile(filePath, { cellDates: false, cellNF: false, cellText: false });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error('No sheets found in the workbook.');
  }

  const json = xlsx.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName], { defval: '' });
  const dedupe = new Map<string, LocationRow>();

  for (const row of json) {
    const country = getColumnValue(row, columnAliases.country);
    const state = getColumnValue(row, columnAliases.state);
    const city = getColumnValue(row, columnAliases.city);

    if (!country || !state || !city) continue;

    const key = `${country.toLowerCase()}|${state.toLowerCase()}|${city.toLowerCase()}`;
    if (!dedupe.has(key)) {
      dedupe.set(key, {
        country,
        state,
        city,
      });
    }
  }

  return Array.from(dedupe.values());
};

async function seedLocations() {
  logger.info({ DATA_FILE, appendMode }, 'Starting location import');
  const rows = readLocationRows(DATA_FILE);

  if (rows.length === 0) {
    throw new Error('No valid country/state/city rows found in the provided file.');
  }

  await connect(MONGO_URI);

  if (!appendMode) {
    const deleted = await Location.deleteMany({});
    logger.info({ deleted: deleted.deletedCount }, 'Cleared existing locations collection');
  }

  const operations = rows.map((row) => ({
    updateOne: {
      filter: {
        country: row.country,
        state: row.state,
        city: row.city,
      },
      update: { $set: row },
      upsert: true,
    },
  }));

  const result = await Location.bulkWrite(operations, { ordered: false });
  logger.info(
    {
      matched: result.matchedCount,
      upserts: result.upsertedCount,
      modified: result.modifiedCount,
    },
    'Location import completed'
  );
}

seedLocations()
  .then(() => logger.info('✅ Location seed finished'))
  .catch((error) => {
    logger.error(error, '❌ Location seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnect();
  });


