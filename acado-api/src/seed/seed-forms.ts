// src/seed/seed-forms.ts
import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Category from '../models/Category.js';
import Field from '../models/Field.js';
import { loadEnv } from '../config/env.js';

const { MONGO_URI } = loadEnv();

const sampleForms = [
  {
    name: "University Application Form",
    title: "University Application Form",
    description: "Standard application form for university admission",
    status: "published",
    isLaunched: true,
    isActive: true,
    fields: [
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        placeholder: "Enter your first name",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 1
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        placeholder: "Enter your last name",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 2
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "your.email@example.com",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 3
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+1 (555) 000-0000",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 4
      },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 5
      },
      {
        name: "high_school",
        label: "High School Name",
        type: "text",
        placeholder: "Enter your high school name",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "education",
        order: 6
      },
      {
        name: "graduation_year",
        label: "Graduation Year",
        type: "number",
        placeholder: "2024",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "education",
        order: 7
      },
      {
        name: "gpa",
        label: "GPA",
        type: "number",
        placeholder: "3.5",
        required: false,
        isVisible: true,
        isRequired: false,
        categoryId: "education",
        order: 8
      }
    ]
  },
  {
    name: "Scholarship Application",
    title: "Scholarship Application",
    description: "Application form for scholarship programs",
    status: "published",
    isLaunched: true,
    isActive: true,
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter your full name",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 1
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "your.email@example.com",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 2
      },
      {
        name: "program",
        label: "Program of Interest",
        type: "select",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "education",
        options: [
          { value: "undergraduate", label: "Undergraduate" },
          { value: "graduate", label: "Graduate" },
          { value: "phd", label: "PhD" }
        ],
        order: 3
      },
      {
        name: "essay",
        label: "Personal Statement",
        type: "textarea",
        placeholder: "Tell us about yourself...",
        description: "Maximum 500 words",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "documents",
        order: 4
      },
      {
        name: "transcripts",
        label: "Academic Transcripts",
        type: "file",
        description: "Upload your official transcripts",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "documents",
        order: 5
      }
    ]
  },
  {
    name: "Exchange Program Application",
    title: "Exchange Program Application",
    description: "Application for student exchange programs",
    status: "draft",
    isLaunched: false,
    isActive: true,
    fields: [
      {
        name: "student_name",
        label: "Student Name",
        type: "text",
        placeholder: "Enter your name",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 1
      },
      {
        name: "home_university",
        label: "Home University",
        type: "text",
        placeholder: "Current university",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "education",
        order: 2
      },
      {
        name: "destination_country",
        label: "Preferred Country",
        type: "country",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "preferences",
        order: 3
      },
      {
        name: "language_proficiency",
        label: "Language Proficiency",
        type: "select",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "skills",
        options: [
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
          { value: "native", label: "Native" }
        ],
        order: 4
      }
    ]
  },
  {
    name: "Graduate School Application",
    title: "Graduate School Application",
    description: "Comprehensive application for graduate programs",
    status: "published",
    isLaunched: true,
    isActive: true,
    fields: [
      {
        name: "personal_info",
        label: "Full Name",
        type: "text",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 1
      },
      {
        name: "undergraduate_degree",
        label: "Undergraduate Degree",
        type: "text",
        placeholder: "Bachelor of Science in...",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "education",
        order: 2
      },
      {
        name: "research_interests",
        label: "Research Interests",
        type: "textarea",
        placeholder: "Describe your research interests...",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "experience",
        order: 3
      },
      {
        name: "work_experience",
        label: "Relevant Work Experience",
        type: "textarea",
        placeholder: "List your work experience...",
        required: false,
        isVisible: true,
        isRequired: false,
        categoryId: "experience",
        order: 4
      },
      {
        name: "recommendation_letters",
        label: "Recommendation Letters",
        type: "file",
        description: "Upload 2-3 recommendation letters",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "references",
        order: 5
      }
    ]
  },
  {
    name: "Internship Application",
    title: "Internship Application",
    description: "Application form for internship opportunities",
    status: "archived",
    isLaunched: false,
    isActive: false,
    fields: [
      {
        name: "applicant_name",
        label: "Your Name",
        type: "text",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 1
      },
      {
        name: "email_address",
        label: "Email",
        type: "email",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "personal",
        order: 2
      },
      {
        name: "resume",
        label: "Resume/CV",
        type: "file",
        description: "Upload your resume",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "documents",
        order: 3
      },
      {
        name: "cover_letter",
        label: "Cover Letter",
        type: "textarea",
        placeholder: "Write your cover letter...",
        required: true,
        isVisible: true,
        isRequired: true,
        categoryId: "documents",
        order: 4
      }
    ]
  }
];

async function seedForms() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get categories to map field categoryIds
    const categories = await Category.find({});
    const categoryMap: Record<string, string> = {};
    
    categories.forEach(cat => {
      const key = cat.name.toLowerCase().replace(/\s+/g, '_');
      categoryMap[key] = cat._id.toString();
    });

    // Clear existing forms
    await Form.deleteMany({});
    console.log('🗑️  Cleared existing forms');

    // Create forms with proper category IDs
    const formsToCreate = sampleForms.map(form => ({
      ...form,
      fields: form.fields.map(field => ({
        ...field,
        categoryId: categoryMap[field.categoryId] || categoryMap['personal_information'] || categories[0]?._id?.toString() || field.categoryId
      }))
    }));

    const createdForms = await Form.insertMany(formsToCreate);
    
    console.log(`✅ Created ${createdForms.length} sample forms:`);
    createdForms.forEach(form => {
      console.log(`   - ${form.name} (${form.status}) - ${form.fields.length} fields`);
    });

    console.log('\n📊 Form Statistics:');
    const published = createdForms.filter(f => f.status === 'published').length;
    const draft = createdForms.filter(f => f.status === 'draft').length;
    const archived = createdForms.filter(f => f.status === 'archived').length;
    console.log(`   Published: ${published}`);
    console.log(`   Draft: ${draft}`);
    console.log(`   Archived: ${archived}`);

  } catch (error) {
    console.error('❌ Error seeding forms:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedForms()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

export default seedForms;

