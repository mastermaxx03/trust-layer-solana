// Import necessary packages
require('dotenv').config() // Loads variables from .env file into process.env
const express = require('express')
const cors = require('cors')
// We will import and use GoogleGenerativeAI later when implementing the AI call
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create an Express app
const app = express()
// Use port 3001 or specify PORT in your .env file
const port = process.env.PORT || 3001

// === Middleware ===
app.use(cors()) // Enable Cross-Origin Resource Sharing (allows your frontend to call this)
app.use(express.json()) // Allow the server to read JSON data in request bodies

// === Routes ===
// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.status(200).send('Backend server is alive!')
})

// The endpoint that will handle content moderation requests
app.post('/moderate', async (req, res) => {
  // Mark function as async for later API calls
  try {
    // Get the text from the request body sent by the frontend
    const inputText = req.body.text

    // Basic validation
    if (!inputText || typeof inputText !== 'string' || inputText.trim() === '') {
      console.log('Received invalid request: No text provided.')
      return res.status(400).json({ error: 'No text provided in request body' })
    }

    console.log(`Received text for moderation: "${inputText.substring(0, 100)}..."`) // Log start of text

    // --- Placeholder for AI Logic ---
    // >>> NEXT STEP: Add code here to call the Google Gemini API <<<
    console.log('AI Moderation Logic Placeholder - SKIPPED FOR NOW')
    const isFlagged = false // Dummy result for now
    const flaggedCategory = null // Dummy result for now
    // --- End Placeholder ---

    // Send response back to the frontend
    res.status(200).json({
      originalText: inputText,
      isFlagged: isFlagged,
      category: flaggedCategory,
      status: 'Moderation check complete (dummy result)', // Update this later
    })
  } catch (error) {
    console.error('Error in /moderate endpoint:', error)
    res.status(500).json({ error: 'An internal server error occurred' })
  }
})

// === Start the Server ===
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`)
})
