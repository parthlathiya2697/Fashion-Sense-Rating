// frontend/src/app/components/RequestCountDisplay.tsx

"use client"
import { useEffect, useState } from 'react';

interface RequestCountDisplayProps {
  requestCount: number | null;
  setRequestCount: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function RequestCountDisplay({ requestCount, setRequestCount }: RequestCountDisplayProps) {
  const [maxRequestCount, setMaxRequestCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/requestCount/`);
        const data = await response.json();
        setRequestCount(data.request_count);
        setMaxRequestCount(data.max_request_count); // Assuming the API returns this value
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    };

    fetchRequestData();
  }, [setRequestCount]);

  return (
    <div className="flex items-center justify-center">
      <div className="p-3 rounded-lg shadow-lg max-w-xl mx-auto">
        <div className="request-count">
          {requestCount !== null && maxRequestCount !== null ? (
            <p className="text-gray-800">Requests used: {requestCount}/{maxRequestCount}</p>
          ) : (
            <p className="text-gray-600 text-lg">Loading request count...</p>
          )}
        </div>
      </div>
    </div>
  );
}