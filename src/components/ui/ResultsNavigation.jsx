import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const ResultsNavigation = ({ 
  className = "",
  variant = "button", // "button", "link", "card"
  showIcon = true,
  customLabel
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on post-results screens
  const showOnPaths = ['/gap-calculator-tool', '/report-delivery-confirmation'];
  const shouldShow = showOnPaths.includes(location.pathname);

  const handleResultsClick = () => {
    // Try to get stored results data from localStorage or sessionStorage
    try {
      const storedResults = localStorage.getItem('calculatedResults');
      const storedUserData = localStorage.getItem('userData');

      if (storedResults && storedUserData) {
        navigate('/dynamic-results-dashboard', {
          state: {
            calculatedResults: JSON.parse(storedResults),
            userData: JSON.parse(storedUserData)
          }
        });
      } else {
        // If no stored data, redirect to start assessment
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading stored results:', error);
      navigate('/');
    }
  };

  if (!shouldShow) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'link':
        return 'navigation-link inline-flex items-center gap-2 text-sm font-medium hover:underline';
      case 'card':
        return 'card p-4 hover:shadow-modal transition-shadow duration-200 cursor-pointer';
      default:
        return 'btn-primary px-4 py-2 rounded-md font-medium inline-flex items-center gap-2 hover:bg-primary-700 transition-colors duration-150';
    }
  };

  const label = customLabel || 'View Results Dashboard';

  if (variant === 'card') {
    return (
      <div
        onClick={handleResultsClick}
        className={`${getVariantClasses()} ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleResultsClick();
          }
        }}
        aria-label="Return to results dashboard"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Results Dashboard
            </h3>
            <p className="text-sm text-text-secondary">
              Review your personalized retirement analysis
            </p>
          </div>
          {showIcon && (
            <Icon 
              name="BarChart3" 
              size={24} 
              className="text-primary flex-shrink-0" 
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleResultsClick}
      className={`${getVariantClasses()} ${className}`}
      aria-label="Return to results dashboard"
    >
      {showIcon && (
        <Icon 
          name="BarChart3" 
          size={18} 
          className="flex-shrink-0" 
        />
      )}
      <span>{label}</span>
    </button>
  );
};

export default ResultsNavigation;