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
  const [isPosting, setIsPosting] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', profilePicture: '' });
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem('linkedin_token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/linke');
      fetchProfile(tokenFromUrl);
    } else if (token) {
      fetchProfile(token);
    }
  }, [location, token]);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('https://aiauto-post.onrender.com/api/linkedin-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setPopupMessage('Failed to fetch profile: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  const handleLogin = () => {
    window.location.href = 'https://aiauto-post.onrender.com/auth/linkedin';
  };

  const handleLogout = () => {
    localStorage.removeItem('linkedin_token');
    setToken('');
    setProfile({ name: '', profilePicture: '' });
  };

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    try {
      // Align the prompt with the server's expectations (150-200 words)
      const detailedPrompt = `${prompt}. Provide a detailed LinkedIn post (150-200 words) with context, an engaging tone, emojis, and 3-5 relevant hashtags. Ensure the post is complete and professional.`;
      
      const [postResponse, imageResponse] = await Promise.all([
        axios.post('https://aiauto-post.onrender.com/generate-post', { prompt: detailedPrompt }),
        axios.post('https://aiauto-post.onrender.com/generate-image', { prompt }),

      ]);

      let generatedPost = postResponse.data.post;

      // Add hashtags if none are present
      if (!generatedPost.includes('#')) {
        generatedPost += '\n\n#HumanEvolution #Innovation #Curiosity #LearningTogether #ProfessionalGrowth';
      }

      setPost(generatedPost);
      setImageUrl(imageResponse.data.imageUrl);
    } catch (error) {
      // Log the full error for debugging
      console.error('Full generation error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status:', error.response.status);
      }

      // Provide a more specific error message
      let errorMessage = 'An unexpected error occurred while generating the post.';
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Server error: The post generation service is currently unavailable.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid request: The prompt may not meet the server’s requirements.';
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.request) {
        errorMessage = 'Network error: Unable to reach the post generation service. Please check if the server is running.';
      }

      setPopupMessage(`Failed to generate post: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToLinkedIn = async () => {
    setIsPosting(true);
    try {
      const response = await axios.post('https://aiauto-post.onrender.com/post-to-linkedin', {
        token,
        post,
        imageUrl,
      });
      if (response.data.success) {
        setPopupMessage('Posted successfully!');
      }
    } catch (error) {
      console.error('Post to LinkedIn error:', error);
      setPopupMessage('Failed to post to LinkedIn: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    } finally {
      setIsPosting(false);
    }
  };

  const closePopup = () => {
    setPopupMessage('');
  };

  return (
    <div className="linkedin-container">
      <h1 className="linkedin-title">AI Auto Post</h1>
      {!token ? (
        <button className="linkedin-button linkedin-login" onClick={handleLogin}>
          Connect with LinkedIn
        </button>
      ) : (
        <div className="linkedin-post-section">
          <div className="linkedin-profile">
            <img
              src={profile.profilePicture || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
              alt="Profile"
              className="linkedin-profile-pic"
            />
            <span className="linkedin-profile-name">{profile.name || 'User'}</span>
            <button className="linkedin-button linkedin-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <textarea
            className="linkedin-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to talk about?"
          />
          <div className="linkedin-actions">
            <button
              className="linkedin-button linkedin-generate"
              onClick={handleGeneratePost}
              disabled={isGenerating || isPosting}
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
            <button
              className="linkedin-button linkedin-post"
              onClick={handlePostToLinkedIn}
              disabled={isPosting || isGenerating || !post || !imageUrl}
            >
              {isPosting ? 'Posting...' : 'Post to LinkedIn'}
            </button>
          </div>
          {post && imageUrl && (
            <div className="linkedin-result">
              <h2 className="linkedin-subtitle">Generated Content</h2>
              <p className="linkedin-post-text">{post}</p>
              <img src={imageUrl} alt="Generated" className="linkedin-generated-image" />
            </div>
          )}
        </div>
      )}

      {popupMessage && (
        <div className="linkedin-popup-overlay">
          <div className="linkedin-popup">
            <p className="linkedin-popup-message">{popupMessage}</p>
            <button className="linkedin-popup-close" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Linke;