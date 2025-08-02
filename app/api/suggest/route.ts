import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()
    console.log("Input received from frontend:", input)

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Input required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    console.log("GEMINI_API_KEY loaded:", apiKey ? '✅' : '❌ MISSING')

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a helpful assistant. Suggest a short, specific to-do task based on vague user input.\nInput: ${input}`
            }
          ]
        }
      ]
    })

    const suggestion = result.response.text().replace(/\*|`|_/g, '').trim()
    console.log("Gemini Suggestion:", suggestion)

    if (!suggestion) {
      return NextResponse.json({ error: 'No suggestion generated' }, { status: 500 })
    }

    return NextResponse.json({ suggestion })
  } catch (err) {
    console.error('🔥 Gemini API Error:', err)
    return NextResponse.json({ error: 'Failed to get suggestion.' }, { status: 500 })
  }
}
