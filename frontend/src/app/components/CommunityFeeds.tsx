// frontend/src/app/components/CommunityFeeds.tsx

import { useEffect, useState } from 'react';

interface AnalyzedStyle {
  style_name: string;
  analysis_result: string;
  created_at: string;
  image: string; // Add this line
  rating: number;    // Add this line
}

export default function CommunityFeeds() {
  const [styles, setStyles] = useState<AnalyzedStyle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/readStyles/`);
        const data = await response.json();
        console.log('Community data:', data);
        setStyles(data.styles);

        if (data.styles.length > 0) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    };

    fetchStyles();
  }, []);


  useEffect(() => {
    console.log('isVisible:', isVisible);
  }, [isVisible]);

  return (
    
    isVisible && <div id="community-section" className="community-section" style={{ minHeight: '100vh' }}>

      <div className="bg-white p-6 rounded-t-lg shadow-lg" style={{
        borderTopLeftRadius: '150px',
        borderTopRightRadius: '150px',
        padding: '70px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Ensure only one backgroundColor is set
        // backdropFilter: 'blur(10px)', 
        // WebkitBackdropFilter: 'blur(10px)' 
      }}>
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-700" style={{ marginBottom: '70px' }} >Community Analyzed Styles</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {styles.map((style, index) => {
            const validJsonString = style.analysis_result.replace(/'/g, '"');
            let analysisResult;
            try {
              analysisResult = JSON.parse(validJsonString);
            } catch (error) {
              console.error('Error parsing JSON:', error);
              analysisResult = { rating: 'N/A', description: 'Invalid JSON format' };
            }
            console.log("style : ", style);
            return (
              <li key={index} className="mb-4 card hover:shadow-lg hover:shadow-white transition-shadow duration-300">
                <img src={`${style.image_data}`} alt={style.style_name} className="mb-2 rounded-lg" />
                <p>Rating: {analysisResult.rating}</p>
                <p>Analysis: {analysisResult.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
