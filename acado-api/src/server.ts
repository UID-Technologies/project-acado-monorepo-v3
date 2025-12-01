// src/server.ts
import 'dotenv/config';
import app from './app.js';
import { connect } from './db/mongoose.js';
import { loadEnv } from './config/env.js';
import logger from './utils/logger.js';

const { PORT, MONGO_URI } = loadEnv();

app.get("/health", (req, res) => res.status(200).send("OK"));

(async () => {
  await connect(MONGO_URI);
  app.listen(PORT, "0.0.0.0", () => logger.info(`API listening on :${PORT}`));
})();
