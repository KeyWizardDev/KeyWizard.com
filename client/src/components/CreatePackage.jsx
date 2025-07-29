import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';

function CreatePackage({ onCreate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: '',
    shortcuts: [{ key: '', action: '', description: '' }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.shortcuts.length === 0 || !formData.shortcuts[0].key.trim()) {
      alert('Please add at least one shortcut');
      return;
    }

    setLoading(true);
    const success = await onCreate(formData);
    if (success) {
      navigate('/');
    }
    setLoading(false);
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
    if (formData.shortcuts.length > 1) {
      setFormData(prev => ({
        ...prev,
        shortcuts: prev.shortcuts.filter((_, i) => i !== index)
      }));
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
        <div style={{ marginBottom: '2rem' }}>
          <h1>Create New Package</h1>
          <p>Share your custom keyboard shortcuts with the community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Package Name <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., VS Code Productivity Pack"
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
              <textarea
                className="input"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this package is for and what shortcuts it includes..."
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
                placeholder="e.g., Development, Design, Productivity"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Package Image URL</label>
              <input
                type="url"
                className="input"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg (optional)"
              />
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>
                Add a relevant image to make your package stand out. Recommended size: 400x300px
              </p>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Shortcuts <span style={{ color: '#ff6b6b' }}>*</span></h3>
              <button type="button" onClick={addShortcut} className="btn btn-secondary">
                <Plus size={16} style={{ marginRight: '0.5rem' }} />
                Add Shortcut
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                <span>Key Combination</span>
                <span>Action</span>
                <span>Description</span>
                <span></span>
              </div>
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
                    required={index === 0}
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
                  {formData.shortcuts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShortcut(index)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
                      title="Remove shortcut"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn" disabled={loading}>
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Creating...' : 'Create Package'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePackage; 