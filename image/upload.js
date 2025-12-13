const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload → Upload image to Cloudinary__
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "Job Hunting",
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;