const express = require("express");
const router = express.Router();
const upload = require("./storage");
const { postingimage, singleimage } = require("./controller");

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API is working" });
});

// ✅ Upload multiple images
router.post("/upload", upload.array("image", 10), postingimage);

// ✅ Fetch single image by ID
router.get("/:id", singleimage);

module.exports = router;
