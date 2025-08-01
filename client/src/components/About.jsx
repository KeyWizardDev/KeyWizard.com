import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone, Tablet, Headphones, CheckCircle } from 'lucide-react';

function About() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fffdfa',
      padding: '2rem 0'
    }}>
      <div className="container">
        {/* Header */}
        <div className="about-header" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '3rem',
          gap: '1rem'
        }}>
          <Link to="/" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: '#232323',
            margin: 0
          }}>
            About KeyWizard
          </h1>
        </div>

        <div className="about-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem',
          alignItems: 'start'
        }}>
          {/* Left Column - Content */}
          <div>
            {/* Description */}
            <section style={{ marginBottom: '3rem' }}>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.7', 
                color: '#4a4a4a',
                marginBottom: '2rem'
              }}>
                Key Wizard is a lightweight, Windows-focused utility that is designed to maximize your productivity by giving you instant access to loads of Windows keyboard shortcuts.
              </p>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.7', 
                color: '#4a4a4a',
                marginBottom: '2rem'
              }}>
                This app runs in the background and can be instantly accessed using <strong>Ctrl + Alt + K</strong> commands. With Key Wizard, you can effortlessly find shortcuts for everything from system functions and file management to text editing and application-specific tasks. Whether you're looking to streamline routine operations or unlock hidden features of Windows, this tool helps you navigate the complexities of your keyboard with ease.
              </p>
            </section>

            {/* Key Features */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 700, 
                color: '#232323',
                marginBottom: '1.5rem'
              }}>
                Key Features
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} style={{ color: '#0078d4', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#232323' }}>Comprehensive Shortcut Search:</strong> Quickly search and discover keyboard shortcuts across various categories to boost productivity.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} style={{ color: '#0078d4', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#232323' }}>Windows-Focused:</strong> Specifically designed for Windows, ensuring seamless integration with your system.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} style={{ color: '#0078d4', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#232323' }}>Lightweight and Responsive:</strong> Enjoy fast, unobtrusive performance that runs smoothly in the background.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} style={{ color: '#0078d4', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#232323' }}>Instant Access:</strong> The app runs in the background and can be instantly accessed using the keys <strong>Ctrl + Alt + K</strong>.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} style={{ color: '#0078d4', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#232323' }}>Custom Shortcuts:</strong> Key Wizard doesn't just enhance productivity but also allows creativity! You can add your custom shortcuts in a JSON file in Documents\Key Wizard and execute them!
                  </div>
                </div>
              </div>
              <p style={{ 
                fontSize: '1.1rem', 
                fontStyle: 'italic', 
                color: '#6d665b',
                marginTop: '1.5rem',
                textAlign: 'center'
              }}>
                "Shortcuts are meant to be short, Key Wizard ensures they are!"
              </p>
            </section>

            {/* System Requirements */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 700, 
                color: '#232323',
                marginBottom: '1.5rem'
              }}>
                System Requirements
              </h2>
              <div style={{ 
                background: '#f8f7f4', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '1px solid #e5e1d8'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 600, 
                    color: '#232323',
                    marginBottom: '0.75rem'
                  }}>
                    Available on:
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Monitor size={16} style={{ color: '#0078d4' }} />
                      <span>PC</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Smartphone size={16} style={{ color: '#0078d4' }} />
                      <span>Mobile</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Tablet size={16} style={{ color: '#0078d4' }} />
                      <span>Surface Hub</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Headphones size={16} style={{ color: '#0078d4' }} />
                      <span>HoloLens</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 600, 
                    color: '#232323',
                    marginBottom: '0.5rem'
                  }}>
                    OS:
                  </h3>
                  <p style={{ color: '#4a4a4a', margin: 0 }}>
                    Windows 10 version 17763.0 or higher
                  </p>
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 600, 
                    color: '#232323',
                    marginBottom: '0.5rem'
                  }}>
                    Keyboard:
                  </h3>
                  <p style={{ color: '#4a4a4a', margin: 0 }}>
                    Integrated Keyboard (Minimum), Not specified (Recommended)
                  </p>
                </div>
              </div>
            </section>

            {/* What's New */}
            <section>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 700, 
                color: '#232323',
                marginBottom: '1.5rem'
              }}>
                What's new in this version
              </h2>
              <div style={{ 
                background: '#f0f8ff', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '1px solid #cce7ff'
              }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 600, 
                  color: '#0078d4',
                  marginBottom: '1rem'
                }}>
                  New Version 1.0.2.0 -- Bug Fixes and Enhancements
                </h3>
                <ol style={{ 
                  paddingLeft: '1.5rem', 
                  color: '#4a4a4a',
                  lineHeight: '1.6'
                }}>
                  <li>Fixed some shortcuts to ensure a smoother and more reliable experience.</li>
                  <li>Enhanced voice input for greater accuracy and responsiveness.</li>
                  <li>Refined User Interface for improved navigation.</li>
                  <li>Improved Custom Shortcuts such that it is read every time the app is launched instead of restarting the app</li>
                </ol>
                <div style={{ 
                  background: '#fff', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  marginTop: '1rem',
                  border: '1px solid #e0e0e0'
                }}>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#666', 
                    marginBottom: '0.75rem',
                    fontStyle: 'italic'
                  }}>
                    You can add custom shortcuts in a JSON file and store it in Documents\Key Wizard to execute these.
                  </p>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#666', 
                    marginBottom: '0.75rem'
                  }}>
                    You can do so by:
                  </p>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '0.75rem', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem',
                    overflow: 'auto',
                    border: '1px solid #ddd'
                  }}>
{`{
  "Name": "Name of App for which shortcut is to be executed",
  "Shortcuts": [
    {
      "Description": "Description of what shortcuts do",
      "Keys": ["Add shortcut keys that execute the command"]
    }
  ]
}`}
                  </pre>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#666', 
                    marginTop: '0.75rem',
                    fontStyle: 'italic'
                  }}>
                    The shortcuts are read every time the app is launched.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Media */}
          <div className="about-media" style={{ 
            position: 'sticky', 
            top: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              background: '#fff', 
              padding: '2rem', 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(44,39,33,0.1)',
              border: '1px solid #e5e1d8',
              width: '100%',
              maxWidth: '500px'
            }}>
              <img 
                src="/images/poster.png" 
                alt="KeyWizard Poster" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 