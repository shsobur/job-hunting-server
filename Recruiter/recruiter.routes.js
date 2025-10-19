const express = require("express");
const router = express.Router();

module.exports = (jobsCollection, verifyMessageCollection) => {
  router.post("/post-job", async (req, res) => {
    try {
      const jobData = req.body;
      console.log(jobData);

      if (!jobData || Object.keys(jobData).length === 0) {
        return res.status(400).send({ message: "Job data is required" });
      }

      const result = await jobsCollection.insertOne(jobData);
      res.status(201).send(result);
    } catch (error) {
      console.error("Error posting job:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  router.post("/profile-verify-message", async (req, res) => {
    try {
      const message = req.body;
      console.log(message)

      if (!message || Object.keys(message).length === 0) {
        return res.status(400).send({ message: "Message data is required" });
      }

      const result = await verifyMessageCollection.insertOne(message);
      res.status(201).send(result);
    } catch (error) {
      console.error("Error inserting verify message:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  return router;
};
