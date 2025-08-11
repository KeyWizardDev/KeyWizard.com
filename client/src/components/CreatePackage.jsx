import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Upload, Image as ImageIcon, Code, Palette, Briefcase, MessageCircle, Video, Globe, FileText, CheckCircle } from 'lucide-react';

// Category configuration with icons and colors (same as PackageList)
const CATEGORIES = {
  'Development': { icon: Code, color: '#2563eb', bgColor: '#dbeafe' },
  'Design': { icon: Palette, color: '#7c3aed', bgColor: '#ede9fe' },
  'Productivity': { icon: Briefcase, color: '#059669', bgColor: '#d1fae5' },
  'Communication': { icon: MessageCircle, color: '#dc2626', bgColor: '#fee2e2' },
  'Media': { icon: Video, color: '#ea580c', bgColor: '#fed7aa' },
  'Web': { icon: Globe, color: '#0891b2', bgColor: '#cffafe' }
};

function CreatePackage({ onCreate }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const jsonFileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [inputMode, setInputMode] = useState('manual'); // 'manual' or 'json'
  const [jsonError, setJsonError] = useState(null);
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: '',
    shortcuts: [{ key: '', action: '', description: '' }]
  });

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
      setFormData(prev => ({ ...prev, image_url: result.imagePath }));
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
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'Other') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, category: selectedValue }));
    }
  };

  const validateKeyWizardJson = (jsonData) => {
    // Check if it has the required structure
    if (!jsonData.Name || !jsonData.Shortcuts || !Array.isArray(jsonData.Shortcuts)) {
      return {
        valid: false,
        error: 'Invalid JSON format. The file must contain "Name" and "Shortcuts" fields, where "Shortcuts" is an array.'
      };
    }

    // Validate each shortcut
    for (let i = 0; i < jsonData.Shortcuts.length; i++) {
      const shortcut = jsonData.Shortcuts[i];
      
      if (!shortcut.Description || !shortcut.Keys || !Array.isArray(shortcut.Keys)) {
        return {
          valid: false,
          error: `Shortcut ${i + 1} is invalid. Each shortcut must have "Description" and "Keys" fields, where "Keys" is an array.`
        };
      }

      if (shortcut.Keys.length === 0) {
        return {
          valid: false,
          error: `Shortcut ${i + 1} has no keys. The "Keys" array must contain at least one key.`
        };
      }

      // Validate that keys are strings
      for (let j = 0; j < shortcut.Keys.length; j++) {
        if (typeof shortcut.Keys[j] !== 'string' || shortcut.Keys[j].trim() === '') {
          return {
            valid: false,
            error: `Shortcut ${i + 1}, key ${j + 1} is invalid. All keys must be non-empty strings.`
          };
        }
      }
    }

    return { valid: true };
  };

  const convertKeyWizardToShortcuts = (jsonData) => {
    return jsonData.Shortcuts.map(shortcut => ({
      key: shortcut.Keys.join('+'),
      action: shortcut.Description,
      description: shortcut.Description
    }));
  };

  const handleJsonFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setJsonError('Please select a valid JSON file (.json)');
      setJsonSuccess(false);
      setUploadedFileName(null);
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      setJsonError('File size must be less than 1MB');
      setJsonSuccess(false);
      setUploadedFileName(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const validation = validateKeyWizardJson(jsonData);
        
        if (!validation.valid) {
          setJsonError(validation.error);
          setJsonSuccess(false);
          setUploadedFileName(null);
          return;
        }

        // Convert KeyWizard format to our internal format
        const shortcuts = convertKeyWizardToShortcuts(jsonData);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          name: jsonData.Name || prev.name,
          shortcuts: shortcuts
        }));
        
        // Show success notification and store filename
        setJsonError(null);
        setJsonSuccess(true);
        setUploadedFileName(file.name);
        
        // Auto-hide success notification after 3 seconds
        setTimeout(() => {
          setJsonSuccess(false);
        }, 3000);
        
      } catch (error) {
        setJsonError('Invalid JSON format. Please check your file and try again.');
        setJsonSuccess(false);
        setUploadedFileName(null);
      }
    };
    reader.readAsText(file);
  };

  const clearJsonError = () => {
    setJsonError(null);
    setJsonSuccess(false);
    setUploadedFileName(null);
    if (jsonFileInputRef.current) {
      jsonFileInputRef.current.value = '';
    }
  };

  const clearUploadedJson = () => {
    setJsonError(null);
    setJsonSuccess(false);
    setUploadedFileName(null);
    setFormData(prev => ({
      ...prev,
      shortcuts: [{ key: '', action: '', description: '' }]
    }));
    if (jsonFileInputRef.current) {
      jsonFileInputRef.current.value = '';
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
              {!showCustomCategory ? (
                <select
                  className="input"
                  value={formData.category || ''}
                  onChange={handleCategoryChange}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    border: '1px solid #6d665b',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'inherit',
                    fontSize: '1rem',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select a category</option>
                  {Object.keys(CATEGORIES).map(category => (
                    <option 
                      key={category} 
                      value={category}
                      style={{
                        backgroundColor: formData.category === category ? CATEGORIES[category].bgColor : 'transparent',
                        color: formData.category === category ? CATEGORIES[category].color : 'inherit'
                      }}
                    >
                      {category}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="input"
                  placeholder="Enter custom category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    border: '1px solid #6d665b',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'inherit',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                />
              )}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Package Image</label>
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
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Shortcuts <span style={{ color: '#ff6b6b' }}>*</span></h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('manual');
                    // Clear JSON state when switching to manual mode
                    setJsonError(null);
                    setJsonSuccess(false);
                    setUploadedFileName(null);
                    if (jsonFileInputRef.current) {
                      jsonFileInputRef.current.value = '';
                    }
                  }}
                  className={`btn ${inputMode === 'manual' ? '' : 'btn-secondary'}`}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('json')}
                  className={`btn ${inputMode === 'json' ? '' : 'btn-secondary'}`}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  <FileText size={16} style={{ marginRight: '0.5rem' }} />
                  Upload JSON
                </button>
              </div>
            </div>

            {inputMode === 'json' && (
              <div style={{ marginBottom: '2rem' }}>
                {/* Success Notification */}
                {jsonSuccess && (
                  <div style={{
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <CheckCircle size={20} />
                    <div>
                      <strong>JSON file uploaded successfully!</strong>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                        {uploadedFileName} has been processed and shortcuts have been imported.
                      </p>
                    </div>
                  </div>
                )}

                {/* File Upload Area */}
                {!uploadedFileName ? (
                  <div style={{
                    border: '2px dashed rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => jsonFileInputRef.current?.click()}
                  >
                    <input
                      ref={jsonFileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleJsonFileInput}
                      style={{ display: 'none' }}
                    />
                    
                    <div>
                      <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                      <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        Upload KeyWizard JSON File
                      </p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem' }}>
                        Click to browse or drag & drop
                      </p>
                      <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                        JSON files up to 1MB
                      </div>
                    </div>
                  </div>
                ) : (
                  /* File Uploaded Placeholder */
                  <div style={{
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: 'rgba(34,197,94,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={24} style={{ color: '#22c55e' }} />
                      <div>
                        <p style={{ margin: '0', fontWeight: '500', color: '#22c55e' }}>
                          {uploadedFileName}
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
                          {formData.shortcuts.length} shortcuts imported
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearUploadedJson}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.7)',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      title="Remove uploaded file"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.target.style.color = '#ff6b6b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'rgba(255,255,255,0.7)';
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {jsonError && (
                  <div style={{
                    backgroundColor: 'rgba(255,107,107,0.1)',
                    border: '1px solid #ff6b6b',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem',
                    color: '#ff6b6b'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong>JSON Format Error:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>{jsonError}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                          Please ensure your JSON follows the KeyWizard format:
                        </p>
                        <pre style={{
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          marginTop: '0.5rem',
                          overflow: 'auto'
                        }}>
{`{
  "Name": "Photoshop Essentials",
  "Shortcuts": [
    {
      "Description": "Undo last action",
      "Keys": [ "CTRL", "Z" ]
    },
    {
      "Description": "Redo last action",
      "Keys": [ "CTRL", "SHIFT", "Z" ]
    },
    {
      "Description": "Select brush tool",
      "Keys": [ "B" ]
    }
  ]
}`}
                        </pre>
                      </div>
                      <button
                        type="button"
                        onClick={clearJsonError}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ff6b6b',
                          fontSize: '1.2rem',
                          padding: '0'
                        }}
                        title="Clear error"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                <div style={{
                  backgroundColor: 'rgba(0,122,204,0.1)',
                  border: '1px solid #007acc',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#007acc' }}>KeyWizard JSON Format</h4>
                  <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.8 }}>
                    Your JSON file must follow this exact format to be compatible with KeyWizard:
                  </p>
                  <ul style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
                    <li><strong>Name:</strong> The package name</li>
                    <li><strong>Shortcuts:</strong> Array of shortcut objects</li>
                    <li><strong>Description:</strong> What the shortcut does</li>
                    <li><strong>Keys:</strong> Array of individual keys (e.g., ["CTRL", "S"])</li>
                  </ul>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Example:</strong>
                    <pre style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      marginTop: '0.5rem',
                      overflow: 'auto'
                    }}>
{`{
  "Name": "Photoshop Essentials",
  "Shortcuts": [
    {
      "Description": "Undo last action",
      "Keys": [ "CTRL", "Z" ]
    },
    {
      "Description": "Redo last action",
      "Keys": [ "CTRL", "SHIFT", "Z" ]
    },
    {
      "Description": "Select brush tool",
      "Keys": [ "B" ]
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            
            {inputMode === 'manual' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
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
              </>
            )}

            {inputMode === 'json' && formData.shortcuts.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Imported Shortcuts ({formData.shortcuts.length})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  <span>Key Combination</span>
                  <span>Action</span>
                  <span>Description</span>
                </div>
                {formData.shortcuts.map((shortcut, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 2fr',
                    gap: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontFamily: 'monospace' }}>{shortcut.key}</span>
                    <span>{shortcut.action}</span>
                    <span>{shortcut.description}</span>
                  </div>
                ))}
              </div>
            )}
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