import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './twit.css';

function Twit() {
  const [prompt, setPrompt] = useState('');
  const [post, setPost] = useState('');
  const [token, setToken] = useState(localStorage.getItem('twitter_token') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem('twitter_token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/twit');
    }
  }, [location]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5002/twitter/auth?platform=twitter';
  };

  const handleLogout = () => {
    localStorage.removeItem('twitter_token');
    setToken('');
  };

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5002/twitter/generate-post', { prompt });
      if (response.data.post) {
        setPost(response.data.post);
      } else {
        throw new Error('No post data received from server');
      }
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error.response
        ? JSON.stringify(error.response.data.details || error.response.data)
        : error.message;
      alert('Failed to generate: ' + errorMessage);
      if (error.response && error.response.data.post) setPost(error.response.data.post);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToTwitter = async () => {
    if (!token) {
      alert('Please log in to Twitter first!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5002/twitter/post', {
        token,
        tweet_text: post,
      });
      if (response.data.success) {
        alert('Posted successfully to Twitter!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to post to Twitter');
    }
  };

  return (
    <div className="twitter-container">
      <div className="twitter-header">
        <h1 className="ai-title">AI Twitter Post</h1>
      </div>
      {!token ? (
        <button className="ai-button ai-login" onClick={handleLogin}>
          Connect with Twitter
        </button>
      ) : (
        <div className="twitter-post-box">
          <div className="twitter-post-header">
            <button className="ai-button ai-close" onClick={handleLogout}>×</button>
          </div>
          <textarea
            className="twitter-post-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What legal, political, global, or climate opinion do you want to share on Twitter?"
          />
          <div className="twitter-post-actions">
            <button className="twitter-ai-button" onClick={handleGeneratePost} disabled={isGenerating}>
              {isGenerating ? (
                <span className="ai-thinking">Thinking<span className="dots">...</span></span>
              ) : (
                'Rewrite with AI'
              )}
            </button>
            <button className="ai-button ai-post" onClick={handlePostToTwitter}>
              Post to Twitter
            </button>
          </div>
          {post && (
            <div className="ai-result">
              <h2 className="ai-subtitle">Generated Tweet</h2>
              <p className="ai-post-text">{post}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Twit;