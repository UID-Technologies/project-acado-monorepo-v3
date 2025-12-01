// src/seed/clear-db.ts
import { connect, disconnect } from '../db/mongoose.js';
import { loadEnv } from '../config/env.js';
import Category from '../models/Category.js';
import Field from '../models/Field.js';
import Form from '../models/Form.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const { MONGO_URI } = loadEnv();

async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...');
    console.log('⚠️  This will delete ALL data from the database!');
    console.log('Connecting to MongoDB...');
    await connect(MONGO_URI);

    let totalDeleted = 0;

    console.log('\nDeleting courses...');
    const coursesDeleted = await Course.deleteMany({});
    console.log(`  ✓ Deleted ${coursesDeleted.deletedCount} courses`);
    totalDeleted += coursesDeleted.deletedCount;

    console.log('Deleting universities...');
    const universitiesDeleted = await University.deleteMany({});
    console.log(`  ✓ Deleted ${universitiesDeleted.deletedCount} universities`);
    totalDeleted += universitiesDeleted.deletedCount;

    console.log('Deleting forms...');
    const formsDeleted = await Form.deleteMany({});
    console.log(`  ✓ Deleted ${formsDeleted.deletedCount} forms`);
    totalDeleted += formsDeleted.deletedCount;

    console.log('Deleting fields...');
    const fieldsDeleted = await Field.deleteMany({});
    console.log(`  ✓ Deleted ${fieldsDeleted.deletedCount} fields`);
    totalDeleted += fieldsDeleted.deletedCount;

    console.log('Deleting categories...');
    const categoriesDeleted = await Category.deleteMany({});
    console.log(`  ✓ Deleted ${categoriesDeleted.deletedCount} categories`);
    totalDeleted += categoriesDeleted.deletedCount;

    console.log('Deleting users...');
    const usersDeleted = await User.deleteMany({});
    console.log(`  ✓ Deleted ${usersDeleted.deletedCount} users`);
    totalDeleted += usersDeleted.deletedCount;

    console.log('');
    console.log('✅ Database cleared successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total items deleted: ${totalDeleted}`);
    console.log('');
    console.log('💡 To repopulate the database, run:');
    console.log('   npm run seed:users        # Create default users');
    console.log('   npm run seed              # Load categories & fields');
    console.log('   npm run seed:universities # Load universities & courses');
    console.log('   npm run seed:forms        # Load sample forms');
    console.log('');
    
  } catch (error) {
    console.error('❌ Clear database failed:');
    console.error(error);
    throw error;
  } finally {
    await disconnect();
    console.log('👋 Database connection closed');
  }
}

// Run if called directly
// Always run when this file is executed
clearDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

export default clearDatabase;

