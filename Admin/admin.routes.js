const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = (verifyMessageCollection, usersCollection) => {
  router.get("/company-verify-request", async (req, res) => {
    try {
      const query = { isVerify: "Unverified" };
      const result = await verifyMessageCollection.find(query).toArray();
      res.status(200).send(result);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Failed to fetch company verify requests" });
    }
  });

  router.put("/company-verify-approve-data/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const approveData = req.body;
      console.log(approveData);
      const result = await verifyMessageCollection.replaceOne(
        query,
        approveData
      );
      res.status(200).send(result);
    } catch {
      console.error("Error fetching company verify requests:", error);
      res.status(500).send({ message: "Approve data replace failed" });
    }
  });

  router.patch("/company-profile-status/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const filter = { userEmail: email };
      const updatedDoc = { $set: { verified: "Verified" } };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.status(200).send(result);
    } catch (error) {
      console.error("Error updating company profile:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  return router;
};
