import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const PublicAccessBanner = ({ 
  className = "",
  variant = "default", // "default", "minimal", "prominent", "sticky"
  showUpgradeButton = true,
  customMessage
}) => {
  const { isPublic } = useAuth();
  const navigate = useNavigate();

  // Don't show banner for authenticated users
  if (!isPublic) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'p-3 bg-warning-50 border border-warning-200 rounded-md';
      case 'prominent':
        return 'p-6 bg-gradient-to-r from-warning-50 to-accent-50 border-2 border-warning-300 rounded-lg shadow-sm';
      case 'sticky':
        return 'p-3 bg-warning-600 text-white shadow-lg';
      default:
        return 'p-4 bg-warning-50 border border-warning-200 rounded-lg';
    }
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    
    switch (variant) {
      case 'minimal':
        return 'Limited public analysis';
      case 'prominent':
        return 'You\'re using the public calculator with limited features. Sign in to unlock complete retirement gap analysis and personalized recommendations.';
      case 'sticky':
        return 'You are using the limited public version. Log in for full experience and complete results.';
      default:
        return 'You\'re viewing a limited public analysis. Sign in for complete gap analysis and personalized recommendations.';
    }
  };

  const getIconSize = () => {
    return variant === 'prominent' ? 20 : 16;
  };

  const getTextSize = () => {
    switch (variant) {
      case 'minimal':
        return 'text-xs';
      case 'prominent':
        return 'text-sm';
      case 'sticky':
        return 'text-sm';
      default:
        return 'text-sm';
    }
  };

  // For sticky variant, render as a fixed banner
  if (variant === 'sticky') {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 bg-warning-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <Icon 
                name="AlertTriangle" 
                size={16} 
                className="text-warning-100 flex-shrink-0" 
              />
              <p className="text-sm text-white font-medium">
                {getMessage()}
              </p>
            </div>
            
            {showUpgradeButton && (
              <button
                onClick={() => navigate('/login', { state: { from: { pathname: window.location.pathname } } })}
                className="px-4 py-2 bg-white text-warning-600 rounded-md hover:bg-warning-50 transition-colors duration-150 text-sm font-semibold whitespace-nowrap"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon 
            name="Eye" 
            size={getIconSize()} 
            className="text-warning-600 mt-0.5" 
          />
        </div>
        
        <div className="flex-1">
          <p className={`${getTextSize()} text-warning-700 font-medium`}>
            {getMessage()}
          </p>
          
          {variant === 'prominent' && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-warning-600">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full"></span>
                <span>Limited results display</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full"></span>
                <span>No gap calculator access</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full"></span>
                <span>Basic recommendations only</span>
              </div>
            </div>
          )}
        </div>
        
        {showUpgradeButton && (
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: window.location.pathname } } })}
              className={`inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150 ${
                variant === 'minimal' ? 'text-xs' : 'text-sm'
              } font-medium`}
            >
              <Icon name="Unlock" size={14} />
              <span className="hidden sm:inline">
                {variant === 'minimal' ? 'Upgrade' : 'Sign In'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicAccessBanner;
