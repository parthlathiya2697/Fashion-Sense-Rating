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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStyles = async (page = 1) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/readStyles/?page=${page}`);
      const data = await response.json();
      console.log('Community data:', data);
      setStyles(data.results);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page

      if (data.results.length > 0) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  useEffect(() => {
    fetchStyles(currentPage);
  }, [currentPage]);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };


  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/readStyles/`);
        const data = await response.json();
        console.log('Community data:', data);
        setStyles(data.results);

        if (data.results.length > 0) {
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
    isVisible && (
      <div id="community-section" className="community-section" style={{ minHeight: '100vh' }}>
        <div className="bg-white p-6 rounded-t-lg shadow-lg" style={{
          borderTopLeftRadius: '150px',
          borderTopRightRadius: '150px',
          padding: '70px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}>
          <h2 className="text-3xl font-bold mb-4 text-center text-purple-700" style={{ marginBottom: '70px' }}>
            Community Analyzed Styles
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {styles.map((style, index) => {
              const validJsonString = style.analysis_result.replace(/'/g, '"');
              let analysisResult;
              try {
                analysisResult = JSON.parse(validJsonString);
              } catch (error) {
                console.error('Error parsing JSON:', error);
                analysisResult = { rating: 'N/A', description: 'Invalid JSON format', improvements: [] };
              }

              const shortDescription = analysisResult.description.split('.').slice(0, 1).join('.') + '.';

              return (
                <li key={index} className="mb-4 card hover:shadow-lg hover:shadow-white transition-shadow duration-300">
                  <img src={`${style.image_data}`} alt={style.style_name} className="mb-2 rounded-lg" />
                  <p>{renderStars(analysisResult.rating)}</p>
                  <p>{shortDescription}</p>
                  <details>
                    <summary>Read More</summary>
                    <br /><p><b>Full Description:</b> {analysisResult.description}</p>
                    <br /><p><b>Points of Improvement:</b></p>
                    <ul>
                      {analysisResult.improvements.map((improvement: string, i: number) => (
                        <li key={i}> > {improvement}</li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
          <div className="pagination-controls pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
        </div>
        
      </div>

    )
  );
}
