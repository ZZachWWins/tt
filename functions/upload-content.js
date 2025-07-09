const mongoose = require('./db'); // Import your db.js which exports mongoose

// Define the schema and model (same as in db.js, but we redefine here for the function's context)
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  thumbnailUrl: String,
  uploadedBy: String,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema, 'content'); // Use 'content' collection

exports.handler = async (event) => {
  try {
    const { title, description, category, fileUrl, uploadedBy } = JSON.parse(event.body);

    // Create new video document
    const newVideo = new Video({
      title,
      description,
      fileUrl,
      category, // Add category field (not in schema, will be ignored unless schema is updated)
      uploadedBy,
      thumbnailUrl: '', // Placeholder, can be updated if you add thumbnail support
    });

    // Save to MongoDB
    await newVideo.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Content uploaded successfully' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upload failed' }),
    };
  }
};