import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../AppIcon";
import MobileHeaderMenu from "./MobileHeaderMenu";

const ProgressHeader = ({
  currentStep = 1,
  totalSteps = 6,
  profession = "teacher",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    // If logged in, go to first step; if not logged in, go to landing page
    if (userProfile) {
      navigate("/profession-selection-landing");
    } else {
      navigate("/");
    }
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
    navigate('/'); // Always redirect to landing page after logout
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
              {/* Desktop Title */}
              <div className="hidden md:block">
                <div
                  className={`font-semibold text-lg ${getProfessionTheme()}`}
                >
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
              {/* Mobile Title */}
              <div className="block md:hidden">
                <div className={`font-semibold text-base ${getProfessionTheme()}`}>
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
            {/* Back Navigation - Desktop Only */}
            {canNavigateBack && shouldShowProgress && (
              <button
                onClick={handleBackClick}
                className="hidden md:flex back-button px-3 py-2 rounded-md hover:bg-primary-50 transition-colors duration-150"
                aria-label="Go back to previous step"
              >
                <Icon name="ChevronLeft" size={20} className="text-primary" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* Mobile Menu */}
            <MobileHeaderMenu
              showBackButton={canNavigateBack && shouldShowProgress}
              onBackClick={handleBackClick}
              showProgress={shouldShowProgress}
              currentStep={currentStepData.step}
              totalSteps={totalSteps}
              stepLabel={currentStepData.label}
            />

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

            {/* User Controls - Desktop Only */}
            {userProfile && (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={handleDashboard}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
                >
                  <Icon name="LayoutDashboard" size={16} />
                  <span className="hidden lg:inline">Dashboard</span>
                </button>

                <div className="hidden lg:flex items-center space-x-2 text-sm text-text-secondary">
                  <span>{userProfile?.full_name || userProfile?.email || 'User'}</span>
                  {isAdmin() && (
                    <span className="px-2 py-1 bg-primary-100 text-primary text-xs font-medium rounded">
                      Admin
                    </span>
                  )}
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


    </header>
  );
};

export default ProgressHeader;
