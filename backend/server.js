const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const imageRoutes = require("./routes");
require("dotenv").config(); 

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",          
    "multer-upda-daxp.vercel.app" 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/image", imageRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
