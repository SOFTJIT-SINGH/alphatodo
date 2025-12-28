'use server'

import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai'

// 👇 FIX: Explicitly type this object as 'Schema'
const todoSchema: Schema = {
  description: "A task suggestion",
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "Short title",
      nullable: false,
    },
    description: {
      type: SchemaType.STRING,
      description: "Detailed description",
      nullable: false,
    },
  },
  required: ["title", "description"],
}

export async function getAiSuggestion(userInput: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("Missing API Key")

  const genAI = new GoogleGenerativeAI(apiKey)
  
  // Use the model you confirmed works (Gemini 2.5)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', 
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: todoSchema,
    },
  })

  const prompt = `Suggest a todo task based on: ${userInput}`
  const result = await model.generateContent(prompt)
  
  return JSON.parse(result.response.text())
}