import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [token, setToken] = useState({
    linkedin: localStorage.getItem('linkedin_token') || '',
    twitter: localStorage.getItem('twitter_token') || ''
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      const platformFromUrl = params.get('platform') || 'linkedin';
      if (platformFromUrl === 'linkedin') {
        setToken(prev => ({ ...prev, linkedin: tokenFromUrl }));
        localStorage.setItem('linkedin_token', tokenFromUrl);
        navigate('/linke');
      } else if (platformFromUrl === 'twitter') {
        setToken(prev => ({ ...prev, twitter: tokenFromUrl }));
        localStorage.setItem('twitter_token', tokenFromUrl);
        navigate('/twit');
      }
      window.history.replaceState({}, document.title, '/');
    }
  }, [location, navigate]);

  const handleNavigate = (path, platform) => {
    if (!token[platform]) {
      window.location.href = platform === 'linkedin' 
        ? 'http://localhost:5001/auth/linkedin' 
        : 'http://localhost:5002/twitter/auth?platform=twitter';
    } else {
      navigate(path);
    }
  };

  const handleLogout = (platform) => {
    if (platform === 'linkedin') {
      localStorage.removeItem('linkedin_token');
      setToken(prev => ({ ...prev, linkedin: '' }));
    } else if (platform === 'twitter') {
      localStorage.removeItem('twitter_token');
      setToken(prev => ({ ...prev, twitter: '' }));
    }
  };

  return (
    <div className="home-container">
      <div className="linkedin-header">
        <h1 className="ai-title">AI Social Connector</h1>
      </div>
      <div className="platform-buttons">
        {!token.linkedin ? (
          <button className="ai-button ai-login linkedin" onClick={() => handleNavigate('/linke', 'linkedin')}>
            Connect with LinkedIn
          </button>
        ) : (
          <button className="ai-button linkedin connected" onClick={() => handleLogout('linkedin')}>
            Disconnect LinkedIn
          </button>
        )}
        {!token.twitter ? (
          <button className="ai-button ai-login twitter" onClick={() => handleNavigate('/twit', 'twitter')}>
            Connect with Twitter
          </button>
        ) : (
          <button className="ai-button twitter connected" onClick={() => handleLogout('twitter')}>
            Disconnect Twitter
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;