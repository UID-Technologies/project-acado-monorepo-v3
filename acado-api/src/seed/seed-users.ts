// src/seed/seed-users.ts
import mongoose from 'mongoose';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { loadEnv } from '../config/env.js';

const env = loadEnv();

async function seedUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users/organizations (optional - comment out if you don't want to clear)
    console.log('Clearing existing users and organizations...');
    await User.deleteMany({});
    await Organization.deleteMany({});

    // Seed the primary organization
    console.log('Creating Acado organization...');
    const organization = await Organization.create({
      name: 'Acado',
      shortName: 'acado',
      type: 'University',
      onboardingStage: 'Approved',
      description: 'Primary organization seeded for the Acado platform',
      suspended: false
    });

    // Create default users
    console.log('Creating default users...');
    
    const users = [
      {
        email: 'superadmin@example.com',
        username: 'superadmin@example.com',
        password: 'superadmin123',
        name: 'Super Administrator',
        role: 'superadmin',
        isActive: true,
        organizationId: organization._id,
        organizationName: organization.name
      },
      {
        email: 'admin@example.com',
        username: 'admin@example.com',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin',
        isActive: true,
        organizationId: organization._id,
        organizationName: organization.name
      },
      {
        email: 'learner@example.com',
        username: 'learner@example.com',
        password: 'learner123',
        name: 'Learner User',
        role: 'learner',
        isActive: true,
        organizationId: organization._id,
        organizationName: organization.name
      }
    ];

    const createdUsers = await User.create(users);

    console.log('\n✅ Users created successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Default Users:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    createdUsers.forEach((user: any) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${users.find(u => u.email === user.email)?.password}`);
      console.log(`Role: ${user.role}`);
      console.log(`Name: ${user.name}`);
      console.log('─────────────────────────────────────────────────────\n');
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log('Use these credentials to login to the application');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();

