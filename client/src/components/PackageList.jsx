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
      
      <div className="grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {packages.map((pkg) => {
          const shortcuts = JSON.parse(pkg.shortcuts || '[]');
          const isOwner = user && pkg.author_id === user.id;
          
          return (
            <Link 
              key={pkg.id} 
              to={`/package/${pkg.id}`}
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'block'
              }}
            >
              <div className="card" style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              >
                {/* Package Image */}
                <div style={{
                  height: '200px',
                  background: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {pkg.image_url ? (
                    <img 
                      src={pkg.image_url} 
                      alt={pkg.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        padding: pkg.name.toLowerCase().includes('vscode') ? '20px' : '0px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    display: pkg.image_url ? 'none' : 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    color: '#6d665b',
                    fontSize: '3rem',
                    opacity: 0.8
                  }}>
                    ⌨️
                  </div>
                  
                  {/* Owner delete button overlay */}
                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(pkg.id, pkg.name);
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220,38,38,0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
                      }}
                      title="Delete package"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                {/* Package Info */}
                <div style={{
                  padding: '1rem',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: '#232323'
                    }}>
                      {pkg.name}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#6d665b',
                      marginBottom: '0.5rem'
                    }}>
                      <span>• {shortcuts.length} shortcuts</span>
                      {pkg.category && <span>• {pkg.category}</span>}
                    </div>
                  </div>
                  
                  {/* Quick action buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: 'auto'
                  }}>
                    <button
                      className="btn btn-secondary"
                      style={{
                        flex: 1,
                        fontSize: '0.85rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyJson(pkg);
                      }}
                      title="Copy JSON to clipboard"
                    >
                      <Clipboard size={14} />
                      Copy JSON
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {toast && <Toast {...toast} />}
    </div>
  );
}

export default PackageList; 