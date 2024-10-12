import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { image } = await request.json()
  console.info('Analyzing style...')
  try {
    // Make a request to the Django backend API
    const response = await fetch('http://localhost:8000/api/analyzeStyle/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze style')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing style:', error)
    return NextResponse.json({ error: 'Error analyzing style' }, { status: 500 })
  }
}