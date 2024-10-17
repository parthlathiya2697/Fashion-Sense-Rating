// frontend/src/app/components/CommunityFeeds.tsx

import { useEffect, useState } from 'react';

interface AnalyzedStyle {
  style_name: string;
  analysis_result: string;
  created_at: string;
  image_url: string; // Add this line
  rating: number;    // Add this line
}

export default function CommunityFeeds() {
  const [styles, setStyles] = useState<AnalyzedStyle[]>([]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/readStyles/`);
        const data = await response.json();
        console.log('Community styles:', data.styles);
        setStyles(data.styles);
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    };

    fetchStyles();
  }, []);

  return (
    <div className="community-feeds">
    {styles.length > 0 && ( // Check if there are any styles
      <>
        <h2 className="text-2xl font-bold mb-4">Community Analyzed Styles</h2>
        <ul>
          {styles.map((style, index) => {
            const validJsonString = style.analysis_result.replace(/'/g, '"');
            const analysisResult = JSON.parse(validJsonString);
            console.log("style.analysis_result.description : ", analysisResult.description);
            return (
              <li key={index} className="mb-4">
                {/* <img src={style.image_url} alt={style.style_name} className="mb-2" /> */}
                <p>Rating: {analysisResult.rating}</p>
                <p>Analysis: {analysisResult.description}</p>
              </li>
            );
          })}
        </ul>
      </>
    )}
  </div>
  );
}