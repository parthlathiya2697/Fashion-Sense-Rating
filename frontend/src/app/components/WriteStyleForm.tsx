import { useState } from 'react';

export default function WriteStyleForm() {
  const [styleName, setStyleName] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/writeStyle/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style_name: styleName, analysis_result: analysisResult }),
      });

      if (!response.ok) {
        throw new Error('Failed to save style data');
      }

      alert('Style data saved successfully');
      setStyleName('');
      setAnalysisResult('');
    } catch (error) {
      console.error('Error saving style data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={styleName}
        onChange={(e) => setStyleName(e.target.value)}
        placeholder="Style Name"
        required
      />
      <textarea
        value={analysisResult}
        onChange={(e) => setAnalysisResult(e.target.value)}
        placeholder="Analysis Result"
        required
      />
      <button type="submit">Save Style</button>
    </form>
  );
}