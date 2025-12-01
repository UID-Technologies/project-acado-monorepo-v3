/*
 * Create Test Users Script for MongoDB Shell (mongosh)
 * 
 * This script creates 3 test users:
 * 1. Superadmin user
 * 2. Admin user
 * 3. Learner user
 * 
 * Usage:
 *   mongosh acadodb scripts/create-test-users.js
 * 
 * Or with custom database:
 *   mongosh "mongodb://localhost:27017/acadodb" scripts/create-test-users.js
 * 
 * Note: Passwords are pre-hashed using bcrypt (salt rounds: 10)
 * Default password for all users: "Test123456"
 * 
 * To generate new bcrypt hashes, use Node.js:
 *   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(h => console.log(h));"
 */

if (typeof db === "undefined") {
  throw new Error("This script must be run inside mongosh (db is undefined).");
}

// Pre-hashed password using bcrypt (salt rounds: 10)
// Default password for all users: "Test123456"
// Hash generated using: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Test123456', 10).then(h => console.log(h));"
const PASSWORD_HASH = "$2a$10$IXrWnLaKhrointjpKOkWk.8OMPIyy6F7l9rL4q/RspRy4AJDO5Ase"; // "Test123456"

// Test users to create
var testUsers = [
  {
    email: "superadmin@test.com",
    passwordHash: PASSWORD_HASH,
    name: "Super Admin",
    username: "superadmin",
    userType: "Admin",
    role: "superadmin",
    isActive: true,
    tokenVersion: 0
  },
  {
    email: "admin@test.com",
    passwordHash: PASSWORD_HASH,
    name: "Admin User",
    username: "admin",
    userType: "Admin",
    role: "admin",
    isActive: true,
    tokenVersion: 0
  },
  {
    email: "learner@test.com",
    passwordHash: PASSWORD_HASH,
    name: "Test Learner",
    username: "learner",
    userType: "Learner",
    role: "learner",
    isActive: true,
    tokenVersion: 0
  }
];

// Function to create or update a user
function createOrUpdateUser(userData) {
  var now = new Date();
  
  // Check if user already exists
  var existing = db.users.findOne({ 
    $or: [
      { email: userData.email },
      { username: userData.username }
    ]
  });
  
  var userDoc = {
    email: userData.email.toLowerCase().trim(),
    password: userData.passwordHash,
    name: userData.name.trim(),
    username: userData.username.toLowerCase().trim(),
    userType: userData.userType,
    role: userData.role,
    isActive: userData.isActive,
    tokenVersion: userData.tokenVersion || 0,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  };
  
  if (existing) {
    db.users.updateOne(
      { _id: existing._id },
      { $set: userDoc }
    );
    print("✓ Updated existing user: " + userData.email + " (Role: " + userData.role + ")");
    return existing._id;
  } else {
    var result = db.users.insertOne(userDoc);
    print("✓ Created new user: " + userData.email + " (Role: " + userData.role + ")");
    return result.insertedId;
  }
}

// Main execution
print("🚀 Creating test users...\n");

var createdCount = 0;
var updatedCount = 0;

for (var i = 0; i < testUsers.length; i++) {
  var user = testUsers[i];
  
  // Check if user exists before creating
  var exists = db.users.findOne({ 
    $or: [
      { email: user.email },
      { username: user.username }
    ]
  });
  
  if (exists) {
    updatedCount++;
  } else {
    createdCount++;
  }
  
  try {
    createOrUpdateUser(user);
  } catch (error) {
    print("❌ Error creating user " + user.email + ": " + error.message);
  }
}

print("\n✅ Test users setup complete!");
print("📊 Summary:");
print("   - Created: " + createdCount);
print("   - Updated: " + updatedCount);
print("\n📋 User Credentials (Default password: Test123456):");
print("==========================================");
testUsers.forEach(function(u) {
  print(u.role.toUpperCase() + ":");
  print("   Email: " + u.email);
  print("   Username: " + u.username);
  print("   Password: Test123456");
  print("");
});
print("==========================================");
print("\n✅ All users created with password: Test123456");
print("   You can now login with any of the above credentials.");

