const express = require("express");
const router = express.Router();
const upload = require("./storage");
const { postingimage, singleimage } = require("./controller");

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API is working " });
});

router.post("/upload", upload.single("image"), postingimage);

router.get("/:id", singleimage);

module.exports = router;
