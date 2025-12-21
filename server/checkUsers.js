import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    console.log('📊 Database:', mongoose.connection.db.databaseName);

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Available Collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Count users
    const userCount = await User.countDocuments();
    console.log(`\n👥 Total Users: ${userCount}`);

    // Get all users
    if (userCount > 0) {
      const users = await User.find({}).select('+password');
      console.log('\n📋 User Details:');
      users.forEach((user, index) => {
        console.log(`\n  User ${index + 1}:`);
        console.log(`    ID: ${user._id}`);
        console.log(`    Name: ${user.name}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Phone: ${user.phone || 'N/A'}`);
        console.log(`    Role: ${user.role}`);
        console.log(`    Active: ${user.isActive}`);
        console.log(`    Created: ${user.createdAt}`);
        console.log(`    Updated: ${user.updatedAt}`);
        console.log(`    Password Hash: ${user.password.substring(0, 20)}...`);
      });
    } else {
      console.log('\n⚠️  No users found in the database!');
      console.log('\n💡 To create a test user, run the signup endpoint:');
      console.log('   POST http://localhost:5000/api/auth/signup');
      console.log('   Body: { "name": "Test User", "email": "test@example.com", "password": "test123" }');
    }

    // Check if there are any issues with indexes
    const indexes = await User.collection.getIndexes();
    console.log('\n🔍 User Collection Indexes:');
    console.log(indexes);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
