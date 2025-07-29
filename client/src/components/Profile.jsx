import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Calendar, Package, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

// Utility function to validate avatar URL
const validateAvatarUrl = (url) => {
  if (!url) return null;
  
  // Ensure HTTPS for Google avatar URLs
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  return url;
};

function Profile() {
  const { user, logout } = useAuth();
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPackages();
    }
  }, [user]);

  const fetchUserPackages = async () => {
    try {
      const response = await fetch(`/api/auth/user/${user.id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setUserPackages(data.packages || []);
    } catch (error) {
      console.error('Error fetching user packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleImageError = () => {
    console.log('Profile image failed to load, falling back to default avatar');
    setImageError(true);
  };

  if (!user) {
    return null;
  }

  // Debug logging
  console.log('User data in Profile:', user);
  
  // Get validated avatar URL
  const avatarUrl = validateAvatarUrl(user.avatar_url);
  const displayName = user.username || user.displayName || 'User';

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to Packages
        </Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {avatarUrl && !imageError ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.2)'
              }}
              onError={handleImageError}
            />
          ) : (
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(255,255,255,0.2)'
            }}>
              <User size={40} />
            </div>
          )}
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>{displayName}</h1>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.8 }}>{user.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.7 }}>
              <Calendar size={14} />
              <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogOut size={16} style={{ marginRight: '0.5rem' }} />
              Logout
            </button>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Package size={20} />
            <h2>My Packages ({userPackages.length})</h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : userPackages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
              <Package size={48} style={{ marginBottom: '1rem' }} />
              <h3>No packages yet</h3>
              <p>Start creating your first keyboard shortcut package!</p>
              <Link to="/create" className="btn">
                Create Package
              </Link>
            </div>
          ) : (
            <div className="grid">
              {userPackages.map((pkg) => {
                const shortcuts = JSON.parse(pkg.shortcuts || '[]');
                return (
                  <div key={pkg.id} className="card">
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{pkg.name}</h3>
                      <p style={{ margin: '0 0 0.5rem 0', opacity: 0.8 }}>{pkg.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                        {pkg.category && <span>• {pkg.category}</span>}
                        <span>• Created {new Date(pkg.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Shortcuts ({shortcuts.length})</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {shortcuts.slice(0, 3).map((shortcut, index) => (
                          <span key={index} className="shortcut-key">
                            {shortcut.key}
                          </span>
                        ))}
                        {shortcuts.length > 3 && (
                          <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                            +{shortcuts.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/package/${pkg.id}`} className="btn">
                        View Details
                      </Link>
                      <Link to={`/package/${pkg.id}?edit=true`} className="btn btn-secondary">
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 