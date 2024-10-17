"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import '../app/globals.css'; // Ensure global styles are imported
import { NextResponse } from 'next/server'

const skills = [
  {
    name: 'Frontend: Next.js',
    description: 'Next.js is a React framework that enables server-side rendering and static site generation.',
  },
  {
    name: 'Backend: Django',
    description: 'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.',
  },
  {
    name: 'AI: OpenAI',
    description: 'OpenAI provides powerful AI models for natural language processing and other AI tasks.',
  },
  {
    name: 'Prompt Engineering',
    description: 'Prompt engineering involves crafting inputs to AI models to achieve desired outputs effectively.',
  },
];

const About = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="main-container flex flex-wrap justify-center p-8">
      <h1 className="w-full text-4xl font-bold mb-8 text-center text-white">Development Skills used</h1>
      {skills.map((skill, index) => (
        <div key={index} className="card bg-white bg-opacity-80 p-6 m-4 rounded-lg shadow-lg max-w-xs">
          <h2 className="text-xl font-semibold mb-2">{skill.name}</h2>
          <p className="">
            {expanded === index ? skill.description : skill.description.substring(0, 60) + '...'}
          </p>
          <button
            onClick={() => toggleExpand(index)}
            className="text-sm mt-2 hover:underline"
          >
            {expanded === index ? 'Show Less' : 'Read More'}
          </button>
        </div>
      ))}
      <div className="w-full text-center mt-8">
        <Link href="/" className="inline-block text-white px-6 py-3 rounded-full font-semibold shadow-md  transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default About;