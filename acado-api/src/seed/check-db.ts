// src/seed/check-db.ts
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

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...');
    console.log('Connecting to MongoDB...');
    await connect(MONGO_URI);

    // Count all collections
    const categoriesCount = await Category.countDocuments();
    const fieldsCount = await Field.countDocuments();
    const formsCount = await Form.countDocuments();
    const universitiesCount = await University.countDocuments();
    const coursesCount = await Course.countDocuments();
    const usersCount = await User.countDocuments();
    
    // Get detailed data
    const categories = await Category.find({}).select('name').lean();
    const allCategories = await Category.find({}).lean();
    const subcategoriesCount = allCategories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0);
    
    // Group fields by category
    const fieldsByCategory = new Map<string, number>();
    const allFields = await Field.find({}).select('categoryId').lean();
    allFields.forEach(field => {
      const count = fieldsByCategory.get(field.categoryId) || 0;
      fieldsByCategory.set(field.categoryId, count + 1);
    });

    // Form statistics
    const forms = await Form.find({}).select('name status').lean();
    const formsByStatus = {
      published: forms.filter((f: any) => f.status === 'published').length,
      draft: forms.filter((f: any) => f.status === 'draft').length,
      archived: forms.filter((f: any) => f.status === 'archived').length
    };

    // University statistics
    const universities = await University.find({}).select('name country').lean();
    const universitiesByCountry = new Map<string, number>();
    universities.forEach((uni: any) => {
      const count = universitiesByCountry.get(uni.country) || 0;
      universitiesByCountry.set(uni.country, count + 1);
    });

    // Course statistics
    const courses = await Course.find({}).select('type level').lean();
    const coursesByType = new Map<string, number>();
    const coursesByLevel = new Map<string, number>();
    courses.forEach((course: any) => {
      const typeCount = coursesByType.get(course.type) || 0;
      coursesByType.set(course.type, typeCount + 1);
      const levelCount = coursesByLevel.get(course.level) || 0;
      coursesByLevel.set(course.level, levelCount + 1);
    });

    // User statistics
    const users = await User.find({}).select('role').lean();
    const usersByRole = new Map<string, number>();
    users.forEach((user: any) => {
      const count = usersByRole.get(user.role) || 0;
      usersByRole.set(user.role, count + 1);
    });

    console.log('');
    console.log('📊 ════════════════════════════════════════════════════════════');
    console.log('📊 DATABASE STATUS');
    console.log('📊 ════════════════════════════════════════════════════════════');
    console.log('');
    
    // Overview
    console.log('📈 OVERVIEW');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Users:         ${usersCount}`);
    console.log(`📁 Categories:    ${categoriesCount}`);
    console.log(`📋 Subcategories: ${subcategoriesCount}`);
    console.log(`📝 Fields:        ${fieldsCount}`);
    console.log(`📄 Forms:         ${formsCount}`);
    console.log(`🏛️  Universities:  ${universitiesCount}`);
    console.log(`📚 Courses:       ${coursesCount}`);
    console.log('');
    
    // Categories Detail
    if (categories.length > 0) {
      console.log('📁 CATEGORIES');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      categories.forEach((cat: any, index: number) => {
        const catData = allCategories[index];
        const fieldCount = fieldsByCategory.get(catData.id || '') || 0;
        const subCount = catData.subcategories?.length || 0;
        console.log(`   ${(index + 1).toString().padStart(2, ' ')}. ${cat.name.padEnd(30)} (${subCount} subs, ${fieldCount} fields)`);
      });
      console.log('');
    }
    
    // Forms Detail
    if (formsCount > 0) {
      console.log('📄 FORMS');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Published: ${formsByStatus.published}`);
      console.log(`   Draft:     ${formsByStatus.draft}`);
      console.log(`   Archived:  ${formsByStatus.archived}`);
      if (forms.length > 0) {
        console.log('\n   Form List:');
        forms.forEach((form: any, index: number) => {
          console.log(`   ${(index + 1).toString().padStart(2, ' ')}. ${form.name} (${form.status})`);
        });
      }
      console.log('');
    }
    
    // Universities Detail
    if (universitiesCount > 0) {
      console.log('🏛️  UNIVERSITIES');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Total: ${universitiesCount} universities`);
      if (universitiesByCountry.size > 0) {
        console.log('\n   By Country:');
        Array.from(universitiesByCountry.entries())
          .sort((a, b) => b[1] - a[1])
          .forEach(([country, count]) => {
            console.log(`   - ${country}: ${count}`);
          });
      }
      console.log('');
    }
    
    // Courses Detail
    if (coursesCount > 0) {
      console.log('📚 COURSES');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Total: ${coursesCount} courses`);
      
      if (coursesByType.size > 0) {
        console.log('\n   By Type:');
        Array.from(coursesByType.entries()).forEach(([type, count]) => {
          console.log(`   - ${type}: ${count}`);
        });
      }
      
      if (coursesByLevel.size > 0) {
        console.log('\n   By Level:');
        Array.from(coursesByLevel.entries()).forEach(([level, count]) => {
          console.log(`   - ${level}: ${count}`);
        });
      }
      console.log('');
    }
    
    // Users Detail
    if (usersCount > 0) {
      console.log('👥 USERS');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      Array.from(usersByRole.entries()).forEach(([role, count]) => {
        console.log(`   ${role}: ${count}`);
      });
      console.log('');
    }
    
    // Status Check
    const totalRecords = categoriesCount + fieldsCount + formsCount + universitiesCount + coursesCount + usersCount;
    
    if (totalRecords === 0) {
      console.log('⚠️  WARNING: Database is empty!');
      console.log('');
      console.log('💡 Quick Setup:');
      console.log('   npm run seed:users        # Create default users');
      console.log('   npm run seed              # Load categories & fields');
      console.log('   npm run seed:universities # Load universities & courses');
      console.log('   npm run seed:forms        # Load sample forms');
      console.log('');
    } else {
      console.log('✅ Database Status: Active');
      
      // Recommendations
      const recommendations = [];
      if (usersCount === 0) recommendations.push('Run "npm run seed:users" to create users');
      if (categoriesCount === 0) recommendations.push('Run "npm run seed" to create categories & fields');
      if (universitiesCount === 0) recommendations.push('Run "npm run seed:universities" to create universities');
      if (coursesCount === 0 && universitiesCount > 0) recommendations.push('Run "npm run seed:courses" to create courses');
      if (formsCount === 0) recommendations.push('Run "npm run seed:forms" to create forms');
      
      if (recommendations.length > 0) {
        console.log('');
        console.log('💡 RECOMMENDATIONS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        recommendations.forEach(rec => console.log(`   - ${rec}`));
      }
      console.log('');
    }
    
    console.log('🔗 API ENDPOINTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   GET http://localhost:4000/health');
    console.log('   GET http://localhost:4000/masterCategories');
    console.log('   GET http://localhost:4000/masterFields');
    console.log('   GET http://localhost:4000/forms');
    console.log('   GET http://localhost:4000/universities');
    console.log('   GET http://localhost:4000/courses');
    console.log('   GET http://localhost:4000/docs  (Swagger UI)');
    console.log('');
    
  } catch (error) {
    console.error('❌ Check database failed:');
    console.error(error);
    throw error;
  } finally {
    await disconnect();
    console.log('👋 Database connection closed');
  }
}

// Run if called directly
// Always run when this file is executed
checkDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

export default checkDatabase;

