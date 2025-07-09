import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRole } from "../../hooks/useRole";
import { useToast } from "./ToastProvider";
import Icon from "../AppIcon";

const ProgressHeader = ({
  currentStep = 1,
  totalSteps = 6,
  profession = "teacher",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isPublic } = useAuth();
  const { isAdmin } = useRole();
  const { addToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowManagementDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    navigate("/login");
    setIsLoggingOut(false);
  };

  const handleManagementClick = () => {
    console.log("🔧 Management dropdown clicked");
    console.log("👤 Current user:", user?.email);
    console.log("🔑 isAdmin():", isAdmin());
    setShowManagementDropdown(!showManagementDropdown);
  };

  const handleUserManagement = () => {
    console.log("🏢 Navigating to User Management");
    setShowManagementDropdown(false);
    navigate("/user-management");
  };

  const handleMyProfile = () => {
    console.log("👤 Navigating to My Profile");
    setShowManagementDropdown(false);
    navigate("/manage-my-profile");
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
              <img
                src="/assets/images/logo.png"
                alt="PublicServ Wealth Group Logo"
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
              />
              <div className="hidden sm:block">
                <div
                  className={`font-semibold text-lg ${getProfessionTheme()}`}
                >
                  PublicServ Wealth Group
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Gap Finder
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
                <span className="hidden md:inline text-sm font-medium">
                  Back
                </span>
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

            {/* Authentication Section */}
            {user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                {/* Management Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleManagementClick}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-primary-50 text-primary hover:text-primary-700 transition-colors duration-150"
                    aria-label="Management Options"
                  >
                    <Icon name="Settings" size={14} />
                    <span className="text-xs font-medium hidden lg:inline">
                      Management
                    </span>
                    <Icon
                      name="ChevronDown"
                      size={12}
                      className={`transition-transform duration-200 ${
                        showManagementDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showManagementDropdown && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {isAdmin() ? (
                          <button
                            onClick={handleUserManagement}
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary-50 transition-colors duration-150 flex items-center gap-2"
                          >
                            <Icon name="Users" size={14} />
                            User Management
                          </button>
                        ) : (
                          <button
                            onClick={handleMyProfile}
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary-50 transition-colors duration-150 flex items-center gap-2"
                          >
                            <Icon name="User" size={14} />
                            Manage My Profile
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-error-50 text-error hover:text-error-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Sign out"
                >
                  {isLoggingOut ? (
                    <div className="w-3 h-3 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Icon name="LogOut" size={14} />
                  )}
                  <span className="text-xs font-medium hidden xl:inline">
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </span>
                </button>
              </div>
            ) : (
              isPublic && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                  <div className="flex items-center gap-1 px-2 py-1 bg-warning-50 border border-warning-200 rounded-md">
                    <Icon name="Eye" size={12} className="text-warning-600" />
                    <span className="text-xs font-medium text-warning-700">
                      Public
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-primary text-white hover:bg-primary-700 transition-colors duration-150"
                    aria-label="Sign in for full access"
                  >
                    <Icon name="LogIn" size={14} />
                    <span className="text-xs font-medium hidden xl:inline">
                      Sign In
                    </span>
                  </button>
                </div>
              )
            )}
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
                    ? "bg-primary"
                    : "bg-primary-100"
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
