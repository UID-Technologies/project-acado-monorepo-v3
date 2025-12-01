/**
 * Create Initial Users Script
 * 
 * This script creates superadmin, admin, and learner users in the database
 * 
 * Usage:
 *   node scripts/create-users.js
 * 
 * Or with custom database:
 *   MONGO_URI=mongodb://localhost:27017/acedodb node scripts/create-users.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acedodb';

// User schema matching your model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  userType: { type: String, enum: ['Learner', 'Faculty', 'Staff', 'Admin'], default: 'Learner' },
  role: { type: String, enum: ['superadmin', 'admin', 'learner'], default: 'learner' },
  isActive: { type: Boolean, default: true },
  mobileNo: String,
  tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const users = [
  {
    email: 'superadmin@acado.com',
    password: 'SuperAdmin@123',
    name: 'Super Administrator',
    username: 'superadmin',
    userType: 'Admin',
    role: 'superadmin',
    mobileNo: '+1234567890',
    isActive: true,
  },
  {
    email: 'admin@acado.com',
    password: 'Admin@123',
    name: 'Administrator',
    username: 'admin',
    userType: 'Admin',
    role: 'admin',
    mobileNo: '+1234567891',
    isActive: true,
  },
  {
    email: 'user@acado.com',
    password: 'User@123',
    name: 'Regular User',
    username: 'user',
    userType: 'Learner',
    role: 'learner',
    mobileNo: '+1234567892',
    isActive: true,
  },
  {
    email: 'learner@acado.com',
    password: 'Learner@123',
    name: 'Test Learner',
    username: 'learner',
    userType: 'Learner',
    role: 'learner',
    mobileNo: '+1234567893',
    isActive: true,
  },
];

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function createUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📝 Creating users...\n');

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email: userData.email }, { username: userData.username }]
        });

        if (existingUser) {
          console.log(`⚠️  User already exists: ${userData.email}`);
          continue;
        }

        // Hash password
        const hashedPassword = await hashPassword(userData.password);

        // Create user
        const user = await User.create({
          ...userData,
          password: hashedPassword,
        });

        console.log(`✅ Created ${userData.role}: ${userData.email}`);
        console.log(`   Username: ${userData.username}`);
        console.log(`   Password: ${userData.password}`);
        console.log(`   Name: ${userData.name}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log('\n🎉 User creation completed!\n');
    console.log('📋 Summary of created accounts:');
    console.log('================================');
    users.forEach(u => {
      console.log(`${u.role.toUpperCase()}: ${u.email} / ${u.password}`);
    });
    console.log('================================\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

createUsers();

