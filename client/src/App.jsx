import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import PackageList from './components/PackageList';
import PackageDetail from './components/PackageDetail';
import CreatePackage from './components/CreatePackage';
import Login from './components/Login';
import Profile from './components/Profile';
import About from './components/About';
import Toast from './components/Toast';

// Socket connection
const socket = io();

function AppContent() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user, loading: authLoading } = useAuth();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages', {
        credentials: 'include'
      });
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      showToast('Failed to load packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Real-time socket event handlers
  useEffect(() => {
    if (!authLoading) {
      fetchPackages();
    }
  }, [authLoading]);

  useEffect(() => {
    // Listen for real-time updates
    socket.on('packageAdded', (newPackage) => {
      setPackages(prev => [newPackage, ...prev]);
      showToast('New package added!', 'success');
    });

    socket.on('packageUpdated', (updatedPackage) => {
      setPackages(prev => 
        prev.map(pkg => pkg.id === updatedPackage.id ? updatedPackage : pkg)
      );
      showToast('Package updated!', 'success');
    });

    socket.on('packageDeleted', ({ id }) => {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      showToast('Package deleted!', 'success');
    });

    return () => {
      socket.off('packageAdded');
      socket.off('packageUpdated');
      socket.off('packageDeleted');
    };
  }, []);

  // Create new package
  const createPackage = async (packageData) => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        throw new Error('Failed to create package');
      }

      showToast('Package created successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error creating package:', error);
      showToast('Failed to create package', 'error');
      return false;
    }
  };

  // Update package
  const updatePackage = async (id, packageData) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        throw new Error('Failed to update package');
      }

      showToast('Package updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating package:', error);
      showToast('Failed to update package', 'error');
      return false;
    }
  };

  // Delete package
  const deletePackage = async (id) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete package');
      }

      showToast('Package deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting package:', error);
      showToast('Failed to delete package', 'error');
      return false;
    }
  };

  if (authLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* <Header /> */}
      <main className="container">
        <Routes>
          <Route 
            path="/" 
            element={
              <PackageList 
                packages={packages} 
                loading={loading}
                onDelete={deletePackage}
              />
            } 
          />
          <Route 
            path="/package/:id" 
            element={
              <PackageDetail 
                packages={packages}
                onUpdate={updatePackage}
                onDelete={deletePackage}
              />
            } 
          />
          <Route 
            path="/create" 
            element={
              user ? (
                <CreatePackage 
                  onCreate={createPackage}
                />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/profile" 
            element={
              user ? <Profile /> : <Login />
            } 
          />
          <Route 
            path="/about" 
            element={<About />} 
          />
        </Routes>
      </main>
      {toast && <Toast {...toast} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 