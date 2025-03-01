import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './linke.css';

function Linke() {
  const [prompt, setPrompt] = useState('');
  const [post, setPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [token, setToken] = useState(localStorage.getItem('linkedin_token') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState({ name: '', profilePicture: '' }); // State for profile data
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem('linkedin_token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/linke'); // Update URL for LinkedIn page
      fetchProfile(tokenFromUrl); // Fetch profile after login
    }
  }, [location]);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:5001/api/linkedin-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      alert('Failed to fetch profile: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/auth/linkedin';
  };

  const handleLogout = () => {
    localStorage.removeItem('linkedin_token');
    setToken('');
    setProfile({ name: '', profilePicture: '' }); // Clear profile on logout
  };

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    try {
      const [postResponse, imageResponse] = await Promise.all([
        axios.post('http://localhost:5001/generate-post', { prompt }),
        axios.post('http://localhost:5001/generate-image', { prompt }),
      ]);
      setPost(postResponse.data.post);
      setImageUrl(imageResponse.data.imageUrl);
    } catch (error) {
      const errorMessage = error.response
        ? JSON.stringify(error.response.data.details || error.response.data)
        : error.message;
      console.error('Generation error:', error.response ? error.response.data : error);
      alert('Failed to generate: ' + errorMessage);
      if (error.response && error.response.data.post) setPost(error.response.data.post);
      if (error.response && error.response.data.imageUrl) setImageUrl(error.response.data.imageUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToLinkedIn = async () => {
    try {
      const response = await axios.post('http://localhost:5001/post-to-linkedin', {
        token,
        post,
        imageUrl,
      });
      if (response.data.success) {
        alert('Posted successfully!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to post to LinkedIn');
    }
  };

  return (
    <div className="linkedin-container">
      <div className="linkedin-header">
        <h1 className="ai-title">AI Auto Post</h1>
      </div>
      {!token ? (
        <button className="ai-button ai-login" onClick={handleLogin}>
          Connect with LinkedIn
        </button>
      ) : (
        <div className="linkedin-post-box">
          <div className="linkedin-post-header">
            <img src={profile.profilePicture || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="Profile" className="linkedin-profile-pic" />
            <div className="linkedin-user-info">
              <span className="linkedin-user-name">{profile.name || 'Sangramjeet Ghosh'}</span>
              <select className="linkedin-visibility">
                <option>Post to Anyone</option>
                <option>Connections Only</option>
                <option>Followers Only</option>
              </select>
            </div>
            <button className="ai-button ai-close" onClick={handleLogout}>×</button>
          </div>
          <textarea
            className="linkedin-post-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to talk about?"
          />
          <div className="linkedin-post-actions">
            <button className="linkedin-ai-button" onClick={handleGeneratePost} disabled={isGenerating}>
              {isGenerating ? (
                <span className="ai-thinking">Thinking<span className="dots">...</span></span>
              ) : (
                'Rewrite with AI'
              )}
            </button>
            <button className="ai-button ai-post" onClick={handlePostToLinkedIn}>
              Post
            </button>
          </div>
          {post && imageUrl && (
            <div className="ai-result">
              <h2 className="ai-subtitle">Generated Post</h2>
              <p className="ai-post-text">{post}</p>
              <img src={imageUrl} alt="Generated" className="ai-image" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Linke;