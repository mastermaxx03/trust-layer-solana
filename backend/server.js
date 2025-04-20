// Import necessary packages
require('dotenv').config()
// --- ADD THIS LOG ---
console.log(
  'API Key from .env:',
  process.env.GEMINI_API_KEY ? `Loaded (length: ${process.env.GEMINI_API_KEY.length})` : 'NOT LOADED',
)
// --- END ADD ---

const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai')

// Initialize the Google AI Client (Make sure API Key is loaded above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
// --- ADD THIS LOG ---
console.log('genAI object created:', !!genAI)
// --- END ADD ---

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Backend server is alive!')
})

app.post('/moderate', async (req, res) => {
  // --- ADD THIS LOG ---
  console.log('--- Entered /moderate endpoint ---')
  // --- END ADD ---
  try {
    const inputText = req.body.text

    if (!inputText || typeof inputText !== 'string' || inputText.trim() === '') {
      console.log('Received invalid request: No text provided.')
      return res.status(400).json({ error: 'No text provided in request body' })
    }

    console.log(`Received text for moderation: "${inputText.substring(0, 100)}..."`)

    // --- ADD THIS LOG ---
    console.log('--- Preparing to call AI ---')
    // --- END ADD ---

    // --- START: Google Gemini API Call Logic ---
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    })

    console.log('Calling Gemini API...')
    const result = await model.generateContent(inputText)
    const response = await result.response
    console.log('Gemini Raw Response:', JSON.stringify(response, null, 2))

    let isFlagged = false
    let flaggedCategory = null
    let highestSeverity = null

    if (response.promptFeedback?.blockReason) {
      isFlagged = true
      flaggedCategory = response.promptFeedback.blockReason
      highestSeverity = 'BLOCKED'
      console.log(`Content blocked by API due to: ${flaggedCategory}`)
    } else if (response.promptFeedback?.safetyRatings && response.promptFeedback.safetyRatings.length > 0) {
      for (const rating of response.promptFeedback.safetyRatings) {
        if (rating.probability === 'MEDIUM' || rating.probability === 'HIGH') {
          isFlagged = true
          flaggedCategory = rating.category
          highestSeverity = rating.probability
          // --- FIX CONSOLE LOG ---
          console.log(`Content flagged: ${flaggedCategory} (${highestSeverity})`)
          // --- END FIX ---
          break
        }
      }
    }
    // --- END: Google Gemini API Call Logic ---

    // --- FIX CONSOLE LOG ---
    console.log(`Final decision: isFlagged=${isFlagged}, category=${flaggedCategory}`)
    // --- END FIX ---
    res.status(200).json({
      originalText: inputText,
      isFlagged: isFlagged,
      category: flaggedCategory,
      severity: highestSeverity,
      status: `Moderation check complete. Flagged: ${isFlagged}`,
    })
  } catch (error) {
    console.error('Error in /moderate endpoint:', error)
    res.status(500).json({ error: 'An internal server error occurred calling AI' })
  }
})

// Start the Server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`)
})
