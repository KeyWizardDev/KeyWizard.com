import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Package, User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" style={{ fontFamily: 'Inter, Segoe UI, sans-serif', letterSpacing: '-1px', fontWeight: 800 }}>
            <img src="/logo.png" alt="KeyWizard Logo" style={{ width: 36, height: 36, marginRight: 10, borderRadius: 8, background: '#fffdfa', boxShadow: '0 2px 8px rgba(44,39,33,0.10)' }} />
            KeyWizard
          </Link>
          <nav className="nav">
            <Link to="/" className="btn btn-secondary">
              <Home size={16} style={{ marginRight: '0.5rem' }} />
              Browse
            </Link>
            
            {user ? (
              <>
                <Link to="/create" className="btn">
                  <Plus size={16} style={{ marginRight: '0.5rem' }} />
                  Create Package
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%',
                        marginRight: '0.5rem'
                      }}
                    />
                  ) : (
                    <User size={16} style={{ marginRight: '0.5rem' }} />
                  )}
                  {user.username}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn">
                <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header; 