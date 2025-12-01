// MongoDB Script to Insert Categories, Subcategories, and Fields
// Usage: mongosh "mongodb://localhost:27017/yourDatabaseName" insert-seed-data.js
// or: mongosh "mongodb://username:password@host:port/yourDatabaseName" insert-seed-data.js

// Categories data
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

print('🚀 Starting database seeding...');
print('');

// Clear existing data
print('🗑️  Clearing existing data...');
db.categories.deleteMany({});
db.fields.deleteMany({});
print('✅ Existing data cleared');
print('');

// Insert categories and build category map
print('📁 Seeding categories...');
const categoryMap = new Map();
const now = new Date();

for (const cat of categoriesData) {
  // Generate ObjectIds for subcategories
  const subcategoriesWithIds = cat.subcategories.map(sub => ({
    _id: new ObjectId(),
    name: sub.name,
    description: sub.description,
    order: sub.order
  }));

  const categoryDoc = {
    name: cat.name,
    icon: cat.icon,
    description: cat.description,
    order: cat.order,
    isCustom: false,
    subcategories: subcategoriesWithIds,
    createdAt: now,
    updatedAt: now,
    __v: 0
  };

  const result = db.categories.insertOne(categoryDoc);
  
  // Store category data for later reference
  categoryMap.set(cat.name, {
    id: result.insertedId,
    subcategories: subcategoriesWithIds
  });

  print(`  ✓ Created: ${cat.name} (${subcategoriesWithIds.length} subcategories)`);
}

print(`✅ Created ${categoriesData.length} categories`);
print('');

// Helper function to get subcategory ID
function getSubId(catName, subName) {
  const cat = categoryMap.get(catName);
  if (!cat) return null;
  const sub = cat.subcategories.find(s => s.name === subName);
  return sub ? sub._id : null;
}

// Helper function to get category ID
function getCatId(catName) {
  const cat = categoryMap.get(catName);
  return cat ? cat.id : null;
}

