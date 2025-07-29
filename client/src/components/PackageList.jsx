import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Trash2, Edit, Download, Star, User, Clipboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import Toast from './Toast';

// Utility function to validate avatar URL
const validateAvatarUrl = (url) => {
  if (!url) return null;
  
  // Ensure HTTPS for Google avatar URLs
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  return url;
};

function PackageList({ packages, loading, onDelete }) {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (authorId) => {
    setImageErrors(prev => new Set(prev).add(authorId));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Hero section for homepage
  const Hero = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '2.5rem 0 2rem 0',
    }}>
      <img src="/logo.png" alt="KeyWizard Logo" style={{ width: 90, height: 90, marginBottom: 18, borderRadius: 18, background: '#fffdfa', boxShadow: '0 4px 24px rgba(44,39,33,0.10)' }} />
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#232323', letterSpacing: '-1px', textAlign: 'center' }}>Shortcut Evolution.<br /><span style={{ fontWeight: 400, fontSize: '1.2rem', color: '#6d665b' }}>Be the final form.</span></h1>
    </div>
  );

  if (packages.length === 0) {
    return (
      <>
        <Hero />
        <div className="card fade-in">
          <h2>No packages found</h2>
          <p>Be the first to create a keyboard shortcut package!</p>
          {user ? (
            <Link to="/create" className="btn">
              Create Package
            </Link>
          ) : (
            <Link to="/login" className="btn">
              Sign In to Create
            </Link>
          )}
        </div>
      </>
    );
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await onDelete(id);
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = (pkg) => {
    let shortcuts = [];
    try {
      shortcuts = JSON.parse(pkg.shortcuts || '[]');
    } catch (e) {}
    
    const json = JSON.stringify({
      name: pkg.name,
      description: pkg.description,
      category: pkg.category,
      shortcuts: shortcuts
    }, null, 2);
    
    navigator.clipboard.writeText(json).then(() => {
      setToast({ message: 'Copied JSON to clipboard!', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    }, () => {
      setToast({ message: 'Failed to copy JSON', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    });
  };

  return (
    <div className="fade-in">
      <Hero />
      <div style={{ marginBottom: '2rem' }}>
        <h1>Keyboard Shortcut Packages</h1>
        <p>Discover and share custom keyboard shortcut collections</p>
      </div>
      
      <div className="grid">
        {packages.map((pkg) => {
          const shortcuts = JSON.parse(pkg.shortcuts || '[]');
          const isOwner = user && pkg.author_id === user.id;
          const authorAvatarUrl = validateAvatarUrl(pkg.author_avatar);
          const hasImageError = imageErrors.has(pkg.author_id);
          
          return (
            <div key={pkg.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{pkg.name}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', opacity: 0.8 }}>{pkg.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {authorAvatarUrl && !hasImageError ? (
                        <img 
                          src={authorAvatarUrl} 
                          alt={pkg.author_username || pkg.author_name}
                          style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%'
                          }}
                          onError={() => handleImageError(pkg.author_id)}
                        />
                      ) : (
                        <User size={14} />
                      )}
                      <span>By {pkg.author_username || pkg.author_name}</span>
                    </div>
                    {pkg.category && <span>• {pkg.category}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
                      title="Delete package"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Download size={14} />
                  <span style={{ fontSize: '0.9rem' }}>{pkg.downloads || 0} downloads</span>
                  <Star size={14} />
                  <span style={{ fontSize: '0.9rem' }}>{pkg.rating || 0} rating</span>
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
                  <ExternalLink size={16} style={{ marginRight: '0.5rem' }} />
                  View Details
                </Link>
                <button
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleCopyJson(pkg)}
                  title="Copy JSON to clipboard"
                >
                  <Clipboard size={16} />
                  Copy JSON
                </button>
                {isOwner && (
                  <Link to={`/package/${pkg.id}?edit=true`} className="btn btn-secondary">
                    <Edit size={16} style={{ marginRight: '0.5rem' }} />
                    Edit
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {toast && <Toast {...toast} />}
    </div>
  );
}

export default PackageList; 