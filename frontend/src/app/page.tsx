"use client"

import { useState, useEffect } from 'react';
import StyleUploader from './components/StyleUploader';
import Link from 'next/link';

import CommunityFeeds from './components/CommunityFeeds';
import "./globals.css";

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
    <main className="main-container flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative p-2">
      <div className='p-24'>
        <Link href="/about" className="text-white absolute top-4 right-4">
          Learn more
        </Link>
        <h1 className="text-5xl font-bold text-center text-white mb-8">Fashion Forward</h1>
        <p className="text-xl text-center text-white mb-4">Step Boldly into the Next Era of Style</p>
        <br></br>
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm mb-12">
          <StyleUploader maxRequestCount={maxRequestCount} requestCount={requestCount} setRequestCount={setRequestCount} />
        </div>
      </div>
      <div className="w-full max-w-10xl pt-4 px-2">
        <CommunityFeeds />
      </div>
    </main>
  );
}
