const express = require("express");
const router = express.Router();

module.exports = (usersCollection) => {
  router.get("/profile-data/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await usersCollection.findOne(query);

      if (!result) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send(result);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  return router;
};
