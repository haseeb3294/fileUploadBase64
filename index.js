const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();
const cors = require("cors");
const port = 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint for uploading images
app.get("/", (req, res) => {
  res.json({ success: true, message: "APIs are working" });
});
app.post("/upload", (req, res) => {
  try {
    const imageData = req.body.imageData;
    if (!imageData) {
      return res.status(400).send("No image data provided.");
    }

    // Convert base64 data to binary
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename (e.g., using UUID)
    const filename = `${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;

    // Write the buffer to a file
    fs.writeFileSync(`uploads/${filename}`, buffer);

    // Respond with the filename or other relevant information
    res.json({ filename });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
