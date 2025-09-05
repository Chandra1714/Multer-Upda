const express = require("express");
const router = express.Router();
const upload = require("./storage");
const { postingimage, singleimage } = require("./controller");


router.post("/upload", upload.single("image"), postingimage);
router.get("/:id", singleimage);

module.exports = router;
