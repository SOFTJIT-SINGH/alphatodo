import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.')
}

const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json({ error: 'Input is required.' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const result = await model.generateContent([
      'You are a helpful assistant. Suggest a short, specific to-do task based on vague user input.',
      `Input: ${input}`,
    ])

    const suggestion = result.response.text().trim()

    if (!suggestion) {
      return NextResponse.json(
        { error: 'No suggestion generated.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('Gemini API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get suggestion.' },
      { status: 500 }
    )
  }
}
