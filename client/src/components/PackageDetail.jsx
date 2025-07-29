import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download, Star, User, X, Plus } from 'lucide-react';
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

function PackageDetail({ packages, onUpdate, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(location.search.includes('edit=true'));
  const [imageError, setImageError] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);

  const pkg = packages.find(p => p.id == id);
  
  // Initialize shortcuts when package loads
  useEffect(() => {
    if (pkg) {
      setShortcuts(JSON.parse(pkg.shortcuts || '[]'));
    }
  }, [pkg]);
  
  if (!pkg) {
    return (
      <div className="fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Back to Packages
          </button>
        </div>
        <div className="card">
          <h2>Package not found</h2>
          <p>The package you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwner = user && pkg.author_id === user.id;
  const authorAvatarUrl = validateAvatarUrl(pkg.author_avatar);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSave = async () => {
    const updatedPackage = {
      ...pkg,
      shortcuts: shortcuts
    };
    
    const success = await onUpdate(updatedPackage);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
      const success = await onDelete(pkg.id);
      if (success) {
        navigate('/');
      }
    }
  };

  const addShortcut = () => {
    setShortcuts([...shortcuts, { key: '', action: '', description: '' }]);
  };

  const updateShortcut = (index, field, value) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index][field] = value;
    setShortcuts(newShortcuts);
  };

  const removeShortcut = (index) => {
    setShortcuts(shortcuts.filter((_, i) => i !== index));
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to Packages
        </button>
      </div>

      <div className="card">
        {isEditing ? (
          // Edit Mode
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>Edit Package</h1>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn">
                  Save Changes
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name</label>
              <input
                type="text"
                className="input"
                value={pkg.name}
                readOnly
                style={{ opacity: 0.7 }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
              <input
                type="text"
                className="input"
                value={pkg.description}
                readOnly
                style={{ opacity: 0.7 }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600' }}>Shortcuts</label>
                <button onClick={addShortcut} className="btn btn-secondary">
                  <Plus size={16} style={{ marginRight: '0.5rem' }} />
                  Add Shortcut
                </button>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {shortcuts.map((shortcut, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="input"
                      value={shortcut.key}
                      onChange={(e) => updateShortcut(index, 'key', e.target.value)}
                      placeholder="Ctrl+S"
                    />
                    <input
                      type="text"
                      className="input"
                      value={shortcut.action}
                      onChange={(e) => updateShortcut(index, 'action', e.target.value)}
                      placeholder="Save"
                    />
                    <input
                      type="text"
                      className="input"
                      value={shortcut.description}
                      onChange={(e) => updateShortcut(index, 'description', e.target.value)}
                      placeholder="Save the current file"
                    />
                    <button
                      onClick={() => removeShortcut(index)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // View Mode
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0' }}>{pkg.name}</h1>
                <p style={{ margin: '0 0 1rem 0', opacity: 0.8, fontSize: '1.1rem' }}>{pkg.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {authorAvatarUrl && !imageError ? (
                      <img 
                        src={authorAvatarUrl} 
                        alt={pkg.author_username || pkg.author_name}
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%'
                        }}
                        onError={handleImageError}
                      />
                    ) : (
                      <User size={14} />
                    )}
                    <span>By {pkg.author_username || pkg.author_name}</span>
                  </div>
                  {pkg.category && <span>• {pkg.category}</span>}
                  <span>• Created {new Date(pkg.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {isOwner && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                      <Edit size={16} style={{ marginRight: '0.5rem' }} />
                      Edit
                    </button>
                    <button onClick={handleDelete} className="btn btn-secondary">
                      <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} />
                <span>{pkg.downloads || 0} downloads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={16} />
                <span>{pkg.rating || 0} rating</span>
              </div>
            </div>

            <div>
              <h3>Shortcuts ({shortcuts.length})</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="shortcut-key">{shortcut.key}</span>
                      <span style={{ fontWeight: '600' }}>{shortcut.action}</span>
                      <span style={{ opacity: 0.8 }}>{shortcut.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PackageDetail; 