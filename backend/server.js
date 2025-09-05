const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const imageRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/image", imageRoutes);

mongoose
  .connect(
    "mongodb+srv://chandrakanthhv9964_db_user:Kanth%409964@cluster0.tw6t7cb.mongodb.net/multer?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
