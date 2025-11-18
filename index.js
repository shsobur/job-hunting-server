const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Import routes__
const uploadRoute = require("./image/upload");
const commonRoutes = require("./Common/common.routes");
const usersRoutes = require("./User/user.routes");
const recruiterRoutes = require("./Recruiter/recruiter.routes");
const adminRoutes = require("./Admin/admin.routes");

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection__
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g4yea9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware__
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-hunting-d689c.web.app",
      "https://job-hunting-d689c.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

// DB setup
async function run() {
  try {
    await client.connect();

    const db = client.db("jobHuntingDB");
    const usersCollection = db.collection("users");
    const jobsCollection = db.collection("jobs");
    const verifyMessageCollection = db.collection("verifyMessage");
    const applicationsCollection = db.collection("applications");

    // Routes__
    app.use("/upload", uploadRoute);
    app.use("/common-api", commonRoutes(usersCollection, jobsCollection))
    app.use("/user-api", usersRoutes(usersCollection, applicationsCollection));
    app.use(
      "/recruiter-api",
      recruiterRoutes(jobsCollection, verifyMessageCollection)
    );
    app.use("/admin-api", adminRoutes(verifyMessageCollection, usersCollection));

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}
run().catch(console.dir);

// Test route__
app.get("/", (req, res) => {
  res.send("Job-Hunting Server is running...");
});

// Start server__
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
