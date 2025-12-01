// src/seed/seed.ts
import { connect, disconnect } from '../db/mongoose.js';
import { loadEnv } from '../config/env.js';
import Category from '../models/Category.js';
import Field from '../models/Field.js';
import logger from '../utils/logger.js';

const { MONGO_URI } = loadEnv();

// Categories data from frontend
const categoriesData = [
  {
    name: 'Personal Information',
    icon: 'User',
    description: 'Basic personal details and contact information',
    order: 1,
    subcategories: [
      { name: 'Basic Information', description: '', order: 1 },
      { name: 'Contact Details', description: '', order: 2 },
      { name: 'Identity Documents', description: '', order: 3 },
      { name: 'Emergency Contact', description: '', order: 4 },
    ]
  },
  {
    name: 'Education',
    icon: 'GraduationCap',
    description: 'Academic qualifications and educational background',
    order: 2,
    subcategories: [
      { name: 'High School', description: '', order: 1 },
      { name: 'Undergraduate', description: '', order: 2 },
      { name: 'Postgraduate', description: '', order: 3 },
      { name: 'Test Scores', description: '', order: 4 },
    ]
  },
  {
    name: 'Experience',
    icon: 'Briefcase',
    description: 'Professional and work experience',
    order: 3,
    subcategories: [
      { name: 'Work Experience', description: '', order: 1 },
      { name: 'Internships', description: '', order: 2 },
      { name: 'Volunteering', description: '', order: 3 },
    ]
  },
  {
    name: 'Projects & Research',
    icon: 'Lightbulb',
    description: 'Academic projects, research work, and publications',
    order: 4,
    subcategories: [
      { name: 'Academic Projects', description: '', order: 1 },
      { name: 'Research Papers', description: '', order: 2 },
      { name: 'Publications', description: '', order: 3 },
    ]
  },
  {
    name: 'Skills & Languages',
    icon: 'Award',
    description: 'Technical skills, languages, and certifications',
    order: 5,
    subcategories: [
      { name: 'Technical Skills', description: '', order: 1 },
      { name: 'Languages', description: '', order: 2 },
      { name: 'Certifications', description: '', order: 3 },
    ]
  },
  {
    name: 'Documents',
    icon: 'FileText',
    description: 'Required documents and uploads',
    order: 6,
    subcategories: [
      { name: 'Academic Documents', description: '', order: 1 },
      { name: 'Identity Documents', description: '', order: 2 },
      { name: 'Financial Documents', description: '', order: 3 },
      { name: 'Other Documents', description: '', order: 4 },
    ]
  },
  {
    name: 'Essays & Statements',
    icon: 'PenTool',
    description: 'Personal statements, essays, and motivation letters',
    order: 7,
    subcategories: []
  },
  {
    name: 'References',
    icon: 'Users',
    description: 'Academic and professional references',
    order: 8,
    subcategories: []
  },
  {
    name: 'Financial Information',
    icon: 'DollarSign',
    description: 'Financial details and sponsorship information',
    order: 9,
    subcategories: []
  },
  {
    name: 'Preferences',
    icon: 'Settings',
    description: 'Course preferences and program choices',
    order: 10,
    subcategories: []
  }
];

