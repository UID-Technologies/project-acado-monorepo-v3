/*
 * Generate Sample Data Script for MongoDB Shell (mongosh)
 * 
 * This script generates temporary sample data (5-6 records) for each collection
 * to facilitate testing of the acado-api application.
 * 
 * Prerequisites:
 * - Users, Universities, Locations, Categories, and Fields must already exist
 * 
 * Usage:
 *   mongosh acadodb scripts/generate-sample-data.js
 * 
 * Or with custom database:
 *   mongosh "mongodb://localhost:27017/acadodb" scripts/generate-sample-data.js
 * 
 * Note: This script is idempotent - it can be run multiple times safely.
 * It will skip creating records if they already exist (based on unique fields).
 */

if (typeof db === "undefined") {
  throw new Error("This script must be run inside mongosh (db is undefined).");
}

print("🚀 Starting sample data generation...\n");

// Helper function to get random element from array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to get random elements from array
function getRandomElements(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

// Helper function to generate random date in the future
function getFutureDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

// Helper function to generate random date in the past
function getPastDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

// Get existing data for references
print("📋 Fetching existing data for references...\n");

var users = db.users.find({}).toArray();
var universities = db.universities.find({}).toArray();
var categories = db.categories.find({}).toArray();
var fields = db.fields.find({}).toArray();
var locations = db.locations.find({}).toArray();

if (users.length === 0) {
  print("❌ ERROR: No users found. Please create users first.");
  quit(1);
}

if (universities.length === 0) {
  print("❌ ERROR: No universities found. Please create universities first.");
  quit(1);
}

if (categories.length === 0) {
  print("❌ ERROR: No categories found. Please create categories first.");
  quit(1);
}

if (fields.length === 0) {
  print("❌ ERROR: No fields found. Please create fields first.");
  quit(1);
}

print("✓ Found " + users.length + " users");
print("✓ Found " + universities.length + " universities");
print("✓ Found " + categories.length + " categories");
print("✓ Found " + fields.length + " fields");
print("✓ Found " + locations.length + " locations\n");

// Get IDs
var userIds = users.map(u => u._id);
var universityIds = universities.map(u => u._id);
var categoryIds = categories.map(c => c._id);
var fieldIds = fields.map(f => f._id);
var locationIds = locations.map(l => l._id);

// ============================================================================
// 1. COURSE CATEGORIES, LEVELS, TYPES (if not exist)
// ============================================================================
print("📚 Creating Course Categories, Levels, and Types...\n");

// Course Categories
var courseCategories = [
  { name: "Computer Science", shortName: "CS", code: "CS", isActive: true },
  { name: "Business Administration", shortName: "BA", code: "BA", isActive: true },
  { name: "Engineering", shortName: "ENG", code: "ENG", isActive: true },
  { name: "Arts & Humanities", shortName: "AH", code: "AH", isActive: true },
  { name: "Health Sciences", shortName: "HS", code: "HS", isActive: true },
  { name: "Social Sciences", shortName: "SS", code: "SS", isActive: true }
];

var courseCategoryIds = [];
courseCategories.forEach(function(cat) {
  var existing = db.coursecategories.findOne({ name: cat.name });
  if (!existing) {
    var result = db.coursecategories.insertOne(cat);
    courseCategoryIds.push(result.insertedId);
    print("  ✓ Created course category: " + cat.name);
  } else {
    courseCategoryIds.push(existing._id);
    print("  ⊙ Course category already exists: " + cat.name);
  }
});

// Course Levels
var courseLevels = [
  { name: "Undergraduate", shortName: "UG", isActive: true },
  { name: "Postgraduate", shortName: "PG", isActive: true },
  { name: "Doctoral", shortName: "PhD", isActive: true },
  { name: "Diploma", shortName: "DIP", isActive: true },
  { name: "Certificate", shortName: "CERT", isActive: true }
];

var courseLevelIds = [];
courseLevels.forEach(function(level) {
  var existing = db.courselevels.findOne({ name: level.name });
  if (!existing) {
    var result = db.courselevels.insertOne(level);
    courseLevelIds.push(result.insertedId);
    print("  ✓ Created course level: " + level.name);
  } else {
    courseLevelIds.push(existing._id);
    print("  ⊙ Course level already exists: " + level.name);
  }
});

// Course Types
var courseTypes = [
  { name: "Degree", shortName: "DEG", isActive: true },
  { name: "Exchange", shortName: "EXC", isActive: true },
  { name: "Pathway", shortName: "PTH", isActive: true },
  { name: "Diploma", shortName: "DIP", isActive: true },
  { name: "Certification", shortName: "CERT", isActive: true }
];

var courseTypeIds = [];
courseTypes.forEach(function(type) {
  var existing = db.coursetypes.findOne({ name: type.name });
  if (!existing) {
    var result = db.coursetypes.insertOne(type);
    courseTypeIds.push(result.insertedId);
    print("  ✓ Created course type: " + type.name);
  } else {
    courseTypeIds.push(existing._id);
    print("  ⊙ Course type already exists: " + type.name);
  }
});

// ============================================================================
// 2. LEARNING OUTCOMES
// ============================================================================
print("\n🎯 Creating Learning Outcomes...\n");

var learningOutcomes = [
  { name: "Critical Thinking", shortName: "CT", code: "LO001", isActive: true },
  { name: "Problem Solving", shortName: "PS", code: "LO002", isActive: true },
  { name: "Communication Skills", shortName: "CS", code: "LO003", isActive: true },
  { name: "Team Collaboration", shortName: "TC", code: "LO004", isActive: true },
  { name: "Technical Proficiency", shortName: "TP", code: "LO005", isActive: true },
  { name: "Research Methodology", shortName: "RM", code: "LO006", isActive: true }
];

var learningOutcomeIds = [];
learningOutcomes.forEach(function(lo) {
  var existing = db.learningoutcomes.findOne({ code: lo.code });
  if (!existing) {
    var result = db.learningoutcomes.insertOne(lo);
    learningOutcomeIds.push(result.insertedId);
    print("  ✓ Created learning outcome: " + lo.name);
  } else {
    learningOutcomeIds.push(existing._id);
    print("  ⊙ Learning outcome already exists: " + lo.name);
  }
});

// ============================================================================
// 3. COURSES
// ============================================================================
print("\n📖 Creating Courses...\n");

var courseNames = [
  "Introduction to Computer Science",
  "Business Management Fundamentals",
  "Mechanical Engineering Principles",
  "Digital Art and Design",
  "Public Health Essentials",
  "Psychology and Human Behavior"
];

var courseDescriptions = [
  "A comprehensive introduction to computer science concepts, programming fundamentals, and software development practices.",
  "Learn the core principles of business management, including leadership, strategy, and organizational behavior.",
  "Explore the fundamental principles of mechanical engineering, including mechanics, thermodynamics, and materials science.",
  "Discover the world of digital art and design, covering graphic design, digital illustration, and multimedia creation.",
  "Understand public health principles, epidemiology, and health promotion strategies for communities.",
  "Study human psychology, behavior patterns, cognitive processes, and mental health awareness."
];

for (var i = 0; i < 6; i++) {
  var course = {
    universityId: getRandomElement(universityIds),
    name: courseNames[i],
    shortName: courseNames[i].substring(0, 20),
    courseCode: "CRS" + String(i + 1).padStart(3, "0"),
    type: getRandomElement(["degree", "exchange", "pathway", "diploma", "certification"]),
    typeId: getRandomElement(courseTypeIds),
    level: getRandomElement(["undergraduate", "postgraduate", "doctoral"]),
    levelId: getRandomElement(courseLevelIds),
    categoryId: getRandomElement(courseCategoryIds),
    duration: (i + 1) + " years",
    description: courseDescriptions[i],
    keywords: "education, learning, academic",
    fee: Math.floor(Math.random() * 50000) + 10000,
    currency: "USD",
    startDate: getFutureDate(30 + i * 10),
    endDate: getFutureDate(400 + i * 10),
    applicationDeadline: getFutureDate(20 + i * 5),
    learningOutcomeIds: getRandomElements(learningOutcomeIds, 3),
    isActive: true,
    campaign: {
      modeOfDelivery: getRandomElement(["Online", "On-campus", "Hybrid"]),
      aboutCourse: courseDescriptions[i],
      rating: (Math.random() * 2 + 3).toFixed(1),
      noOfPeopleRated: Math.floor(Math.random() * 500) + 50
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  var existing = db.courses.findOne({ courseCode: course.courseCode });
  if (!existing) {
    var result = db.courses.insertOne(course);
    print("  ✓ Created course: " + course.name);
  } else {
    print("  ⊙ Course already exists: " + course.name);
  }
}

var courseIds = db.courses.find({}).map(c => c._id);

// ============================================================================
// 4. FORMS
// ============================================================================
print("\n📝 Creating Forms...\n");

var formTitles = [
  "University Application Form",
  "Course Enrollment Form",
  "Scholarship Application",
  "Event Registration",
  "Student Feedback Form",
  "Internship Application"
];

for (var i = 0; i < 6; i++) {
  var formFields = getRandomElements(fieldIds, 3).map(function(fieldId, idx) {
    var field = fields.find(f => f._id.toString() === fieldId.toString());
    return {
      fieldId: fieldId.toString(),
      name: field ? field.name : "field_" + idx,
      label: field ? field.label : "Field " + (idx + 1),
      type: field ? field.type : "text",
      required: idx === 0,
      isVisible: true,
      isRequired: idx === 0,
      categoryId: getRandomElement(categoryIds).toString(),
      order: idx
    };
  });

  var form = {
    name: formTitles[i].toLowerCase().replace(/\s+/g, "-"),
    title: formTitles[i],
    description: "Application form for " + formTitles[i].toLowerCase(),
    organizationId: getRandomElement(universityIds).toString(),
    universityId: getRandomElement(universityIds).toString(),
    courseIds: getRandomElements(courseIds, 2).map(id => id.toString()),
    fields: formFields,
    status: getRandomElement(["draft", "published", "archived"]),
    isLaunched: Math.random() > 0.5,
    isActive: true,
    startDate: getPastDate(10),
    endDate: getFutureDate(90),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  var existing = db.forms.findOne({ name: form.name });
  if (!existing) {
    var result = db.forms.insertOne(form);
    print("  ✓ Created form: " + form.title);
  } else {
    print("  ⊙ Form already exists: " + form.title);
  }
}

var formIds = db.forms.find({}).map(f => f._id);

// ============================================================================
// 5. APPLICATIONS
// ============================================================================
print("\n📋 Creating Applications...\n");

var applicationStatuses = ["draft", "submitted", "under_review", "shortlisted", "accepted", "rejected"];

for (var i = 0; i < 6; i++) {
  var application = {
    userId: getRandomElement(userIds).toString(),
    universityId: getRandomElement(universityIds).toString(),
    courseId: getRandomElement(courseIds).toString(),
    formId: getRandomElement(formIds).toString(),
    formData: {
      firstName: "John",
      lastName: "Doe" + i,
      email: "john.doe" + i + "@example.com",
      phone: "+1234567890" + i,
      address: "123 Main St, City " + i
    },
    status: getRandomElement(applicationStatuses),
    submittedAt: Math.random() > 0.3 ? getPastDate(Math.floor(Math.random() * 30)) : null,
    reviewedAt: Math.random() > 0.5 ? getPastDate(Math.floor(Math.random() * 10)) : null,
    reviewedBy: Math.random() > 0.6 ? getRandomElement(userIds).toString() : null,
    reviewNotes: Math.random() > 0.7 ? "Application reviewed and " + getRandomElement(["approved", "needs more information", "rejected"]) : null,
    metadata: {
      ipAddress: "192.168.1." + (100 + i),
      userAgent: "Mozilla/5.0",
      completionTime: Math.floor(Math.random() * 600) + 60
    },
    createdAt: getPastDate(30 - i * 5),
    updatedAt: new Date()
  };

  var result = db.applications.insertOne(application);
  print("  ✓ Created application #" + (i + 1) + " with status: " + application.status);
}

// ============================================================================
// 6. COMMUNITY CATEGORIES
// ============================================================================
print("\n👥 Creating Community Categories...\n");

var communityCategoryNames = [
  "Technology",
  "Business & Entrepreneurship",
  "Arts & Culture",
  "Science & Research",
  "Sports & Fitness",
  "Education & Learning"
];

var communityCategoryIds = [];
communityCategoryNames.forEach(function(name, idx) {
  var category = {
    name: name,
    color: ["#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#F5FF33", "#33FFF5"][idx],
    createdBy: getRandomElement(userIds),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  var existing = db.communitycategories.findOne({ name: name });
  if (!existing) {
    var result = db.communitycategories.insertOne(category);
    communityCategoryIds.push(result.insertedId);
    print("  ✓ Created community category: " + name);
  } else {
    communityCategoryIds.push(existing._id);
    print("  ⊙ Community category already exists: " + name);
  }
});

// ============================================================================
// 7. COMMUNITY POSTS
// ============================================================================
print("\n💬 Creating Community Posts...\n");

var postTitles = [
  "Welcome to our Technology Community!",
  "Business Networking Event Next Week",
  "New Art Exhibition Opening",
  "Latest Research Findings Published",
  "Join our Sports Club!",
  "Free Online Learning Resources"
];

var postDescriptions = [
  "Join us for discussions about the latest in technology, programming, and innovation.",
  "Network with fellow entrepreneurs and business professionals at our upcoming event.",
  "We're excited to announce our new art exhibition featuring local artists.",
  "Our research team has published groundbreaking findings in the latest journal.",
  "Get active and join our sports club for weekly activities and competitions.",
  "Access free online courses and learning materials to enhance your skills."
];

var contentTypes = ["images", "notes", "videos"];

for (var i = 0; i < 6; i++) {
  var contentType = getRandomElement(contentTypes);
  var post = {
    title: postTitles[i],
    description: postDescriptions[i],
    contentType: contentType,
    categoryId: getRandomElement(communityCategoryIds),
    thumbnail: contentType === "images" ? "https://example.com/thumb" + i + ".jpg" : null,
    media: contentType === "videos" ? "https://example.com/video" + i + ".mp4" : null,
    isPinned: i === 0,
    createdBy: getRandomElement(userIds),
    createdAt: getPastDate(20 - i * 3),
    updatedAt: new Date()
  };

  var result = db.communityposts.insertOne(post);
  print("  ✓ Created community post: " + post.title);
}

// ============================================================================
// 8. WALL POSTS
// ============================================================================
print("\n📌 Creating Wall Posts...\n");

var wallPostDescriptions = [
  "Excited to share my latest project! Check it out and let me know what you think.",
  "Just completed an amazing course on machine learning. Highly recommend!",
  "Looking for collaborators for an open-source project. Anyone interested?",
  "Attended a great workshop today. Learned so much about web development.",
  "Sharing some tips and tricks I learned during my internship experience.",
  "New blog post is up! Read about the latest trends in technology."
];

for (var i = 0; i < 6; i++) {
  var hasMedia = Math.random() > 0.3;
  var post = {
    description: wallPostDescriptions[i],
    media: hasMedia ? "https://example.com/media" + i + (Math.random() > 0.5 ? ".jpg" : ".mp4") : null,
    mediaType: hasMedia ? (Math.random() > 0.5 ? "image" : "video") : null,
    createdBy: getRandomElement(userIds),
    createdAt: getPastDate(15 - i * 2),
    updatedAt: new Date()
  };

  var result = db.wallposts.insertOne(post);
  print("  ✓ Created wall post #" + (i + 1));
}

// ============================================================================
// 9. REELS
// ============================================================================
print("\n🎬 Creating Reels...\n");

var reelTitles = [
  "Quick Coding Tips",
  "Study Hacks for Students",
  "Career Advice",
  "Tech News Update",
  "Motivational Monday",
  "Learning Resources"
];

var reelCategories = ["Education", "Technology", "Motivation", "Tips", "News", "Learning"];

for (var i = 0; i < 6; i++) {
  var reel = {
    title: reelTitles[i],
    description: "Short video content about " + reelTitles[i].toLowerCase(),
    category: reelCategories[i],
    tags: [reelCategories[i].toLowerCase(), "video", "short"],
    videoUrl: "https://example.com/reels/video" + i + ".mp4",
    thumbnailUrl: "https://example.com/reels/thumb" + i + ".jpg",
    duration: Math.floor(Math.random() * 60) + 15, // 15-75 seconds
    language: "en",
    visibility: getRandomElement(["public", "organization", "private"]),
    status: getRandomElement(["draft", "active", "inactive"]),
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 500),
    createdBy: getRandomElement(userIds),
    publishedAt: Math.random() > 0.3 ? getPastDate(10 - i) : null,
    createdAt: getPastDate(12 - i),
    updatedAt: new Date()
  };

  var result = db.reels.insertOne(reel);
  print("  ✓ Created reel: " + reel.title);
}

// ============================================================================
// 10. EVENTS
// ============================================================================
print("\n🎉 Creating Events...\n");

var eventTitles = [
  "Tech Innovation Summit 2024",
  "Business Networking Workshop",
  "Art & Design Exhibition",
  "Science Research Conference",
  "Sports Championship 2024",
  "Educational Webinar Series"
];

var eventDescriptions = [
  "Join us for a day of innovation, networking, and learning about the latest in technology.",
  "Connect with industry leaders and expand your professional network.",
  "Explore amazing artworks from talented local and international artists.",
  "Present your research and learn from experts in various scientific fields.",
  "Compete in our annual sports championship featuring multiple events.",
  "Attend our free educational webinars covering various topics and skills."
];

for (var i = 0; i < 6; i++) {
  var eventDate = getFutureDate(30 + i * 7);
  var event = {
    title: eventTitles[i],
    categoryTags: getRandomElements(["Technology", "Business", "Education", "Arts", "Science"], 2),
    conductedBy: universities[Math.floor(Math.random() * universities.length)].name || "ACADO",
    functionalDomain: getRandomElement(["IT", "Business", "Arts", "Science", "Education"]),
    jobRole: getRandomElement(["Developer", "Manager", "Designer", "Researcher", "Student"]),
    skills: getRandomElements(["Leadership", "Communication", "Technical", "Creative", "Analytical"], 3),
    difficultyLevel: getRandomElement(["beginner", "intermediate", "advanced"]),
    subscriptionType: getRandomElement(["free", "paid"]),
    isPopular: i < 2,
    description: eventDescriptions[i],
    whatsInItForYou: "Learn new skills, network with professionals, and advance your career.",
    instructions: "Register online, attend the event, and participate in activities.",
    registrationStartDate: getPastDate(5),
    registrationEndDate: getFutureDate(25 + i * 5),
    eventDate: eventDate,
    eventTime: "10:00 AM - 5:00 PM",
    mode: getRandomElement(["online", "offline", "hybrid"]),
    venue: Math.random() > 0.5 ? "Main Auditorium, " + (locations.length > 0 ? locations[0].name : "City Center") : null,
    eligibility: {
      type: getRandomElement(["everyone", "students", "professionals", "custom"]),
      genderRestriction: "all"
    },
    registrationSettings: {
      approval: getRandomElement(["auto", "manual"]),
      maxSeats: Math.floor(Math.random() * 200) + 50,
      enableWaitlist: Math.random() > 0.5,
      eventFee: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0
    },
    stages: [
      {
        type: "assessment",
        title: "Pre-Event Assessment",
        order: 1,
        status: "ready",
        points: 10
      },
      {
        type: "live_session",
        title: "Main Event",
        order: 2,
        status: "ready",
        duration: 480
      }
    ],
    status: getRandomElement(["draft", "active", "completed", "cancelled"]),
    createdBy: getRandomElement(userIds).toString(),
    registrations: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 2000),
    completions: Math.floor(Math.random() * 100),
    createdAt: getPastDate(20 - i * 3),
    updatedAt: new Date(),
    publishedAt: Math.random() > 0.3 ? getPastDate(15 - i * 2) : null
  };

  var result = db.events.insertOne(event);
  print("  ✓ Created event: " + event.title);
}

// ============================================================================
// 11. SCHOLARSHIPS
// ============================================================================
print("\n🎓 Creating Scholarships...\n");

var scholarshipTitles = [
  "Merit-Based Excellence Scholarship",
  "Need-Based Financial Aid",
  "Research Fellowship Program",
  "International Student Grant",
  "Women in STEM Scholarship",
  "Graduate Studies Scholarship"
];

var scholarshipDescriptions = [
  "Awarded to students with outstanding academic performance and achievements.",
  "Financial assistance for students demonstrating financial need.",
  "Support for graduate students pursuing research in various fields.",
  "Scholarship opportunity for international students studying abroad.",
  "Encouraging and supporting women pursuing careers in STEM fields.",
  "Financial support for students pursuing graduate-level education."
];

for (var i = 0; i < 6; i++) {
  var provider = getRandomElement(universities);
  var scholarship = {
    categoryTags: getRandomElements(["Education", "Merit", "Need-Based", "Research"], 2),
    title: scholarshipTitles[i],
    providerId: provider._id.toString(),
    providerName: provider.name || "ACADO Foundation",
    type: getRandomElement(["merit", "need_based", "partial", "full", "fellowship", "travel_grant"]),
    amount: Math.floor(Math.random() * 50000) + 5000,
    currency: "USD",
    numberOfAwards: Math.floor(Math.random() * 20) + 5,
    duration: (i + 1) + " year(s)",
    studyLevel: getRandomElement(["undergraduate", "postgraduate", "phd", "short_course", "any"]),
    fieldsOfStudy: getRandomElements(["Computer Science", "Business", "Engineering", "Arts", "Science"], 2),
    applicationDeadline: getFutureDate(60 + i * 10),
    startDate: getFutureDate(90 + i * 15),
    endDate: getFutureDate(450 + i * 15),
    mode: getRandomElement(["online", "offline"]),
    shortDescription: scholarshipDescriptions[i],
    description: scholarshipDescriptions[i] + " This scholarship provides financial support and opportunities for academic excellence.",
    formFields: [
      {
        fieldType: "text",
        label: "Full Name",
        required: true
      },
      {
        fieldType: "email",
        label: "Email Address",
        required: true
      },
      {
        fieldType: "textarea",
        label: "Personal Statement",
        required: true
      }
    ],
    stages: [
      {
        type: "screening",
        title: "Initial Screening",
        order: 1,
        weightage: 30,
        autoScore: false
      },
      {
        type: "assessment",
        title: "Academic Assessment",
        order: 2,
        weightage: 40,
        autoScore: true
      },
      {
        type: "interview",
        title: "Final Interview",
        order: 3,
        weightage: 30,
        autoScore: false
      }
    ],
    evaluationRules: {
      passScore: 70
    },
    status: getRandomElement(["draft", "active", "inactive", "completed"]),
    visibility: getRandomElement(["public", "organization", "private"]),
    createdBy: getRandomElement(userIds).toString(),
    views: Math.floor(Math.random() * 1000),
    applications: Math.floor(Math.random() * 200),
    shortlisted: Math.floor(Math.random() * 50),
    awarded: Math.floor(Math.random() * 20),
    createdAt: getPastDate(30 - i * 5),
    updatedAt: new Date(),
    publishedAt: Math.random() > 0.3 ? getPastDate(20 - i * 3) : null
  };

  var result = db.scholarships.insertOne(scholarship);
  print("  ✓ Created scholarship: " + scholarship.title);
}

// ============================================================================
// SUMMARY
// ============================================================================
print("\n" + "=".repeat(60));
print("✅ Sample data generation complete!");
print("=".repeat(60));
print("\n📊 Summary:");
print("   - Course Categories: " + courseCategoryIds.length);
print("   - Course Levels: " + courseLevelIds.length);
print("   - Course Types: " + courseTypeIds.length);
print("   - Learning Outcomes: " + learningOutcomeIds.length);
print("   - Courses: ~6");
print("   - Forms: ~6");
print("   - Applications: 6");
print("   - Community Categories: " + communityCategoryIds.length);
print("   - Community Posts: 6");
print("   - Wall Posts: 6");
print("   - Reels: 6");
print("   - Events: 6");
print("   - Scholarships: 6");
print("\n💡 Note: This is temporary test data for development purposes.");
print("   You can safely delete all records and re-run this script anytime.\n");

