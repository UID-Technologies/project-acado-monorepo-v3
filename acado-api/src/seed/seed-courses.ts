// src/seed/seed-courses.ts
import { connect, disconnect } from '../db/mongoose.js';
import { loadEnv } from '../config/env.js';
import Course from '../models/Course.js';
import University from '../models/University.js';
import logger from '../utils/logger.js';

const { MONGO_URI } = loadEnv();

// Sample course data templates by program type
const courseTemplates = [
  // Undergraduate Degrees
  {
    name: "Bachelor of Science in Computer Science",
    type: "degree" as const,
    level: "undergraduate" as const,
    duration: "4 years",
    description: "Comprehensive computer science program covering algorithms, data structures, software engineering, and AI.",
    requirements: "High school diploma with strong grades in Math and Science, SAT/ACT scores, English proficiency test",
    fee: 50000,
    currency: "USD"
  },
  {
    name: "Bachelor of Business Administration",
    type: "degree" as const,
    level: "undergraduate" as const,
    duration: "4 years",
    description: "Business program covering management, finance, marketing, and entrepreneurship.",
    requirements: "High school diploma, standardized test scores, personal statement",
    fee: 45000,
    currency: "USD"
  },
  {
    name: "Bachelor of Arts in Psychology",
    type: "degree" as const,
    level: "undergraduate" as const,
    duration: "4 years",
    description: "Study of human behavior, mental processes, and psychological theories.",
    requirements: "High school diploma, good academic record, personal essay",
    fee: 42000,
    currency: "USD"
  },
  {
    name: "Bachelor of Engineering",
    type: "degree" as const,
    level: "undergraduate" as const,
    duration: "4 years",
    description: "Engineering program with specializations in mechanical, electrical, or civil engineering.",
    requirements: "High school diploma with strong background in Math and Physics",
    fee: 55000,
    currency: "USD"
  },
  
  // Postgraduate Degrees
  {
    name: "Master of Business Administration (MBA)",
    type: "degree" as const,
    level: "postgraduate" as const,
    duration: "2 years",
    description: "Advanced business administration program focusing on leadership, strategy, and innovation.",
    requirements: "Bachelor's degree, GMAT/GRE scores, 2+ years work experience, recommendation letters",
    fee: 75000,
    currency: "USD"
  },
  {
    name: "Master of Science in Data Science",
    type: "degree" as const,
    level: "postgraduate" as const,
    duration: "2 years",
    description: "Advanced program in data analytics, machine learning, and big data technologies.",
    requirements: "Bachelor's degree in related field, programming experience, GRE scores",
    fee: 65000,
    currency: "USD"
  },
  {
    name: "Master of Public Health",
    type: "degree" as const,
    level: "postgraduate" as const,
    duration: "2 years",
    description: "Graduate program focusing on public health policy, epidemiology, and health management.",
    requirements: "Bachelor's degree, relevant work experience preferred, GRE scores",
    fee: 55000,
    currency: "USD"
  },
  {
    name: "Master of Arts in International Relations",
    type: "degree" as const,
    level: "postgraduate" as const,
    duration: "2 years",
    description: "Study of global politics, diplomacy, international law, and foreign policy.",
    requirements: "Bachelor's degree, strong academic record, statement of purpose",
    fee: 50000,
    currency: "USD"
  },
  
  // Doctoral Programs
  {
    name: "PhD in Computer Science",
    type: "degree" as const,
    level: "doctoral" as const,
    duration: "4-6 years",
    description: "Research-focused doctoral program in computer science with emphasis on original research contribution.",
    requirements: "Master's degree in related field, research proposal, publications, strong GRE scores",
    fee: 45000,
    currency: "USD"
  },
  {
    name: "PhD in Physics",
    type: "degree" as const,
    level: "doctoral" as const,
    duration: "5-7 years",
    description: "Advanced research program in theoretical or experimental physics.",
    requirements: "Master's degree in Physics, research experience, GRE Physics subject test",
    fee: 42000,
    currency: "USD"
  },
  {
    name: "PhD in Economics",
    type: "degree" as const,
    level: "doctoral" as const,
    duration: "5-6 years",
    description: "Doctoral program in economic theory, econometrics, and applied economics.",
    requirements: "Master's degree in Economics, strong quantitative background, research proposal",
    fee: 48000,
    currency: "USD"
  },
  
  // Exchange Programs
  {
    name: "Engineering Exchange Program",
    type: "exchange" as const,
    level: "undergraduate" as const,
    duration: "1 semester",
    description: "Student exchange program for engineering students to study abroad.",
    requirements: "Current enrollment in engineering program, minimum GPA 3.0, language proficiency",
    fee: 15000,
    currency: "USD"
  },
  {
    name: "Business Exchange Program",
    type: "exchange" as const,
    level: "undergraduate" as const,
    duration: "1 semester",
    description: "International business exchange for undergraduate business students.",
    requirements: "Enrolled in business program, good academic standing, recommendation letter",
    fee: 14000,
    currency: "USD"
  },
  {
    name: "Summer Research Exchange",
    type: "exchange" as const,
    level: "postgraduate" as const,
    duration: "3 months",
    description: "Summer research program for graduate students in STEM fields.",
    requirements: "Graduate student status, research proposal, faculty recommendation",
    fee: 8000,
    currency: "USD"
  },
  
  // Pathway Programs
  {
    name: "Pre-Master's Pathway Program",
    type: "pathway" as const,
    level: "undergraduate" as const,
    duration: "1 year",
    description: "Preparatory program for international students planning to pursue a Master's degree.",
    requirements: "Bachelor's degree, English language test scores below direct entry requirements",
    fee: 25000,
    currency: "USD"
  },
  {
    name: "Foundation Year Program",
    type: "pathway" as const,
    level: "undergraduate" as const,
    duration: "1 year",
    description: "Foundation program preparing students for undergraduate degree studies.",
    requirements: "High school completion, English proficiency test",
    fee: 22000,
    currency: "USD"
  },
  
  // Diploma Programs
  {
    name: "Diploma in Digital Marketing",
    type: "diploma" as const,
    level: "undergraduate" as const,
    duration: "1 year",
    description: "Professional diploma in digital marketing, SEO, social media, and analytics.",
    requirements: "High school diploma or equivalent work experience",
    fee: 18000,
    currency: "USD"
  },
  {
    name: "Diploma in Software Development",
    type: "diploma" as const,
    level: "undergraduate" as const,
    duration: "1 year",
    description: "Intensive program in software development, web technologies, and programming.",
    requirements: "High school diploma, basic computer skills",
    fee: 20000,
    currency: "USD"
  },
  
  // Certifications
  {
    name: "Professional Certificate in Project Management",
    type: "certification" as const,
    level: "postgraduate" as const,
    duration: "6 months",
    description: "Professional certification in project management methodologies and tools.",
    requirements: "Bachelor's degree or equivalent work experience",
    fee: 8000,
    currency: "USD"
  },
  {
    name: "Certificate in Data Analytics",
    type: "certification" as const,
    level: "postgraduate" as const,
    duration: "6 months",
    description: "Professional certificate in data analytics, visualization, and business intelligence.",
    requirements: "Bachelor's degree or professional experience in related field",
    fee: 7500,
    currency: "USD"
  }
];

