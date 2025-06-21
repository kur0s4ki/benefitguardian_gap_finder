import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const ProgressHeader = ({ currentStep = 1, totalSteps = 6, profession = 'teacher' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { step: 1, label: 'Select Profession', path: '/profession-selection-landing', shortLabel: 'Profession' },
    { step: 2, label: 'Service Profile', path: '/service-profile-collection', shortLabel: 'Profile' },
    { step: 3, label: 'Risk Assessment', path: '/risk-assessment-questionnaire', shortLabel: 'Assessment' },
    { step: 4, label: 'Results Dashboard', path: '/dynamic-results-dashboard', shortLabel: 'Results' },
    { step: 5, label: 'Gap Calculator', path: '/gap-calculator-tool', shortLabel: 'Calculator' },
    { step: 6, label: 'Report Delivery', path: '/report-delivery-confirmation', shortLabel: 'Report' }
  ];

  const currentStepData = steps.find(step => step.path === location.pathname) || steps[0];
  const progressPercentage = (currentStepData.step / totalSteps) * 100;

  const handleLogoClick = () => {
    navigate('/profession-selection-landing');
  };

  const canNavigateBack = currentStepData.step > 1;

  const handleBackClick = () => {
    if (canNavigateBack) {
      const previousStep = steps.find(step => step.step === currentStepData.step - 1);
      if (previousStep) {
        navigate(previousStep.path);
      }
    }
  };

  const getProfessionTheme = () => {
    const themes = {
      teacher: 'text-primary',
      nurse: 'text-primary',
      'first-responder': 'text-primary',
      'government-employee': 'text-primary'
    };
    return themes[profession] || 'text-primary';
  };

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-150"
              aria-label="PublicServ Wealth Group - Return to start"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className={`font-semibold text-lg ${getProfessionTheme()}`}>
                  PublicServ
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Wealth Group
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Back Navigation */}
            {canNavigateBack && (
              <button
                onClick={handleBackClick}
                className="back-button px-3 py-2 rounded-md hover:bg-primary-50 transition-colors duration-150"
                aria-label="Go back to previous step"
              >
                <Icon name="ChevronLeft" size={20} className="text-primary" />
                <span className="hidden md:inline text-sm font-medium">Back</span>
              </button>
            )}

            {/* Progress Indicator - Mobile */}
            <div className="flex items-center space-x-3 md:hidden">
              <div className="text-sm font-medium text-text-secondary">
                {currentStepData.step}/{totalSteps}
              </div>
              <div className="w-16 h-2 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Progress Indicator - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-secondary">
                  Step {currentStepData.step} of {totalSteps}:
                </span>
                <span className="text-sm font-semibold text-primary">
                  {currentStepData.label}
                </span>
              </div>
              <div className="w-24 lg:w-32 h-2 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden px-4 pb-3">
        <div className="text-center">
          <div className="text-xs font-medium text-text-secondary mb-1">
            {currentStepData.shortLabel}
          </div>
          <div className="flex justify-center space-x-1">
            {steps.map((step) => (
              <div
                key={step.step}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  step.step <= currentStepData.step
                    ? 'bg-primary' :'bg-primary-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProgressHeader;