import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const PublicVersionBanner = ({ 
  className = "",
  showOnlyWhenPublic = true,
  variant = "sticky" // "sticky", "inline"
}) => {
  const { isPublic } = useAuth();
  const navigate = useNavigate();

  // Only show for public users if showOnlyWhenPublic is true
  if (showOnlyWhenPublic && !isPublic) {
    return null;
  }

  const handleLoginClick = () => {
    navigate('/login');
  };

  const baseClasses = variant === "sticky" 
    ? "fixed top-0 left-0 right-0 z-50 bg-warning-600 border-b border-warning-700 shadow-sm"
    : "bg-warning-600 border border-warning-700 rounded-lg";

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Icon 
              name="AlertTriangle" 
              size={16} 
              className="text-warning-100 flex-shrink-0" 
            />
            <p className="text-sm text-white font-medium">
              You are using the limited public version. Log in for full experience and complete results.
            </p>
          </div>
          <button
            onClick={handleLoginClick}
            className="px-4 py-2 bg-white text-warning-600 rounded-md hover:bg-warning-50 transition-colors duration-150 text-sm font-semibold whitespace-nowrap"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicVersionBanner;
