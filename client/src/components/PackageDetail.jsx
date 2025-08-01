import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download, Star, User, X, Plus, Upload, Image as ImageIcon, Clipboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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

function PackageDetail({ packages, onUpdate, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(location.search.includes('edit=true'));
  const [imageError, setImageError] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);

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
      shortcuts: shortcuts,
      image_url: pkg.image_url // Preserve the existing image_url
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

  const handleCopyShortcuts = () => {
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
    }).catch(err => {
      setToast({ message: 'Failed to copy shortcuts', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload the file
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      // Update the package with new image URL
      const updatedPkg = { ...pkg, image_url: result.imagePath };
      const packageIndex = packages.findIndex(p => p.id === pkg.id);
      if (packageIndex !== -1) {
        packages[packageIndex] = updatedPkg;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message);
      setSelectedImage(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    
    // Update the package to remove image URL
    const updatedPkg = { ...pkg, image_url: '' };
    const packageIndex = packages.findIndex(p => p.id === pkg.id);
    if (packageIndex !== -1) {
      packages[packageIndex] = updatedPkg;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Package Image</label>
              <div
                style={{
                  border: dragActive ? '2px dashed #007acc' : '2px dashed rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: dragActive ? 'rgba(0,122,204,0.1)' : 'rgba(255,255,255,0.05)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
                
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff6b6b',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
                      }}
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : pkg.image_url ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={pkg.image_url}
                      alt="Current package image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }}
                    />
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        Click to replace or drag a new image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                    <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                      {uploading ? 'Uploading...' : 'Drag & drop an image here'}
                    </p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem' }}>
                      or click to browse
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.6 }}>
                      <ImageIcon size={16} />
                      <span style={{ fontSize: '0.85rem' }}>
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem' }}>
                Add a relevant image to make your package stand out. Recommended size: 400x300px
              </p>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Shortcuts ({shortcuts.length})</h3>
                <button onClick={handleCopyShortcuts} className="btn btn-secondary">
                  <Clipboard size={16} style={{ marginRight: '0.5rem' }} />
                  Copy Shortcuts
                </button>
              </div>
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
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default PackageDetail; 