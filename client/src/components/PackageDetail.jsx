import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Download, Star, Trash2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function PackageDetail({ packages, onUpdate, onDelete }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  const [loading, setLoading] = useState(false);
  
  const pkg = packages.find(p => p.id === parseInt(id));
  const isOwner = user && pkg && pkg.author_id === user.id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    shortcuts: []
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description || '',
        category: pkg.category || '',
        shortcuts: JSON.parse(pkg.shortcuts || '[]')
      });
    }
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="card fade-in">
        <h2>Package not found</h2>
        <p>The package you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn">
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to Packages
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    const success = await onUpdate(pkg.id, formData);
    if (success) {
      setIsEditing(false);
      navigate(`/package/${pkg.id}`);
    }
    setLoading(false);
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
    setFormData(prev => ({
      ...prev,
      shortcuts: [...prev.shortcuts, { key: '', action: '', description: '' }]
    }));
  };

  const updateShortcut = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      shortcuts: prev.shortcuts.map((shortcut, i) => 
        i === index ? { ...shortcut, [field]: value } : shortcut
      )
    }));
  };

  const removeShortcut = (index) => {
    setFormData(prev => ({
      ...prev,
      shortcuts: prev.shortcuts.filter((_, i) => i !== index)
    }));
  };

  const shortcuts = JSON.parse(pkg.shortcuts || '[]');

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
          // Edit Form
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>Edit Package</h1>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSave} className="btn" disabled={loading}>
                  <Save size={16} style={{ marginRight: '0.5rem' }} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  <X size={16} style={{ marginRight: '0.5rem' }} />
                  Cancel
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Package Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter package name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your shortcut package"
                  rows="3"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <input
                  type="text"
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Development, Design"
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Shortcuts</h3>
                <button onClick={addShortcut} className="btn btn-secondary">
                  Add Shortcut
                </button>
              </div>
              
              {formData.shortcuts.map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '1rem', width: '100%' }}>
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
                </div>
              ))}
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
                    {pkg.author_avatar ? (
                      <img 
                        src={pkg.author_avatar} 
                        alt={pkg.author_username}
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%'
                        }}
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