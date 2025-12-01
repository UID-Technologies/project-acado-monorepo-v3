// src/seed/seed-universities.ts
import { connect, disconnect } from '../db/mongoose.js';
import { loadEnv } from '../config/env.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import logger from '../utils/logger.js';

const { MONGO_URI } = loadEnv();

const universities = [
  {
    name: "Jamk University of Applied Sciences",
    shortName: "JAMK",
    institutionType: "University",
    organizationLevel: "parent",
    tagline: "Openness, Innovation, Responsibility, Collaboration",
    foundedYear: 1994,
    rating: "4.6",
    rank: "Top 10",
    contact: {
      primaryEmail: "info@jamk.fi",
      mobileNo: "+358 20 743 8100",
      website: "https://www.jamk.fi"
    },
    address: "Rajakatu 35, 40200 Jyväskylä, Finland",
    location: {
      city: "Jyväskylä",
      state: "Central Finland",
      country: "Finland",
      campuses: [
        {
          name: "Rajakatu Campus",
          location: "Jyväskylä",
          specializations: ["Business", "Technology", "Tourism", "Teacher Education"],
          facilities: ["Innovation Labs", "Library", "Startup Hub"]
        },
        {
          name: "Lutakko Campus",
          location: "Jyväskylä",
          specializations: ["Social Services", "Health Care", "ICT"],
          facilities: ["Simulation Centre", "Wellness Labs"]
        }
      ]
    },
    branding: {
      logoUrl: "https://cdn.acado.ai/universities/jamk/logo.png",
      coverImageUrl: "https://cdn.acado.ai/universities/jamk/cover.jpg",
      brochureUrl: "https://cdn.acado.ai/universities/jamk/brochure.pdf"
    },
    about: {
      description: "JAMK is one of Finland's leading universities of applied sciences with strong industry partnerships and international outlook.",
      mission: "Provide future-focused education with practical skills, critical thinking, and global perspectives.",
      values: ["Openness", "Innovation", "Responsibility", "Collaboration"],
      highlights: ["300+ partner institutions", "40,000+ alumni", "Strong RDI projects"]
    },
    factsAndFigures: {
      totalStudents: 9500,
      internationalStudents: 700,
      staffMembers: 900,
      alumniCount: 40000,
      internationalPartnerships: 300,
      partnerCountries: 50,
      graduateEmployability: 80,
      annualGraduates: 1500,
      researchBudget: 20
    },
    community: {
      description: "Vibrant network of students, faculty, industry partners, and alumni.",
      studentCount: 9500,
      facultyCount: 900,
      alumniInCountries: 100,
      activeProjects: 300
    },
    fieldsOfEducation: [
      {
        name: "Business and Tourism",
        description: "International business and hospitality programs.",
        programs: ["International Business", "Tourism Management"],
        degrees: ["Bachelor", "Master"]
      },
      {
        name: "Technology and ICT",
        description: "Cutting-edge engineering and ICT education.",
        programs: ["Automation and Robotics", "ICT Engineering", "Cybersecurity"],
        degrees: ["Bachelor", "Master"]
      }
    ],
    socialResponsibility: {
      description: "Committed to sustainable bioeconomy and digitalisation projects.",
      commitments: ["Sustainability", "Digitalisation", "Entrepreneurship"],
      initiatives: ["Business Incubator", "Green Transition Projects"]
    },
    whyThisUniversity: "Choose JAMK for its practical approach to learning, strong industry connections, and international opportunities.",
    admission: "Applicants are selected based on academic performance, entrance exams, and interviews.",
    placements: "Graduates work in leading companies, supported by a dedicated career services team.",
    faq: "Q: Do you offer scholarships?\nA: Yes, there are merit- and need-based scholarships.\n\nQ: Do you offer housing?\nA: Housing is available for international students.",
    testimonials: [
      "Studying at JAMK transformed my career path with real-world projects and supportive faculty."
    ],
    tags: { isVerified: true },
    isActive: true
  },
  {
    name: "University of Oxford",
    shortName: "Oxford",
    institutionType: "University",
    organizationLevel: "parent",
    tagline: "Dominus Illuminatio Mea",
    foundedYear: 1096,
    rating: "4.9",
    rank: "Top 5",
    contact: {
      primaryEmail: "admissions@ox.ac.uk",
      mobileNo: "+44 1865 270000",
      website: "https://www.ox.ac.uk"
    },
    address: "Wellington Square, Oxford OX1 2JD, United Kingdom",
    location: {
      city: "Oxford",
      state: "Oxfordshire",
      country: "United Kingdom",
      campuses: []
    },
    branding: {
      logoUrl: "https://cdn.acado.ai/universities/oxford/logo.png",
      coverImageUrl: "https://cdn.acado.ai/universities/oxford/cover.jpg",
      brochureUrl: "https://cdn.acado.ai/universities/oxford/brochure.pdf"
    },
    about: {
      description: "World-renowned research university with a history of academic excellence.",
      mission: "Achieve excellence in research and education for the benefit of society.",
      values: ["Excellence", "Integrity", "Diversity"],
      highlights: ["Oldest in the English-speaking world", "Global ranking top 1-5"]
    },
    factsAndFigures: {
      totalStudents: 26000,
      internationalStudents: 11000,
      staffMembers: 13000,
      alumniCount: 300000,
      internationalPartnerships: 500,
      partnerCountries: 100,
      graduateEmployability: 92,
      annualGraduates: 7000,
      researchBudget: 120
    },
    community: {
      description: "A diverse and inclusive global community.",
      studentCount: 26000,
      facultyCount: 13000,
      alumniInCountries: 150,
      activeProjects: 1000
    },
    fieldsOfEducation: [
      {
        name: "Humanities",
        programs: ["History", "Philosophy"],
        degrees: ["Bachelor", "Master", "PhD"]
      },
      {
        name: "Sciences",
        programs: ["Physics", "Chemistry", "Biology"],
        degrees: ["Bachelor", "Master", "PhD"]
      }
    ],
    socialResponsibility: {
      description: "Global impact through research and innovation.",
      commitments: ["Sustainability", "Health", "Education"],
      initiatives: ["Oxford Martin School", "Vaccines research"]
    },
    whyThisUniversity: "Oxford offers unparalleled research opportunities, a global network, and a rich academic tradition.",
    admission: "Admission is competitive; applicants are evaluated based on academic record, test scores, and interviews.",
    placements: "Oxford graduates are highly employable and recruited by leading global employers.",
    faq: "Q: Is the college system compulsory?\nA: Yes, all students belong to a college.\n\nQ: Are there financial aids?\nA: Scholarships and bursaries are available.",
    testimonials: [
      "A transformative experience that challenged me academically and personally."
    ],
    tags: { isVerified: true },
    isActive: true
  },
  {
    name: "Massachusetts Institute of Technology (MIT)",
    shortName: "MIT",
    institutionType: "University",
    organizationLevel: "parent",
    tagline: "Mens et Manus",
    foundedYear: 1861,
    rating: "4.8",
    rank: "Top 3",
    contact: {
      primaryEmail: "admissions@mit.edu",
      mobileNo: "+1 617-253-1000",
      website: "https://www.mit.edu"
    },
    address: "77 Massachusetts Ave, Cambridge, MA 02139, USA",
    location: {
      city: "Cambridge",
      state: "Massachusetts",
      country: "United States",
      campuses: []
    },
    branding: {
      logoUrl: "https://cdn.acado.ai/universities/mit/logo.png",
      coverImageUrl: "https://cdn.acado.ai/universities/mit/cover.jpg",
      brochureUrl: "https://cdn.acado.ai/universities/mit/brochure.pdf"
    },
    about: {
      description: "Leading institute for technology and innovation with a focus on solving global challenges.",
      mission: "Advance knowledge and educate students in science, technology, and scholarship for the betterment of the world.",
      values: ["Innovation", "Excellence", "Collaboration"],
      highlights: ["Cutting-edge research", "Entrepreneurial ecosystem", "Global impact"]
    },
    factsAndFigures: {
      totalStudents: 11500,
      internationalStudents: 3400,
      staffMembers: 13000,
      alumniCount: 140000,
      internationalPartnerships: 200,
      partnerCountries: 60,
      graduateEmployability: 95,
      annualGraduates: 3000,
      researchBudget: 140
    },
    community: {
      description: "An innovative community of learners, researchers, and industry partners driving technological breakthroughs.",
      studentCount: 11500,
      facultyCount: 13000,
      alumniInCountries: 120,
      activeProjects: 800
    },
    fieldsOfEducation: [
      {
        name: "Engineering",
        programs: ["Mechanical Engineering", "Electrical Engineering", "Computer Science"],
        degrees: ["Bachelor", "Master", "PhD"]
      },
      {
        name: "Business",
        programs: ["MBA", "Finance"],
        degrees: ["Master"]
      }
    ],
    socialResponsibility: {
      description: "Solving global challenges through technology and innovation.",
      commitments: ["Climate Action", "Health", "AI for Good"],
      initiatives: ["Climate Grand Challenges", "Jameel Clinic"]
    },
    whyThisUniversity: "MIT offers unparalleled opportunities in innovation, research, and entrepreneurship.",
    admission: "Admission is highly selective and considers academic excellence, research potential, and leadership.",
    placements: "Graduates join top global companies and startups, supported by a strong career services network.",
    faq: "Q: Does MIT offer financial aid?\nA: Yes, MIT is need-blind for domestic students and meets full demonstrated need.",
    testimonials: [
      "MIT empowered me to innovate and launch impactful solutions with real-world applications."
    ],
    tags: { isVerified: true },
    isActive: true
  }
];

