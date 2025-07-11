import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function Toast({ message, type = 'success' }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <XCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4ade80';
      case 'error':
        return '#f87171';
      case 'warning':
        return '#fbbf24';
      default:
        return '#4ade80';
    }
  };

  return (
    <div 
      className="toast"
      style={{ 
        backgroundColor: getBackgroundColor(),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  );
}

export default Toast; 