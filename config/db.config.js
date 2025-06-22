require('dotenv').config();


console.log("📦 Starting connection...");

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ Connection error:", err));