// Fields data from frontend
const getFieldsData = (categoryMap: Map<string, any>) => {
  const personal = categoryMap.get('Personal Information');
  const education = categoryMap.get('Education');
  const experience = categoryMap.get('Experience');
  const skills = categoryMap.get('Skills & Languages');
  const documents = categoryMap.get('Documents');
  const essays = categoryMap.get('Essays & Statements');
  const references = categoryMap.get('References');
  const financial = categoryMap.get('Financial Information');
  const preferences = categoryMap.get('Preferences');

  const getSubId = (cat: any, name: string) => cat?.subcategories.find((s: any) => s.name === name)?.id;

  return [
    // Personal Information - Basic
    { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'Enter your first name', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 0 },
    { name: 'middle_name', label: 'Middle Name', type: 'text', placeholder: 'Enter your middle name', required: false, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 0.5 },
    { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Enter your last name', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 0.7 },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 1 },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }, { value: 'prefer_not_to_say', label: 'Prefer not to say' }], categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 2 },
    { name: 'nationality', label: 'Nationality', type: 'country', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 3 },
    { name: 'marital_status', label: 'Marital Status', type: 'select', required: false, options: [{ value: 'single', label: 'Single' }, { value: 'married', label: 'Married' }, { value: 'divorced', label: 'Divorced' }, { value: 'widowed', label: 'Widowed' }], categoryId: personal?.id, subcategoryId: getSubId(personal, 'Basic Information'), order: 4 },
    
    // Personal Information - Contact
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@example.com', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 1 },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 2 },
    { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '+1234567890', required: false, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 3 },
    { name: 'address_line1', label: 'Address Line 1', type: 'text', placeholder: 'Street address', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 4 },
    { name: 'address_line2', label: 'Address Line 2', type: 'text', placeholder: 'Apartment, suite, etc.', required: false, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 5 },
    { name: 'country', label: 'Country', type: 'country', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 6 },
    { name: 'state', label: 'State/Province', type: 'state', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 7 },
    { name: 'city', label: 'City', type: 'text', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 8 },
    { name: 'postal_code', label: 'Postal/ZIP Code', type: 'text', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Contact Details'), order: 9 },
    
    // Personal Information - Identity
    { name: 'passport_number', label: 'Passport Number', type: 'text', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Identity Documents'), order: 1 },
    { name: 'passport_expiry', label: 'Passport Expiry Date', type: 'date', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Identity Documents'), order: 2 },
    { name: 'national_id', label: 'National ID Number', type: 'text', required: false, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Identity Documents'), order: 3 },
    
    // Emergency Contact
    { name: 'emergency_name', label: 'Emergency Contact Name', type: 'text', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Emergency Contact'), order: 1 },
    { name: 'emergency_relationship', label: 'Relationship', type: 'text', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Emergency Contact'), order: 2 },
    { name: 'emergency_phone', label: 'Emergency Contact Phone', type: 'tel', required: true, categoryId: personal?.id, subcategoryId: getSubId(personal, 'Emergency Contact'), order: 3 },
    
    // Education - High School
    { name: 'high_school_name', label: 'High School Name', type: 'text', required: true, categoryId: education?.id, subcategoryId: getSubId(education, 'High School'), order: 1 },
    { name: 'high_school_country', label: 'Country', type: 'country', required: true, categoryId: education?.id, subcategoryId: getSubId(education, 'High School'), order: 2 },
    { name: 'high_school_graduation_date', label: 'Graduation Date', type: 'date', required: true, categoryId: education?.id, subcategoryId: getSubId(education, 'High School'), order: 3 },
    { name: 'high_school_gpa', label: 'GPA/Percentage', type: 'text', required: true, categoryId: education?.id, subcategoryId: getSubId(education, 'High School'), order: 4 },
    
    // Education - Undergraduate
    { name: 'undergrad_university', label: 'University Name', type: 'text', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Undergraduate'), order: 1 },
    { name: 'undergrad_degree', label: 'Degree', type: 'text', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Undergraduate'), order: 2 },
    { name: 'undergrad_major', label: 'Major/Field of Study', type: 'text', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Undergraduate'), order: 3 },
    { name: 'undergrad_gpa', label: 'GPA', type: 'text', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Undergraduate'), order: 4 },
    { name: 'undergrad_start_date', label: 'Start Date', type: 'date', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Undergraduate'), order: 5 },
    { name: 'undergrad_end_date', label: 'End Date (or Expected)', type: 'date', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Undergraduate'), order: 6 },
    
    // Education - Test Scores
    { name: 'toefl_score', label: 'TOEFL Score', type: 'number', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Test Scores'), order: 1 },
    { name: 'ielts_score', label: 'IELTS Score', type: 'number', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Test Scores'), order: 2 },
    { name: 'gre_score', label: 'GRE Score', type: 'number', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Test Scores'), order: 3 },
    { name: 'gmat_score', label: 'GMAT Score', type: 'number', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Test Scores'), order: 4 },
    { name: 'sat_score', label: 'SAT Score', type: 'number', required: false, categoryId: education?.id, subcategoryId: getSubId(education, 'Test Scores'), order: 5 },
    
    // Experience - Work
    { name: 'work_company', label: 'Company Name', type: 'text', required: false, categoryId: experience?.id, subcategoryId: getSubId(experience, 'Work Experience'), order: 1 },
    { name: 'work_position', label: 'Position/Title', type: 'text', required: false, categoryId: experience?.id, subcategoryId: getSubId(experience, 'Work Experience'), order: 2 },
    { name: 'work_duration', label: 'Duration (months)', type: 'number', required: false, categoryId: experience?.id, subcategoryId: getSubId(experience, 'Work Experience'), order: 3 },
    { name: 'work_description', label: 'Job Description', type: 'textarea', required: false, categoryId: experience?.id, subcategoryId: getSubId(experience, 'Work Experience'), order: 4 },
    
    // Skills - Languages
    { name: 'native_language', label: 'Native Language', type: 'text', required: true, categoryId: skills?.id, subcategoryId: getSubId(skills, 'Languages'), order: 1 },
    { name: 'other_languages', label: 'Other Languages', type: 'textarea', placeholder: 'List languages and proficiency levels', required: false, categoryId: skills?.id, subcategoryId: getSubId(skills, 'Languages'), order: 2 },
    
    // Documents
    { name: 'transcript', label: 'Academic Transcript', type: 'file', required: true, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Academic Documents'), order: 1 },
    { name: 'degree_certificate', label: 'Degree Certificate', type: 'file', required: false, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Academic Documents'), order: 2 },
    { name: 'passport_copy', label: 'Passport Copy', type: 'file', required: true, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Identity Documents'), order: 1 },
    { name: 'photo', label: 'Passport Size Photo', type: 'file', required: true, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Identity Documents'), order: 2 },
    { name: 'bank_statement', label: 'Bank Statement', type: 'file', required: false, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Financial Documents'), order: 1 },
    { name: 'sponsor_letter', label: 'Sponsorship Letter', type: 'file', required: false, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Financial Documents'), order: 2 },
    { name: 'resume', label: 'Resume/CV', type: 'file', required: true, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Other Documents'), order: 1 },
    { name: 'recommendation_letter', label: 'Letter of Recommendation', type: 'file', required: false, categoryId: documents?.id, subcategoryId: getSubId(documents, 'Other Documents'), order: 2 },
    
    // Essays
    { name: 'personal_statement', label: 'Personal Statement', type: 'textarea', placeholder: 'Write your personal statement (500-1000 words)', required: true, categoryId: essays?.id, order: 1 },
    { name: 'motivation_letter', label: 'Motivation Letter', type: 'textarea', placeholder: 'Explain your motivation for applying', required: false, categoryId: essays?.id, order: 2 },
    { name: 'research_proposal', label: 'Research Proposal', type: 'textarea', placeholder: 'Describe your research interests', required: false, categoryId: essays?.id, order: 3 },
    
    // References
    { name: 'reference1_name', label: 'Reference 1 - Name', type: 'text', required: false, categoryId: references?.id, order: 1 },
    { name: 'reference1_title', label: 'Reference 1 - Title/Position', type: 'text', required: false, categoryId: references?.id, order: 2 },
    { name: 'reference1_email', label: 'Reference 1 - Email', type: 'email', required: false, categoryId: references?.id, order: 3 },
    { name: 'reference1_phone', label: 'Reference 1 - Phone', type: 'tel', required: false, categoryId: references?.id, order: 4 },
    
    // Financial
    { name: 'funding_source', label: 'Source of Funding', type: 'select', required: true, options: [{ value: 'self', label: 'Self-funded' }, { value: 'family', label: 'Family Support' }, { value: 'scholarship', label: 'Scholarship' }, { value: 'loan', label: 'Education Loan' }, { value: 'employer', label: 'Employer Sponsorship' }, { value: 'government', label: 'Government Sponsorship' }], categoryId: financial?.id, order: 1 },
    { name: 'annual_income', label: 'Annual Family Income', type: 'select', required: false, options: [{ value: 'below_25k', label: 'Below $25,000' }, { value: '25k_50k', label: '$25,000 - $50,000' }, { value: '50k_100k', label: '$50,000 - $100,000' }, { value: '100k_200k', label: '$100,000 - $200,000' }, { value: 'above_200k', label: 'Above $200,000' }], categoryId: financial?.id, order: 2 },
    { name: 'scholarship_interest', label: 'Interested in Scholarships', type: 'checkbox', required: false, categoryId: financial?.id, order: 3 },
    
    // Preferences
    { name: 'preferred_intake', label: 'Preferred Intake', type: 'select', required: true, options: [{ value: 'fall', label: 'Fall' }, { value: 'spring', label: 'Spring' }, { value: 'summer', label: 'Summer' }, { value: 'winter', label: 'Winter' }], categoryId: preferences?.id, order: 1 },
    { name: 'program_preference', label: 'Program Preference', type: 'select', required: false, options: [{ value: 'on_campus', label: 'On Campus' }, { value: 'online', label: 'Online' }, { value: 'hybrid', label: 'Hybrid' }], categoryId: preferences?.id, order: 2 },
    { name: 'accommodation_required', label: 'Campus Accommodation Required', type: 'checkbox', required: false, categoryId: preferences?.id, order: 3 },
  ].filter(field => field.categoryId); // Filter out any undefined categoryIds
};

async function seed() {
  try {
    console.log('🚀 Starting database seeding...');
    console.log('Connecting to MongoDB...');
    await connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Field.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('📁 Seeding categories...');
    const categoryMap = new Map();
    
    for (const cat of categoriesData) {
      const created = await Category.create({
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        order: cat.order,
        isCustom: false,
        subcategories: cat.subcategories
      });
      
      const catJson = created.toJSON();
      categoryMap.set(cat.name, catJson);
      console.log(`  ✓ Created: ${cat.name} (${catJson.subcategories.length} subcategories)`);
    }
    console.log(`✅ Created ${categoriesData.length} categories`);

    console.log('📝 Seeding fields...');
    const fieldsData = getFieldsData(categoryMap);
    let createdCount = 0;
    
    for (const field of fieldsData) {
      await Field.create({ ...field, isCustom: false });
      createdCount++;
      if (createdCount % 10 === 0) {
        console.log(`  ✓ Created ${createdCount} fields...`);
      }
    }
    console.log(`✅ Created ${createdCount} fields`);

    console.log('');
    console.log('🎉 ════════════════════════════════════════════════════════════');
    console.log('🎉 Master Fields & Categories Seeding Completed!');
    console.log('🎉 ════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Categories:    ${categoriesData.length}`);
    console.log(`   Subcategories: ${categoriesData.reduce((sum, cat) => sum + cat.subcategories.length, 0)}`);
    console.log(`   Fields:        ${createdCount}`);
    console.log('');
    console.log('💡 Next Steps - Load Additional Data:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   npm run seed:users        # Create default users (admin, editor, user)');
    console.log('   npm run seed:universities # Load sample universities (includes courses)');
    console.log('   npm run seed:courses      # Load additional courses (if universities exist)');
    console.log('   npm run seed:forms        # Load sample application forms');
    console.log('   npm run seed:check        # Check database status');
    console.log('');
    console.log('🔗 API Endpoints:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   http://localhost:4000/health');
    console.log('   http://localhost:4000/masterCategories');
    console.log('   http://localhost:4000/masterFields');
    console.log('   http://localhost:4000/docs (Swagger UI)');
    console.log('');
    
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    throw error;
  } finally {
    await disconnect();
    console.log('👋 Database connection closed');
  }
}

// Run seed if called directly
// Always run when this file is executed
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

export default seed;
