import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function Login() {
  const { login } = useAuth();

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to Packages
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Welcome to KeyWizard</h1>
          <p>Sign in to create and manage your keyboard shortcut packages</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <button onClick={login} className="btn" style={{ width: '100%', fontSize: '1.1rem' }}>
            <LogIn size={20} style={{ marginRight: '0.5rem' }} />
            Sign in with Google
          </button>
        </div>

        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          <p>By signing in, you agree to our terms of service and privacy policy.</p>
          <p>You'll be able to:</p>
          <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
            <li>Create and share keyboard shortcut packages</li>
            <li>Edit and manage your own packages</li>
            <li>See real-time updates from other users</li>
            <li>Build your profile and reputation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login; 