// Fields data
const fieldsData = [
  // Personal Information - Basic
  { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'Enter your first name', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 0 },
  { name: 'middle_name', label: 'Middle Name', type: 'text', placeholder: 'Enter your middle name', required: false, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 0.5 },
  { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Enter your last name', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 0.7 },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 1 },
  { name: 'gender', label: 'Gender', type: 'select', required: true, options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }, { value: 'prefer_not_to_say', label: 'Prefer not to say' }], categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 2 },
  { name: 'nationality', label: 'Nationality', type: 'country', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 3 },
  { name: 'marital_status', label: 'Marital Status', type: 'select', required: false, options: [{ value: 'single', label: 'Single' }, { value: 'married', label: 'Married' }, { value: 'divorced', label: 'Divorced' }, { value: 'widowed', label: 'Widowed' }], categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Basic Information'), order: 4 },
  
  // Personal Information - Contact
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@example.com', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 1 },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 2 },
  { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '+1234567890', required: false, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 3 },
  { name: 'address_line1', label: 'Address Line 1', type: 'text', placeholder: 'Street address', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 4 },
  { name: 'address_line2', label: 'Address Line 2', type: 'text', placeholder: 'Apartment, suite, etc.', required: false, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 5 },
  { name: 'country', label: 'Country', type: 'country', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 6 },
  { name: 'state', label: 'State/Province', type: 'state', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 7 },
  { name: 'city', label: 'City', type: 'text', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 8 },
  { name: 'postal_code', label: 'Postal/ZIP Code', type: 'text', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Contact Details'), order: 9 },
  
  // Personal Information - Identity
  { name: 'passport_number', label: 'Passport Number', type: 'text', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Identity Documents'), order: 1 },
  { name: 'passport_expiry', label: 'Passport Expiry Date', type: 'date', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Identity Documents'), order: 2 },
  { name: 'national_id', label: 'National ID Number', type: 'text', required: false, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Identity Documents'), order: 3 },
  
  // Emergency Contact
  { name: 'emergency_name', label: 'Emergency Contact Name', type: 'text', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Emergency Contact'), order: 1 },
  { name: 'emergency_relationship', label: 'Relationship', type: 'text', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Emergency Contact'), order: 2 },
  { name: 'emergency_phone', label: 'Emergency Contact Phone', type: 'tel', required: true, categoryId: getCatId('Personal Information'), subcategoryId: getSubId('Personal Information', 'Emergency Contact'), order: 3 },
  
  // Education - High School
  { name: 'high_school_name', label: 'High School Name', type: 'text', required: true, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'High School'), order: 1 },
  { name: 'high_school_country', label: 'Country', type: 'country', required: true, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'High School'), order: 2 },
  { name: 'high_school_graduation_date', label: 'Graduation Date', type: 'date', required: true, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'High School'), order: 3 },
  { name: 'high_school_gpa', label: 'GPA/Percentage', type: 'text', required: true, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'High School'), order: 4 },
  
  // Education - Undergraduate
  { name: 'undergrad_university', label: 'University Name', type: 'text', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Undergraduate'), order: 1 },
  { name: 'undergrad_degree', label: 'Degree', type: 'text', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Undergraduate'), order: 2 },
  { name: 'undergrad_major', label: 'Major/Field of Study', type: 'text', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Undergraduate'), order: 3 },
  { name: 'undergrad_gpa', label: 'GPA', type: 'text', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Undergraduate'), order: 4 },
  { name: 'undergrad_start_date', label: 'Start Date', type: 'date', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Undergraduate'), order: 5 },
  { name: 'undergrad_end_date', label: 'End Date (or Expected)', type: 'date', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Undergraduate'), order: 6 },
  
  // Education - Test Scores
  { name: 'toefl_score', label: 'TOEFL Score', type: 'number', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Test Scores'), order: 1 },
  { name: 'ielts_score', label: 'IELTS Score', type: 'number', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Test Scores'), order: 2 },
  { name: 'gre_score', label: 'GRE Score', type: 'number', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Test Scores'), order: 3 },
  { name: 'gmat_score', label: 'GMAT Score', type: 'number', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Test Scores'), order: 4 },
  { name: 'sat_score', label: 'SAT Score', type: 'number', required: false, categoryId: getCatId('Education'), subcategoryId: getSubId('Education', 'Test Scores'), order: 5 },
  
  // Experience - Work
  { name: 'work_company', label: 'Company Name', type: 'text', required: false, categoryId: getCatId('Experience'), subcategoryId: getSubId('Experience', 'Work Experience'), order: 1 },
  { name: 'work_position', label: 'Position/Title', type: 'text', required: false, categoryId: getCatId('Experience'), subcategoryId: getSubId('Experience', 'Work Experience'), order: 2 },
  { name: 'work_duration', label: 'Duration (months)', type: 'number', required: false, categoryId: getCatId('Experience'), subcategoryId: getSubId('Experience', 'Work Experience'), order: 3 },
  { name: 'work_description', label: 'Job Description', type: 'textarea', required: false, categoryId: getCatId('Experience'), subcategoryId: getSubId('Experience', 'Work Experience'), order: 4 },
  
  // Skills - Languages
  { name: 'native_language', label: 'Native Language', type: 'text', required: true, categoryId: getCatId('Skills & Languages'), subcategoryId: getSubId('Skills & Languages', 'Languages'), order: 1 },
  { name: 'other_languages', label: 'Other Languages', type: 'textarea', placeholder: 'List languages and proficiency levels', required: false, categoryId: getCatId('Skills & Languages'), subcategoryId: getSubId('Skills & Languages', 'Languages'), order: 2 },
  
  // Documents
  { name: 'transcript', label: 'Academic Transcript', type: 'file', required: true, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Academic Documents'), order: 1 },
  { name: 'degree_certificate', label: 'Degree Certificate', type: 'file', required: false, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Academic Documents'), order: 2 },
  { name: 'passport_copy', label: 'Passport Copy', type: 'file', required: true, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Identity Documents'), order: 1 },
  { name: 'photo', label: 'Passport Size Photo', type: 'file', required: true, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Identity Documents'), order: 2 },
  { name: 'bank_statement', label: 'Bank Statement', type: 'file', required: false, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Financial Documents'), order: 1 },
  { name: 'sponsor_letter', label: 'Sponsorship Letter', type: 'file', required: false, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Financial Documents'), order: 2 },
  { name: 'resume', label: 'Resume/CV', type: 'file', required: true, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Other Documents'), order: 1 },
  { name: 'recommendation_letter', label: 'Letter of Recommendation', type: 'file', required: false, categoryId: getCatId('Documents'), subcategoryId: getSubId('Documents', 'Other Documents'), order: 2 },
  
  // Essays
  { name: 'personal_statement', label: 'Personal Statement', type: 'textarea', placeholder: 'Write your personal statement (500-1000 words)', required: true, categoryId: getCatId('Essays & Statements'), order: 1 },
  { name: 'motivation_letter', label: 'Motivation Letter', type: 'textarea', placeholder: 'Explain your motivation for applying', required: false, categoryId: getCatId('Essays & Statements'), order: 2 },
  { name: 'research_proposal', label: 'Research Proposal', type: 'textarea', placeholder: 'Describe your research interests', required: false, categoryId: getCatId('Essays & Statements'), order: 3 },
  
  // References
  { name: 'reference1_name', label: 'Reference 1 - Name', type: 'text', required: false, categoryId: getCatId('References'), order: 1 },
  { name: 'reference1_title', label: 'Reference 1 - Title/Position', type: 'text', required: false, categoryId: getCatId('References'), order: 2 },
  { name: 'reference1_email', label: 'Reference 1 - Email', type: 'email', required: false, categoryId: getCatId('References'), order: 3 },
  { name: 'reference1_phone', label: 'Reference 1 - Phone', type: 'tel', required: false, categoryId: getCatId('References'), order: 4 },
  
  // Financial
  { name: 'funding_source', label: 'Source of Funding', type: 'select', required: true, options: [{ value: 'self', label: 'Self-funded' }, { value: 'family', label: 'Family Support' }, { value: 'scholarship', label: 'Scholarship' }, { value: 'loan', label: 'Education Loan' }, { value: 'employer', label: 'Employer Sponsorship' }, { value: 'government', label: 'Government Sponsorship' }], categoryId: getCatId('Financial Information'), order: 1 },
  { name: 'annual_income', label: 'Annual Family Income', type: 'select', required: false, options: [{ value: 'below_25k', label: 'Below $25,000' }, { value: '25k_50k', label: '$25,000 - $50,000' }, { value: '50k_100k', label: '$50,000 - $100,000' }, { value: '100k_200k', label: '$100,000 - $200,000' }, { value: 'above_200k', label: 'Above $200,000' }], categoryId: getCatId('Financial Information'), order: 2 },
  { name: 'scholarship_interest', label: 'Interested in Scholarships', type: 'checkbox', required: false, categoryId: getCatId('Financial Information'), order: 3 },
  
  // Preferences
  { name: 'preferred_intake', label: 'Preferred Intake', type: 'select', required: true, options: [{ value: 'fall', label: 'Fall' }, { value: 'spring', label: 'Spring' }, { value: 'summer', label: 'Summer' }, { value: 'winter', label: 'Winter' }], categoryId: getCatId('Preferences'), order: 1 },
  { name: 'program_preference', label: 'Program Preference', type: 'select', required: false, options: [{ value: 'on_campus', label: 'On Campus' }, { value: 'online', label: 'Online' }, { value: 'hybrid', label: 'Hybrid' }], categoryId: getCatId('Preferences'), order: 2 },
  { name: 'accommodation_required', label: 'Campus Accommodation Required', type: 'checkbox', required: false, categoryId: getCatId('Preferences'), order: 3 },
].filter(field => field.categoryId); // Filter out any undefined categoryIds

// Insert fields
print('📝 Seeding fields...');
let createdCount = 0;

for (const field of fieldsData) {
  const fieldDoc = {
    ...field,
    isCustom: false,
    createdAt: now,
    updatedAt: now,
    __v: 0
  };
  
  db.fields.insertOne(fieldDoc);
  createdCount++;
  
  if (createdCount % 10 === 0) {
    print(`  ✓ Created ${createdCount} fields...`);
  }
}

print(`✅ Created ${createdCount} fields`);
print('');

// Summary
const subcategoriesCount = categoriesData.reduce((sum, cat) => sum + cat.subcategories.length, 0);

print('🎉 ════════════════════════════════════════════════════════════');
print('🎉 Master Fields & Categories Seeding Completed!');
print('🎉 ════════════════════════════════════════════════════════════');
print('');
print('📊 Summary:');
print(`   Categories:    ${categoriesData.length}`);
print(`   Subcategories: ${subcategoriesCount}`);
print(`   Fields:        ${createdCount}`);
print('');
print('✅ Database seeding completed successfully!');
print('');
print('💡 Verify with:');
print('   db.categories.countDocuments()');
print('   db.fields.countDocuments()');
print('   db.categories.find().pretty()');
print('');

