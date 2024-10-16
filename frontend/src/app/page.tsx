"use client"

import { useState, useEffect } from 'react';
import StyleUploader from './components/StyleUploader';
import RequestCountDisplay from './components/RequestCountDisplay';
import Link from 'next/link';

export default function Home() {
  const [requestCount, setRequestCount] = useState<number | null>(null);
  const [maxRequestCount, setMaxRequestCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/requestCount/`);
        const data = await response.json();
        setRequestCount(data.request_count);
        setMaxRequestCount(data.max_request_count);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    };

    fetchRequestData();
  }, []);

  return (
    <main className="main-container flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h2 className="text-4xl font-bold text-center text-white mb-8">Fashion Sense Rater</h2>
      <RequestCountDisplay requestCount={requestCount} setRequestCount={setRequestCount} />
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <StyleUploader maxRequestCount={maxRequestCount} requestCount={requestCount} setRequestCount={setRequestCount}/>
      </div>
      <Link href="/about" className="text-white mt-8">
        Learn more about this project
      </Link>
    </main>
  );
}
