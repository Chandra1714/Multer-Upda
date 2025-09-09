const Image = require("./model");

const postingimage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    let savedImages = [];

    for (const file of req.files) {
      const image = new Image({
        name: file.originalname,
        contentType: file.mimetype,
        imageData: file.buffer,
      });

      const savedImage = await image.save();
      savedImages.push({ id: savedImage._id, name: savedImage.name });
    }

    console.log("✅ Images uploaded:", savedImages.map(img => img.id));

    res.json({ uploaded: savedImages });
  } catch (err) {
    console.error("❌ Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Get single image by ID
const singleimage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    console.log("📤 Sending image:", req.params.id);

    res.set("Content-Type", image.contentType);
    res.send(image.imageData);
  } catch (err) {
    console.error("❌ Error fetching image:", err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

module.exports = { postingimage, singleimage };
