import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, Package, User, LogIn, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Utility function to validate avatar URL
const validateAvatarUrl = (url) => {
  if (!url) return null;
  
  // Ensure HTTPS for Google avatar URLs
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  return url;
};

function Header() {
  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const handleImageError = () => {
    console.log('Header image failed to load, falling back to default avatar');
    setImageError(true);
  };

  // Get validated avatar URL and display name
  const avatarUrl = user ? validateAvatarUrl(user.avatar_url) : null;
  const displayName = user ? (user.username || user.displayName || 'User') : 'User';

  // Only show Browse button when not on the main page
  const isOnMainPage = location.pathname === '/';

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="logo-link">
              <img src="/logo.png" alt="KeyWizard Logo" className="logo" style={{ width: '80px', height: '80px', borderRadius: '12px' }} />
            </Link>
            <Link to="/about" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
              About
            </Link>
            {location.pathname !== '/' && (
              <Link to="/" className="btn btn-secondary">
                <Search size={16} /> Browse
              </Link>
            )}
            {!user && (
              <Link to="/login" className="btn" style={{ marginLeft: '1rem' }}>
                <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                Log In
              </Link>
            )}
          </div>
          <nav className="nav">
            {user ? (
              <>
                <Link to="/create" className="btn">
                  <Plus size={16} style={{ marginRight: '0.5rem' }} />
                  Create Package
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  {avatarUrl && !imageError ? (
                    <img 
                      src={avatarUrl} 
                      alt={displayName}
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%',
                        marginRight: '0.5rem'
                      }}
                      onError={handleImageError}
                    />
                  ) : (
                    <User size={16} style={{ marginRight: '0.5rem' }} />
                  )}
                  {displayName}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                  Logout
                </button>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header; 