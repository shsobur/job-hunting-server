const express = require("express");
const router = express.Router();

module.exports = (usersCollection) => {
  // Insert new user data__
  router.post("/new-user-data", async (req, res) => {
    try {
      const data = req.body;
      const email = data.userEmail;

      // Check if email already exists__
      const existingUser = await usersCollection.findOne({
        userEmail: email,
      });
      if (existingUser) {
        return res.status(400).send({ message: "Email already exists" });
      }

      // Insert if not found__
      const result = await usersCollection.insertOne(data);
      res.status(200).send(result);
    } catch (error) {
      console.error("Error inserting user:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  // Find authenticated user data__
  router.get("/users/email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await usersCollection.findOne(query);

      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).send({ message: "Server error, my bad" });
    }
  });

  // Next route hear__

  return router;
};
