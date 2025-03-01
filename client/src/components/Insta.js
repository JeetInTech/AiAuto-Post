import React, { useState } from 'react';
import axios from 'axios';
import './twit.css'; // Reuse Twitter CSS for consistency, adjust as needed

function Insta() {
  const [prompt, setPrompt] = useState('');
  const [textFile, setTextFile] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5003/instagram/generate-story', { prompt });
      setTextFile(response.data.text_file);
      setImageFile(response.data.image_file);
      alert(response.data.message);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate Story: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.split('/').pop() || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="twitter-container">
      <div className="twitter-header">
        <h1 className="ai-title">AI Instagram Story</h1>
      </div>
      <div className="twitter-post-box">
        <div className="twitter-post-header">
          <button className="ai-button ai-close" onClick={() => window.location.href = '/'}>×</button>
        </div>
        <textarea
          className="twitter-post-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What moment or idea do you want to share on Instagram Story?"
        />
        <div className="twitter-post-actions">
          <button className="twitter-ai-button" onClick={handleGenerateStory} disabled={isGenerating}>
            {isGenerating ? (
              <span className="ai-thinking">Thinking<span className="dots">...</span></span>
            ) : (
              'Generate Story'
            )}
          </button>
        </div>
        {textFile && imageFile && (
          <div className="ai-result">
            <h2 className="ai-subtitle">Generated Story Files</h2>
            <p>
              <button onClick={() => downloadFile(`http://localhost:5003/${textFile}`, textFile)}>Download Text</button>
              <button onClick={() => downloadFile(`http://localhost:5003/${imageFile}`, imageFile)}>Download Image</button>
            </p>
            <p className="ai-post-text">Text preview: {textFile.split('/').pop()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Insta;