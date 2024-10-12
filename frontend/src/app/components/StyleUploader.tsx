'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function StyleUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string
        setImage(base64Image)
        setLoading(true)
        try {
          const response = await fetch('http://localhost:8000/api/analyzeStyle/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image }),
          })
          const data = await response.json()
          setRating(data.rating)
          setDescription(data.description)
        } catch (error) {
          console.error('Error analyzing style:', error)
        }
        setLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload your selfie
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100
          "
        />
      </div>
      {image && (
        <div className="mt-4">
          <Image src={image} alt="Uploaded selfie" width={300} height={300} className="rounded-lg" />
        </div>
      )}
      {loading && <p className="mt-4 text-gray-600">Analyzing your style...</p>}
      {rating !== null && description && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Style Rating: {rating}/5</h2>
          <p className="text-gray-700">{description}</p>
        </div>
      )}
    </div>
  )
}