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
    <div className="request-count">
      {requestCount !== null && maxRequestCount !== null ? (
        <p>Requests used: {requestCount}/{maxRequestCount}</p>
      ) : (
        <p>Loading request count...</p>
      )}
    </div>
  );
}