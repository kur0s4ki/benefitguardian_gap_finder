import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../AppIcon";
import MobileHeaderMenu from "./MobileHeaderMenu";

const StaticPageHeader = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleLogoClick = () => {
    // If logged in, go to first step; if not logged in, go to landing page
    if (userProfile) {
      navigate("/profession-selection-landing");
    } else {
      navigate("/");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
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
                <div className="font-semibold text-lg text-primary">
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
              {/* Mobile Title */}
              <div className="block md:hidden">
                <div className="font-semibold text-base text-primary">
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Back Button */}
            <button
              onClick={handleBackClick}
              className="hidden md:flex items-center gap-1 px-3 py-2 rounded-md hover:bg-primary-50 transition-colors duration-150"
              aria-label="Go back to previous page"
            >
              <Icon name="ChevronLeft" size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                Back
              </span>
            </button>

            {/* Mobile Menu */}
            <MobileHeaderMenu
              showBackButton={true}
              onBackClick={handleBackClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaticPageHeader;
