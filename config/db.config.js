console.log("📦 Starting connection...");

const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://prince67:PrinceS3210@cluster0.6y4zijx.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ Connection error:", err));
