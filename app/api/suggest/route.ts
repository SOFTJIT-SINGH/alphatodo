import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()
    console.log('Input received from frontend:', input)

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Input required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    console.log('GEMINI_API_KEY loaded:', apiKey ? '✅' : '❌ MISSING')

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    // Using gemini-1.5-flash is great for this kind of task
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // ✨ UPDATED PROMPT ✨
    const prompt = `You are a helpful assistant. Based on the user's vague input, suggest a specific to-do task. 
Provide a short "title" for the task and a slightly more detailed "description".
Respond ONLY with a valid JSON object in the format: {"title": "your suggested title", "description": "your suggested description"}.

User Input: ${input}`

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    })

    // ✨ UPDATED RESPONSE HANDLING ✨
    const responseText = result.response.text()
    console.log('Gemini Raw JSON Response:', responseText)

    // Clean the response to remove Markdown fences
    const cleanedResponse = responseText.replace(/```json\n?|```/g, '')

    // Parse the cleaned JSON string
    const suggestion = JSON.parse(cleanedResponse)

    if (!suggestion.title || !suggestion.description) {
      throw new Error('Invalid JSON structure from Gemini.')
    }

    console.log('Parsed Suggestion:', suggestion)

    // Send the entire suggestion object to the frontend
    return NextResponse.json({ suggestion })
  } catch (err) {
    console.error('🔥 Gemini API Error:', err)
    // Ensure the error is serialized correctly
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to get suggestion.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
