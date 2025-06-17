// api/chat.js
const axios = require("axios");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

  try {
    const { messages, model = "llama-3.1-sonar-small-128k-online" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

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
    res.status(500).json({
      error: "Error communicating with Perplexity API",
      details: error.response?.data || error.message
    });
  }
};
