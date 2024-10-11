import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { image } = await request.json()

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and provide a rating from 1-5 for the person's clothing style, along with a brief description of the style. Format the response as JSON with 'rating' and 'description' fields." },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    })

    // Log the raw response for debugging
    console.log("Raw response:", response.choices[0]);

    const firstChoice = response.choices[0];
    if (!firstChoice || !firstChoice.message || !firstChoice.message.content) {
      throw new Error('Invalid response structure');
    }

    const result = JSON.parse(firstChoice.message.content.replace(/```json\n/, '').replace(/\n```/, '') || '{}')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing style:', error)
    return NextResponse.json({ error: 'Error analyzing style' }, { status: 500 })
  }
}