async function seedCourses() {
  try {
    logger.info('Starting course seeding...');
    await connect(MONGO_URI);
    logger.info('✅ Connected to MongoDB');

    // Check if universities exist
    const universities = await University.find({ isActive: true });
    
    if (universities.length === 0) {
      logger.warn('⚠️  No universities found in database.');
      logger.info('💡 Please run "npm run seed:universities" first to create universities.');
      return;
    }

    logger.info(`📚 Found ${universities.length} universities`);

    // Clear existing courses
    await Course.deleteMany({});
    logger.info('🗑️  Cleared existing courses');

    // Distribute courses across universities
    const coursesData = [];
    
    for (const university of universities) {
      const universityId = university._id;
      
      // Assign 4-6 different courses per university
      const numCourses = Math.floor(Math.random() * 3) + 4; // 4 to 6 courses
      const selectedTemplates = courseTemplates
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, numCourses);
      
      for (const template of selectedTemplates) {
        // Adjust fees based on university ranking (lower ranking = higher fees for some universities)
        let adjustedFee = template.fee;
        const ranking = (university as any).ranking;
        if (typeof ranking === 'number' && ranking <= 10) {
          adjustedFee = Math.round(template.fee * 1.2); // Top universities charge 20% more
        }
        
        // Set application deadline (3-6 months from now)
        const deadline = new Date();
        deadline.setMonth(deadline.getMonth() + Math.floor(Math.random() * 3) + 3);
        
        // Set start date (6-12 months from now)
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() + Math.floor(Math.random() * 6) + 6);
        
        coursesData.push({
          universityId,
          name: template.name,
          type: template.type,
          level: template.level,
          duration: template.duration,
          description: template.description,
          requirements: template.requirements,
          fee: adjustedFee,
          currency: template.currency,
          applicationDeadline: deadline,
          startDate: startDate,
          isActive: true
        });
      }
    }

    const createdCourses = await Course.insertMany(coursesData);
    logger.info(`✅ Created ${createdCourses.length} courses`);

    // Display summary
    logger.info('\n📊 Course Distribution Summary:');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const university of universities) {
      const universityCourses = createdCourses.filter(
        c => c.universityId.toString() === university._id.toString()
      );
      const country =
        (university as any).country ||
        (university as any).location?.country ||
        'N/A';
      logger.info(`\n🏛️  ${university.name} (${country})`);
      logger.info(`   Total Courses: ${universityCourses.length}`);
      
      // Group by type
      const byType: Record<string, number> = {};
      universityCourses.forEach(c => {
        byType[c.type] = (byType[c.type] || 0) + 1;
      });
      
      Object.entries(byType).forEach(([type, count]) => {
        logger.info(`   - ${type}: ${count}`);
      });
    }
    
    // Overall statistics
    logger.info('\n📈 Overall Statistics:');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const stats = {
      byType: {} as Record<string, number>,
      byLevel: {} as Record<string, number>,
      avgFee: 0
    };
    
    let totalFee = 0;
    createdCourses.forEach(course => {
      stats.byType[course.type] = (stats.byType[course.type] || 0) + 1;
      stats.byLevel[course.level] = (stats.byLevel[course.level] || 0) + 1;
      totalFee += course.fee || 0;
    });
    
    stats.avgFee = Math.round(totalFee / createdCourses.length);
    
    logger.info('\n📚 By Type:');
    Object.entries(stats.byType).forEach(([type, count]) => {
      logger.info(`   ${type}: ${count} courses`);
    });
    
    logger.info('\n🎓 By Level:');
    Object.entries(stats.byLevel).forEach(([level, count]) => {
      logger.info(`   ${level}: ${count} courses`);
    });
    
    logger.info(`\n💰 Average Fee: $${stats.avgFee.toLocaleString()} USD`);
    logger.info(`\n✅ Course seeding completed successfully!`);
    logger.info(`   Total: ${createdCourses.length} courses across ${universities.length} universities`);
    logger.info(`   Average: ${(createdCourses.length / universities.length).toFixed(1)} courses per university`);
    
  } catch (error) {
    logger.error({ error }, '❌ Error seeding courses');
    throw error;
  } finally {
    await disconnect();
    logger.info('\n👋 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  seedCourses()
    .then(() => process.exit(0))
    .catch(err => {
      logger.error(err);
      process.exit(1);
    });
}

export default seedCourses;

