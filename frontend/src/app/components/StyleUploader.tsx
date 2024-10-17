'use client'

import { useState } from 'react'
import Image from 'next/image'

interface RequestCountDisplayProps {
  maxRequestCount: number | null;
  requestCount: number | null;
  setRequestCount: React.Dispatch<React.SetStateAction<number | null>>;
}


export default function StyleUploader({ maxRequestCount, requestCount, setRequestCount }: RequestCountDisplayProps) {
  const [fileName, setFileName] = useState<string | null>(null) // new state variable for file name
  const [image, setImage] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [improvements, setImprovements] = useState<string | null>(null)
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
      setFileName(file.name) // set file name when file is uploaded
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
          const jsonResponse = await response.json(); // await the promise
          const data = jsonResponse.analysis_result; // access the property

          console.log("analyzeStyle response data : ", data)
          setRating(data.rating)
          setDescription(data.description)
          setImprovements(data.improvements)
        } catch (error) {
          console.error('Error analyzing style:', error)
        }

        setRequestCount((requestCount ?? 0) + 1)
        setLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => { // new function to remove image
    setImage(null)
    setFileName(null)
    setRating(null)
    setDescription(null)
    setImprovements(null)
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto ${showPopup ? 'blur-sm' : ''}`}>
      {!image ? ( // conditionally render based on whether image is uploaded or not
        <div className="mb-3">
          <label htmlFor="imageUpload" className="block text-md font-medium text-gray-700 mb-3">
            Analyse how you look today!
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border file:border-gray-300
              file:text-sm file:font-semibold
              file:bg-white file:text-violet-700
              hover:file:bg-gray-100"
          />
        </div>
      ): (
        <div className="mb-6 flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">{fileName}</span>
            <button onClick={handleRemoveImage} className="text-red-500">Remove</button>
          </div>
        )}

{image && (
          <div className="flex flex-row items-center justify-between gap-8"> {/* Change items-start to items-center */}
            <div className="flex-shrink-0">
              <Image src={image} alt="Uploaded selfie" width={300} height={300} className="rounded-lg" />
            </div>
            <div className="flex-1 flex flex-col justify-center"> {/* Add flex and justify-center */}
              {rating !== null && description && (
                <div>
                  <h2 className="text-violet-800 text-2xl font-bold mb-2">Style Rating: {rating}/5</h2>
                  <p className="text-gray-600 text-justify">{description}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {rating !== null && improvements && (
          <div className="mt-6">
            <h5 className="text-gray-800 font-semibold">Points of Improvements</h5>
            <p className="text-gray-600 text-justify">{improvements}</p>
          </div>
        )}
        {loading && <p className="mt-4 text-gray-600">Analyzing your style...</p>}
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