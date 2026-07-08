require('dotenv').config()

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Multer setup — store uploaded file in memory (not on disk)
const upload = multer({ storage: multer.memoryStorage() })

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

// Store the last uploaded document's text (single-user, in-memory)
let lastExtractedText = ''

// Test route — just to check server is alive
app.get('/', (req, res) => {
  res.send('DocMind backend is running ✅')
})

// Upload route — receives PDF, extracts text, generates flashcards
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const data = await pdfParse(req.file.buffer)
    const extractedText = data.text

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No readable text found in this PDF. It may be a scanned image.' })
    }

    lastExtractedText = extractedText

    console.log('Extracted text length:', extractedText.length)

    const prompt = `
      Based on the following document text, generate exactly 5 flashcards
      in this exact JSON format, with no extra text before or after:
      [
        { "question": "...", "answer": "..." },
        { "question": "...", "answer": "..." }
      ]

      Document text:
      ${extractedText.slice(0, 5000)}
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const cleanedText = responseText.replace(/```json|```/g, '').trim()
    const flashcards = JSON.parse(cleanedText)

    res.json({
      message: 'PDF processed successfully',
      flashcards: flashcards
    })

  } catch (error) {
    console.error(error)

    if (error.message && error.message.includes('XRef')) {
      return res.status(400).json({ error: 'This PDF appears to be corrupted or scanned as an image. Please try a different PDF with selectable text.' })
    }

    res.status(500).json({ error: 'Failed to process PDF. Please try again.' })
  }
})

// Ask route — real Q&A powered by Gemini
app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'No question provided' })
    }

    if (!lastExtractedText) {
      return res.status(400).json({ error: 'No document uploaded yet' })
    }

    const prompt = `
      Based on the following document, answer the question clearly and concisely.

      Document:
      ${lastExtractedText.slice(0, 5000)}

      Question: ${question}
    `

    const result = await model.generateContent(prompt)
    const answerText = result.response.text()

    res.json({ answer: answerText })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to answer question' })
  }
})

// Summary route — real summary powered by Gemini
app.post('/summary', async (req, res) => {
  try {
    if (!lastExtractedText) {
      return res.status(400).json({ error: 'No document uploaded yet' })
    }

    const prompt = `
      Summarize the following document in a clear, well-organized way.
      Keep it concise — around 150-200 words. Use plain paragraphs, no markdown.

      Document:
      ${lastExtractedText.slice(0, 5000)}
    `

    const result = await model.generateContent(prompt)
    const summaryText = result.response.text()

    res.json({ summary: summaryText })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})