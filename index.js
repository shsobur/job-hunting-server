const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
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

// DB workshop ST__

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // DB Collections__
    const db = client.db("jobHuntingDB");
    const usersCollection = db.collection("users");

    // Import routes and pass collections__
    const usersRoutes = require("./User/user.routes");

    app.use("/user-api", usersRoutes(usersCollection));

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// DB workshop END__

// Test route__
app.get("/", (req, res) => {
  res.send("Job-Hunting Server is running...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
