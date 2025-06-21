import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/profession-selection-landing');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-white"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        {/* 404 Icon */}
        <div className="mb-6">
          <Icon name="AlertTriangle" size={64} className="text-warning mx-auto mb-4" />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Page Not Found</h2>
          <p className="text-text-secondary leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to discovering your retirement benefits.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoHome}
          className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-primary-700 transition-colors duration-200"
        >
          <Icon name="Home" size={20} />
          <span>Return to Home</span>
        </button>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-text-muted">
            Need help? Contact our support team for assistance with your retirement planning journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;