import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./ToastProvider";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../AppIcon";

const ProgressHeader = ({
  currentStep = 1,
  totalSteps = 6,
  profession = "teacher",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { isAdmin, signOut, userProfile } = useAuth();

  const steps = [
    {
      step: 1,
      label: "Select Profession",
      path: "/profession-selection-landing",
      shortLabel: "Profession",
    },
    {
      step: 2,
      label: "Service Profile",
      path: "/service-profile-collection",
      shortLabel: "Profile",
    },
    {
      step: 3,
      label: "Risk Assessment",
      path: "/risk-assessment-questionnaire",
      shortLabel: "Assessment",
    },
    {
      step: 4,
      label: "Results Dashboard",
      path: "/dynamic-results-dashboard",
      shortLabel: "Results",
    },
    {
      step: 5,
      label: "Gap Calculator",
      path: "/gap-calculator-tool",
      shortLabel: "Calculator",
    },
    {
      step: 6,
      label: "Report Delivery",
      path: "/report-delivery-confirmation",
      shortLabel: "Report",
    },
  ];

  const currentStepData =
    steps.find((step) => step.path === location.pathname) || steps[0];
  const progressPercentage = (currentStepData.step / totalSteps) * 100;

  // Check if we're on a management page (not part of the main flow)
  const isManagementPage = ["/user-management", "/manage-my-profile"].includes(
    location.pathname
  );
  const shouldShowProgress = !isManagementPage;

  const handleLogoClick = () => {
    navigate("/profession-selection-landing");
  };

  const canNavigateBack = currentStepData.step > 1;

  const handleBackClick = () => {
    if (canNavigateBack) {
      const previousStep = steps.find(
        (step) => step.step === currentStepData.step - 1
      );
      if (previousStep) {
        navigate(previousStep.path);
      }
    }
  };





  const getProfessionTheme = () => {
    const themes = {
      teacher: "text-primary",
      nurse: "text-primary",
      "first-responder": "text-primary",
      "government-employee": "text-primary",
    };
    return themes[profession] || "text-primary";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
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
              aria-label="GapGuardian Gold Standard™️ Analysis - Return to start"
            >
              <img
                src="/assets/images/logo.png"
                alt="GapGuardian Gold Standard™️ Analysis Logo"
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
              />
              <div className="hidden sm:block">
                <div
                  className={`font-semibold text-lg ${getProfessionTheme()}`}
                >
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Back Navigation */}
            {canNavigateBack && shouldShowProgress && (
              <button
                onClick={handleBackClick}
                className="back-button px-3 py-2 rounded-md hover:bg-primary-50 transition-colors duration-150"
                aria-label="Go back to previous step"
              >
                <Icon name="ChevronLeft" size={20} className="text-primary" />
                <span className="hidden md:inline text-sm font-medium">
                  Back
                </span>
              </button>
            )}

            {/* Progress Indicator - Mobile */}
            {shouldShowProgress && (
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
            )}

            {/* Progress Indicator - Desktop */}
            {shouldShowProgress && (
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
            )}

            {/* Admin Controls */}
            {isAdmin() && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDashboard}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
                >
                  <Icon name="LayoutDashboard" size={16} />
                  <span className="hidden lg:inline">Dashboard</span>
                </button>

                <div className="hidden md:flex items-center space-x-2 text-sm text-text-secondary">
                  <span>{userProfile?.full_name || 'Admin'}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary text-xs font-medium rounded">
                    Admin
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-text-secondary hover:bg-secondary-50 rounded-md transition-colors duration-150"
                >
                  <Icon name="LogOut" size={16} />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      {shouldShowProgress && (
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
                      ? "bg-primary"
                      : "bg-primary-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ProgressHeader;
