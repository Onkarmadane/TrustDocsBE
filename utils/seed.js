require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const users = [
    {
        fullName: "Admin User",
        email: "admin@gmail.com",
        mobile: "1234567890",
        password: "1234",
        role: "admin",
        status: "active",
    },
    {
        fullName: "John Doe",
        email: "user@gmail.com",
        mobile: "9876543210",
        password: "1234",
        role: "user",
        status: "active",
    },
];
const seedUsers = async () => {
    try {
        await connectDB();

        // Clear existing users
        await User.deleteMany();
        console.log("Existing users cleared");

        // Insert new users
        // Note: Password hashing is handled by the pre-save hook in User model
        await User.create(users);
        console.log("Users seeded successfully");

        process.exit();
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
