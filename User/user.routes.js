const express = require("express");
const router = express.Router();

module.exports = (usersCollection) => {
  // Insert new user data__
  router.post("/new-user-data", async (req, res) => {
    try {
      const data = req.body;
      console.log(data);
      const email = data.userEmail;
      console.log(email);

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

  // Next route hear__

  return router;
};
