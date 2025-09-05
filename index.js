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

    const db = client.db("jobHuntingDB");
    const usersCollection = db.collection("users");

    // Data routes workshop ST__

    app.post("/new-user-data", async (req, res) => {
      try {
        const data = req.body;
        console.log(data);
        const userEmail = data.email;

        // Check if email already exists__
        // const existingUser = await usersCollection.findOne({
        //   email: userEmail,
        // });
        // if (existingUser) {
        //   return res.status(400).send({ message: "Email already exists" });
        // }

        // Insert if not found__
        const result = await usersCollection.insertOne(data);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Data routes workshop END__

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
