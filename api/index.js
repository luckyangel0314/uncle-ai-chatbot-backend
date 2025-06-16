// api/index.js
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// Use environment variable for your API key
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

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

module.exports = app;
