const express = require("express");
const cors = require("cors"); // Import cors middleware
const axios = require("axios");
const app = express();
require('dotenv').config();

// Update CORS configuration to allow requests from the frontend
app.use(cors({
  origin: '*', // For development. In production, specify your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

const port = process.env.PORT || 3000;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

console.log(PERPLEXITY_API_KEY)

app.get('/', (req, res) => {
  res.send('Hello from Express API on Vercel!');
});

app.post("/chat", async (req, res) => {
  try {
    const { messages, model = "llama-3.1-sonar-small-128k-online" } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }
    console.log("Server is going to get response from perplexity")
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: model,
        messages: messages
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Error communicating with Perplexity API",
      details: error.response?.data || error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