async function seedUniversitiesAndCourses() {
  try {
    logger.info('Starting university and course seeding...');
    await connect(MONGO_URI);
    logger.info('✅ Connected to MongoDB');

    // Clear existing data
    await University.deleteMany({});
    await Course.deleteMany({});
    logger.info('🗑️  Cleared existing universities and courses');

    // Create universities
    const createdUniversities = await University.insertMany(universities);
    logger.info(`✅ Created ${createdUniversities.length} universities`);

    // Create courses for each university
    const coursesData = [];
    
    for (const university of createdUniversities) {
      const universityId = university._id;
      
      // Add 3-5 courses per university
      const universityCourses = [
        {
          universityId,
          name: "Bachelor of Science in Computer Science",
          type: "degree",
          level: "undergraduate",
          duration: "4 years",
          description: "Comprehensive computer science program covering algorithms, data structures, and software engineering.",
          requirements: "High school diploma, SAT scores, English proficiency",
          fee: 50000,
          currency: "USD",
          isActive: true
        },
        {
          universityId,
          name: "Master of Business Administration",
          type: "degree",
          level: "postgraduate",
          duration: "2 years",
          description: "Advanced business administration program with focus on leadership and strategy.",
          requirements: "Bachelor's degree, GMAT scores, work experience",
          fee: 75000,
          currency: "USD",
          isActive: true
        },
        {
          universityId,
          name: "Exchange Program - Engineering",
          type: "exchange",
          level: "undergraduate",
          duration: "1 semester",
          description: "Student exchange program for engineering students.",
          requirements: "Current enrollment in engineering program, minimum GPA 3.0",
          fee: 15000,
          currency: "USD",
          isActive: true
        },
        {
          universityId,
          name: "PhD in Data Science",
          type: "degree",
          level: "doctoral",
          duration: "4-6 years",
          description: "Research-focused doctoral program in data science and artificial intelligence.",
          requirements: "Master's degree, research proposal, publications",
          fee: 40000,
          currency: "USD",
          isActive: true
        }
      ];
      
      coursesData.push(...universityCourses);
    }

    const createdCourses = await Course.insertMany(coursesData);
    logger.info(`✅ Created ${createdCourses.length} courses`);

    // Display summary
    logger.info('\n📊 Summary:');
    logger.info(`   Universities: ${createdUniversities.length}`);
    logger.info(`   Courses: ${createdCourses.length}`);
    logger.info(`   Average courses per university: ${(createdCourses.length / createdUniversities.length).toFixed(1)}`);
    
    logger.info('\n🏛️  Universities Created:');
    createdUniversities.forEach(uni => {
      const courseCount = createdCourses.filter(c => c.universityId.toString() === uni._id.toString()).length;
      const country = (uni as any).country || (uni as any).location?.country || 'N/A';
      logger.info(`   - ${uni.name} (${country}) - ${courseCount} courses`);
    });

    logger.info('✅ Seeding completed successfully!');
  } catch (error) {
    logger.error({ error }, '❌ Error seeding universities and courses');
    throw error;
  } finally {
    await disconnect();
    logger.info('👋 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  seedUniversitiesAndCourses()
    .then(() => process.exit(0))
    .catch(err => {
      logger.error(err);
      process.exit(1);
    });
}

export default seedUniversitiesAndCourses;

