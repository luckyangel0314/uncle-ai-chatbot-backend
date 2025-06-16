const express = require("express");
const cors = require("cors"); // Import cors middleware
const axios = require("axios");
const app = express();

app.use(cors({
  origin: process.env.SELF_URL, // Your frontend origin
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

const port = process.env.PORT || 3000;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

app.get('/', (req, res) => {
  res.send('Hello from Express API on Vercel!');
});

app.post("/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;
    const response = await axios.post(
      "https://api.perplexity.ai/v1/chat/completions",
      { model: model || "llama-3.1-sonar-small-128k-online", messages },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Error communicating with Perplexity API" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
