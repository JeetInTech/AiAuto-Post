import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [token, setToken] = useState({
    linkedin: localStorage.getItem('linkedin_token') || '',
    twitter: localStorage.getItem('twitter_token') || '',
    instagram: localStorage.getItem('instagram_token') || '',
    facebook: localStorage.getItem('facebook_token') || '',
    telegram: localStorage.getItem('telegram_token') || '',
    whatsapp: localStorage.getItem('whatsapp_token') || '',
    reddit: localStorage.getItem('reddit_token') || '',
  });
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    const platformFromUrl = params.get('platform') || 'linkedin';

    if (tokenFromUrl) {
      setToken(prev => ({ ...prev, [platformFromUrl]: tokenFromUrl }));
      localStorage.setItem(`${platformFromUrl}_token`, tokenFromUrl);
      navigate(platformFromUrl === 'linkedin' ? '/linke' : platformFromUrl === 'twitter' ? '/twit' : '/');
      window.history.replaceState({}, document.title, '/');
    }
  }, [location, navigate]);

  const handleNavigate = (path, platform) => {
    if (!token[platform]) {
      try {
        const authUrls = {
          linkedin: 'http://localhost:5001/auth/linkedin',
          twitter: 'http://localhost:5002/twitter/auth?platform=twitter',
          instagram: 'http://localhost:5003/auth/instagram?platform=instagram',
          facebook: 'http://localhost:5004/auth/facebook?platform=facebook',
          telegram: 'http://localhost:5005/auth/telegram?platform=telegram',
          whatsapp: 'http://localhost:5006/auth/whatsapp?platform=whatsapp',
          reddit: 'http://localhost:5007/auth/reddit?platform=reddit',
        };
        const authUrl = authUrls[platform];
        window.location.href = authUrl;
      } catch (err) {
        setError(`Failed to redirect to ${platform} authentication. Please try again.`);
      }
    } else {
      navigate(path);
    }
  };

  const handleLogout = (platform) => {
    localStorage.removeItem(`${platform}_token`);
    setToken(prev => ({ ...prev, [platform]: '' }));
  };

  return (
    <div className="home-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')} aria-label="Close error message">Close</button>
        </div>
      )}

      <header className="linkedin-header">
        <h1 className="ai-title">AI Social Connector</h1>
        <p className="subtitle">Enhance your social media presence with AI-powered tools</p>
      </header>
      
      <div className="platform-buttons">
        <div className="platform-card">
          {!token.linkedin ? (
            <button
              className="ai-button ai-login linkedin"
              onClick={() => handleNavigate('/linke', 'linkedin')}
              aria-label="Connect with LinkedIn"
            >
              <span className="platform-icon linkedin-icon"></span>
              Connect with LinkedIn
            </button>
          ) : (
            <button
              className="ai-button linkedin connected"
              onClick={() => handleLogout('linkedin')}
              aria-label="Disconnect LinkedIn"
            >
              <span className="platform-icon linkedin-icon"></span>
              Disconnect LinkedIn
            </button>
          )}
        </div>

        <div className="platform-card">
          {!token.twitter ? (
            <button
              className="ai-button ai-login twitter"
              onClick={() => handleNavigate('/twit', 'twitter')}
              aria-label="Connect with Twitter"
            >
              <span className="platform-icon twitter-icon"></span>
              Connect with Twitter
            </button>
          ) : (
            <button
              className="ai-button twitter connected"
              onClick={() => handleLogout('twitter')}
              aria-label="Disconnect Twitter"
            >
              <span className="platform-icon twitter-icon"></span>
              Disconnect Twitter
            </button>
          )}
        </div>

        <div className="platform-card">
          {!token.instagram ? (
            <button
              className="ai-button ai-login instagram"
              onClick={() => handleNavigate('/', 'instagram')}
              aria-label="Connect with Instagram"
            >
              <span className="platform-icon instagram-icon"></span>
              Connect with Instagram
            </button>
          ) : (
            <button
              className="ai-button instagram connected"
              onClick={() => handleLogout('instagram')}
              aria-label="Disconnect Instagram"
            >
              <span className="platform-icon instagram-icon"></span>
              Disconnect Instagram
            </button>
          )}
        </div>

        <div className="platform-card">
          {!token.facebook ? (
            <button
              className="ai-button ai-login facebook"
              onClick={() => handleNavigate('/', 'facebook')}
              aria-label="Connect with Facebook"
            >
              <span className="platform-icon facebook-icon"></span>
              Connect with Facebook
            </button>
          ) : (
            <button
              className="ai-button facebook connected"
              onClick={() => handleLogout('facebook')}
              aria-label="Disconnect Facebook"
            >
              <span className="platform-icon facebook-icon"></span>
              Disconnect Facebook
            </button>
          )}
        </div>

        <div className="platform-card">
          {!token.telegram ? (
            <button
              className="ai-button ai-login telegram"
              onClick={() => handleNavigate('/', 'telegram')}
              aria-label="Connect with Telegram"
            >
              <span className="platform-icon telegram-icon"></span>
              Connect with Telegram
            </button>
          ) : (
            <button
              className="ai-button telegram connected"
              onClick={() => handleLogout('telegram')}
              aria-label="Disconnect Telegram"
            >
              <span className="platform-icon telegram-icon"></span>
              Disconnect Telegram
            </button>
          )}
        </div>

        <div className="platform-card">
          {!token.whatsapp ? (
            <button
              className="ai-button ai-login whatsapp"
              onClick={() => handleNavigate('/', 'whatsapp')}
              aria-label="Connect with WhatsApp"
            >
              <span className="platform-icon whatsapp-icon"></span>
              Connect with WhatsApp
            </button>
          ) : (
            <button
              className="ai-button whatsapp connected"
              onClick={() => handleLogout('whatsapp')}
              aria-label="Disconnect WhatsApp"
            >
              <span className="platform-icon whatsapp-icon"></span>
              Disconnect WhatsApp
            </button>
          )}
        </div>

        <div className="platform-card">
          {!token.reddit ? (
            <button
              className="ai-button ai-login reddit"
              onClick={() => handleNavigate('/', 'reddit')}
              aria-label="Connect with Reddit"
            >
              <span className="platform-icon reddit-icon"></span>
              Connect with Reddit
            </button>
          ) : (
            <button
              className="ai-button reddit connected"
              onClick={() => handleLogout('reddit')}
              aria-label="Disconnect Reddit"
            >
              <span className="platform-icon reddit-icon"></span>
              Disconnect Reddit
            </button>
          )}
        </div>
      </div>
      
      <section className="ai-features">
        <h2 className="ai-section-title">AI-Powered Features</h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-img post-ai-img"></div>
            <div className="feature-content">
              <h3 className="feature-title">Post with AI</h3>
              <p className="feature-description">
                Create engaging social media posts with the help of AI. Generate content ideas, optimize your posts for engagement, and schedule them for the best time.
              </p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-img write-ai-img"></div>
            <div className="feature-content">
              <h3 className="feature-title">Write with AI</h3>
              <p className="feature-description">
                Enhance your writing with AI-powered suggestions. Create professional articles, blog posts, and newsletters that resonate with your audience.
              </p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-img future-ai-img"></div>
            <div className="feature-content">
              <h3 className="feature-title">AI and the Future</h3>
              <p className="feature-description">
                Stay ahead of the curve with insights on how AI is transforming social media. Learn about emerging trends and how to leverage them for your brand.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:sangramjeet47@gmail.com" className="contact-link">
                  <span className="contact-icon email-icon"></span>
                  sangramjeet47@gmail.com
                </a>
              </li>
              <li>
                <a href="https://sangramjeet.netlify.app" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-icon portfolio-icon"></span>
                  sangramjeet.netlify.app
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>© 2025 JEET. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;