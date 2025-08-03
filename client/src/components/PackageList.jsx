import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Trash2, Edit, Download, Star, User, Clipboard, Code, Palette, Briefcase, MessageCircle, Video, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useMemo } from 'react';
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

// Category configuration with icons and colors
const CATEGORIES = {
  'All': { icon: null, color: '#6d665b', bgColor: '#f5f5f5' },
  'Development': { icon: Code, color: '#2563eb', bgColor: '#dbeafe' },
  'Design': { icon: Palette, color: '#7c3aed', bgColor: '#ede9fe' },
  'Productivity': { icon: Briefcase, color: '#059669', bgColor: '#d1fae5' },
  'Communication': { icon: MessageCircle, color: '#dc2626', bgColor: '#fee2e2' },
  'Media': { icon: Video, color: '#ea580c', bgColor: '#fed7aa' },
  'Web': { icon: Globe, color: '#0891b2', bgColor: '#cffafe' }
};

function PackageList({ packages, loading, onDelete }) {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleImageError = (authorId) => {
    setImageErrors(prev => new Set(prev).add(authorId));
  };

  // Get unique categories from packages
  const availableCategories = useMemo(() => {
    const categories = new Set(packages.map(pkg => pkg.category).filter(Boolean));
    return ['All', ...Array.from(categories).sort()];
  }, [packages]);

  // Filter packages by selected category
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'All') {
      return packages;
    }
    return packages.filter(pkg => pkg.category === selectedCategory);
  }, [packages, selectedCategory]);

  // Group packages by category for the "All" view
  const groupedPackages = useMemo(() => {
    if (selectedCategory !== 'All') {
      return { [selectedCategory]: filteredPackages };
    }

    const grouped = {};
    packages.forEach(pkg => {
      const category = pkg.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(pkg);
    });

    // Sort categories by the order defined in CATEGORIES
    const sortedGrouped = {};
    Object.keys(CATEGORIES).forEach(cat => {
      if (grouped[cat]) {
        sortedGrouped[cat] = grouped[cat];
      }
    });
    
    // Add any remaining categories
    Object.keys(grouped).forEach(cat => {
      if (!CATEGORIES[cat]) {
        sortedGrouped[cat] = grouped[cat];
      }
    });

    return sortedGrouped;
  }, [packages, selectedCategory, filteredPackages]);

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
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      margin: '2.5rem 0 2rem 0',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 2rem'
    }}>
      {/* Left side - Text content */}
      <div style={{
        flex: '1',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: 800, 
          margin: '0 0 1rem 0', 
          color: '#232323', 
          letterSpacing: '-2px', 
          textAlign: 'left',
          lineHeight: '1.1'
        }}>
          KeyWizard
        </h1>
        <p style={{ 
          fontSize: '1.4rem', 
          color: '#6d665b', 
          margin: '0 0 2rem 0',
          lineHeight: '1.4',
          fontWeight: '600'
        }}>
          The future of Windows productivity and accessibility.
        </p>
        
        {/* Microsoft Store Download Button */}
        <a 
          href="https://apps.microsoft.com/detail/9nf4pjffzzms?hl=en-US&gl=US" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          <img 
            src="/images/DownloadButton.png" 
            alt="Download from Microsoft Store" 
            style={{ 
              height: '60px', 
              width: 'auto',
              display: 'block'
            }} 
          />
        </a>
      </div>

      {/* Right side - Large Image */}
      <div style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img 
          src="/images/example.png" 
          alt="KeyWizard Example" 
          style={{ 
            width: '700px', 
            height: 'auto',
            maxWidth: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(44,39,33,0.15)',
            transform: 'scale(1.1)',
            transformOrigin: 'center'
          }} 
        />
      </div>
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
    
    // Convert to KeyWizard format
    const keyWizardJson = {
      "Name": pkg.name,
      "Shortcuts": shortcuts.map(shortcut => ({
        "Description": shortcut.description || shortcut.action || "",
        "Keys": [shortcut.key || ""]
      }))
    };
    
    const json = JSON.stringify(keyWizardJson, null, 2);
    
    navigator.clipboard.writeText(json).then(() => {
      setToast({ message: 'Copied shortcuts to clipboard!', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    }, () => {
      setToast({ message: 'Failed to copy shortcuts', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    });
  };

  // Category filter buttons
  const CategoryFilters = () => (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {availableCategories.map(category => {
        const config = CATEGORIES[category] || { icon: null, color: '#6d665b', bgColor: '#f5f5f5' };
        const IconComponent = config.icon;
        const isActive = selectedCategory === category;
        
        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderRadius: '50px',
              background: isActive ? config.color : config.bgColor,
              color: isActive ? 'white' : config.color,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
              transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
          >
            {IconComponent && <IconComponent size={16} />}
            {category}
            <span style={{
              background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              color: isActive ? 'white' : 'inherit',
              padding: '0.2rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginLeft: '0.25rem'
            }}>
              {category === 'All' ? packages.length : packages.filter(pkg => pkg.category === category).length}
            </span>
          </button>
        );
      })}
    </div>
  );

  // Package card component
  const PackageCard = ({ pkg }) => {
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
                title="Copy shortcuts to clipboard"
              >
                <Clipboard size={14} />
                Copy Shortcuts
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Category section component
  const CategorySection = ({ category, packages: categoryPackages }) => {
    const config = CATEGORIES[category] || { icon: null, color: '#6d665b', bgColor: '#f5f5f5' };
    const IconComponent = config.icon;
    
    return (
      <div key={category} style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          padding: '1rem 0',
          borderBottom: `2px solid ${config.bgColor}`,
        }}>
          {IconComponent && (
            <div style={{
              background: config.bgColor,
              color: config.color,
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent size={20} />
            </div>
          )}
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#232323',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {category}
            <span style={{
              background: config.bgColor,
              color: config.color,
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {categoryPackages.length}
            </span>
          </h2>
        </div>
        
        <div className="grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {categoryPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <Hero />
      
      <div style={{ marginBottom: '2rem' }}>
        <h1>Keyboard Shortcut Packages</h1>
        <p>Discover and share custom keyboard shortcut collections</p>
      </div>
      
      <CategoryFilters />
      
      {selectedCategory === 'All' ? (
        // Show grouped packages by category
        Object.entries(groupedPackages).map(([category, categoryPackages]) => (
          <CategorySection key={category} category={category} packages={categoryPackages} />
        ))
      ) : (
        // Show filtered packages in a single grid
        <div className="grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
      
      {toast && <Toast {...toast} />}
    </div>
  );
}

export default PackageList; 