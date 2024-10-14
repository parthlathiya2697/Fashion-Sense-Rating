'use client'

import { useState } from 'react'
import Image from 'next/image'
import RequestCountDisplay from './RequestCountDisplay'

interface RequestCountDisplayProps {
  maxRequestCount: number | null;
  requestCount: number | null;
  setRequestCount: React.Dispatch<React.SetStateAction<number | null>>;
}


export default function StyleUploader({ maxRequestCount, requestCount, setRequestCount }: RequestCountDisplayProps) {
  const [image, setImage] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    // return if request count exceeds the limit
    if (requestCount !== null && maxRequestCount !== null && requestCount >= maxRequestCount) {
      setShowPopup(true)
      return
    }

    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string
        setImage(base64Image)
        setLoading(true)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyzeStyle/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image }),
          })
          if (response.status === 429) {
            setShowPopup(true)
            return
          }
          const data = await response.json()
          setRating(data.rating)
          setDescription(data.description)
        } catch (error) {
          console.error('Error analyzing style:', error)
        }

        setRequestCount((requestCount ?? 0) + 1)
        setLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
    <div className={`bg-white p-8 rounded-lg shadow-lg ${showPopup ? 'blur-sm' : ''}`}>
    
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
    {showPopup && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 z-50 flex flex-col items-center justify-center vignette-effect">
          <span>Number of Demo Trials Expired</span> [{requestCount}/{maxRequestCount}]
          <p>Please try again tomorrow or request the Admin at plathiya2611@gmail.com</p>
          <button onClick={() => setShowPopup(false)} className="mt-2 underline">
            Dismiss
          </button>
        </div>
      )}
    </div>
    
  )
}