const Image = require("./model");

// Upload multiple images and return preview URLs
const postingimage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const savedImages = [];

    for (const file of req.files) {
      const image = new Image({
        name: file.originalname,
        contentType: file.mimetype,
        imageData: file.buffer,
      });

      const savedImage = await image.save();

      // Convert Buffer to base64 URL directly
      const base64 = file.buffer.toString("base64");
      const url = `data:${file.mimetype};base64,${base64}`;

      savedImages.push({ id: savedImage._id, name: savedImage.name, url });
    }

    console.log("✅ Images uploaded:", savedImages.map(img => img.id));

    // Return array of uploaded images with preview URLs
    res.json({ uploaded: savedImages });
  } catch (err) {
    console.error("❌ Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Get single image by ID (optional, still works)
const singleimage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    res.set("Content-Type", image.contentType);
    res.send(image.imageData);
  } catch (err) {
    console.error("❌ Error fetching image:", err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

module.exports = { postingimage, singleimage };
