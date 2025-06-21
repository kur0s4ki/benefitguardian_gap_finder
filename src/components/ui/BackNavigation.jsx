import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BackNavigation = ({ 
  onBack, 
  preserveData = true, 
  customLabel,
  className = "",
  variant = "default" // "default", "minimal", "inline"
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { step: 1, path: '/profession-selection-landing', label: 'Profession Selection' },
    { step: 2, path: '/service-profile-collection', label: 'Service Profile' },
    { step: 3, path: '/risk-assessment-questionnaire', label: 'Risk Assessment' },
    { step: 4, path: '/dynamic-results-dashboard', label: 'Results Dashboard' },
    { step: 5, path: '/gap-calculator-tool', label: 'Gap Calculator' },
    { step: 6, path: '/report-delivery-confirmation', label: 'Report Delivery' }
  ];

  const currentStepData = steps.find(step => step.path === location.pathname);
  const canNavigateBack = currentStepData && currentStepData.step > 1;

  const handleBackClick = () => {
    if (!canNavigateBack) return;

    // Preserve form data if needed
    if (preserveData) {
      const currentFormData = sessionStorage.getItem('formData');
      if (currentFormData) {
        sessionStorage.setItem('preservedFormData', currentFormData);
      }
    }

    // Custom back handler
    if (onBack && typeof onBack === 'function') {
      onBack();
      return;
    }

    // Default navigation
    const previousStep = steps.find(step => step.step === currentStepData.step - 1);
    if (previousStep) {
      navigate(previousStep.path);
    }
  };

  if (!canNavigateBack) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'p-2 rounded-full hover:bg-primary-50';
      case 'inline':
        return 'inline-flex items-center text-sm hover:text-primary-700';
      default:
        return 'flex items-center gap-2 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors duration-150';
    }
  };

  const getLabel = () => {
    if (customLabel) return customLabel;
    if (variant === 'minimal') return '';
    
    const previousStep = steps.find(step => step.step === currentStepData.step - 1);
    return variant === 'inline' 
      ? `Back to ${previousStep?.label || 'Previous Step'}`
      : 'Back';
  };

  return (
    <button
      onClick={handleBackClick}
      className={`back-button ${getVariantClasses()} ${className}`}
      aria-label={`Go back to ${steps.find(step => step.step === currentStepData.step - 1)?.label || 'previous step'}`}
    >
      <Icon 
        name="ChevronLeft" 
        size={variant === 'minimal' ? 20 : 18} 
        className="text-primary flex-shrink-0" 
      />
      {getLabel() && (
        <span className="font-medium text-primary">
          {getLabel()}
        </span>
      )}
    </button>
  );
};

export default BackNavigation;