const Image = require("./model");


const postingimage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const image = new Image({
      name: req.file.originalname,
      contentType: req.file.mimetype,
      imageData: req.file.buffer,
    });

    await image.save();

    res.json({ id: image._id }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

const singleimage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.imageData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

module.exports = { postingimage, singleimage };
