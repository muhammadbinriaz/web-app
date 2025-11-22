const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });

const User = require("./models/User");

const setupUsers = async () => {
  try {
    console.log("🧹 Cleaning up existing users...");
    await User.deleteMany({});

    console.log("👤 Creating admin user...");
    const admin = new User({
      username: "admin",
      email: "admin@pharmacy.com",
      password: "admin123", // Let the model hash it
      role: "admin",
    });
    await admin.save();

    console.log("👤 Creating test user...");
    const testUser = new User({
      username: "testuser",
      email: "test@pharmacy.com",
      password: "test123", // Let the model hash it
      role: "pharmacist",
    });
    await testUser.save();

    console.log("✅ Users created successfully!");
    console.log("Admin: admin@pharmacy.com / admin123");
    console.log("Test User: test@pharmacy.com / test123");

    // Verify they exist
    const users = await User.find();
    console.log("\n📋 Verification - Users in database:");
    users.forEach((user) => {
      console.log(`- ${user.email} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating users:", error);
    process.exit(1);
  }
};

setupUsers();
