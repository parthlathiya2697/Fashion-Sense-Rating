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
    <div className="main-container flex flex-col items-center justify-center p-8">
      <div className="content-container bg-white p-10 rounded-lg shadow-xl max-w-2xl">
        <h1 className="title text-5xl font-extrabold mb-6 text-violet-800 text-center">About This Project</h1>
        <p className="text-gray-700 mb-6 text-lg text-center">
          This website is built using the following technologies:
        </p>
        <ul className="list-none text-gray-600 mb-6">
          {skills.map((skill, index) => (
            <li key={index} className="mb-4">
              <button
                onClick={() => toggleExpand(index)}
                className="text-lg font-semibold text-violet-800 hover:underline text-left"
              >
                {skill.name}
              </button>
              <p
                onClick={() => toggleExpand(index)}
                className="text-sm mt-2 cursor-pointer"
              >
                {expanded === index ? skill.description : skill.description.substring(0, 60) + '...'}
              </p>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <Link href="/" className="mt-8 inline-block text-white bg-violet-800 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-violet-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
