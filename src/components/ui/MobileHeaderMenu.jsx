import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const MobileHeaderMenu = ({ 
  showBackButton = false,
  onBackClick,
  showProgress = false,
  currentStep,
  totalSteps,
  stepLabel,
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, signOut, userProfile } = useAuth();
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/'); // Always redirect to landing page after logout
    setIsMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const progressPercentage = showProgress && currentStep && totalSteps 
    ? (currentStep / totalSteps) * 100 
    : 0;

  return (
    <>
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={`md:hidden p-2 rounded-md hover:bg-primary-50 transition-colors duration-150 ${className}`}
        aria-label="Open navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className="flex flex-col space-y-1">
          <div className="w-6 h-0.5 bg-primary"></div>
          <div className="w-6 h-0.5 bg-primary"></div>
          <div className="w-6 h-0.5 bg-primary"></div>
        </div>
      </button>

      {/* Mobile Side Panel Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          style={{ marginLeft: 0, marginRight: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-surface border-l border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/logo.png"
                alt="GapGuardian Logo"
                className="w-8 h-8 object-contain"
              />
              <div>
                <div className="font-semibold text-sm text-primary">
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-primary-50 transition-colors duration-150"
              aria-label="Close navigation menu"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="relative w-4 h-4">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-text-secondary transform rotate-45 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-text-secondary transform -rotate-45 -translate-y-1/2"></div>
                </div>
              </div>
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Profile Section */}
            {userProfile && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      {userProfile?.full_name || userProfile?.email || 'User'}
                    </div>
                    {isAdmin() && (
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary text-xs font-medium rounded mt-1">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="py-2">

              {/* Navigation for Public Users */}
              {!userProfile && (
                <>
                  <button
                    onClick={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                  >
                    <Icon name="Home" size={20} className="text-primary" />
                    <span className="text-sm font-medium text-text-primary">Home</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                  >
                    <Icon name="LogIn" size={20} className="text-primary" />
                    <span className="text-sm font-medium text-text-primary">Login / Full Version</span>
                  </button>
                </>
              )}

              {/* Dashboard Link for Authenticated Users */}
              {userProfile && (
                <button
                  onClick={handleDashboard}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                >
                  <Icon name="LayoutDashboard" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Dashboard</span>
                </button>
              )}

              {/* Public Pages - Always Available */}
              <div className="border-t border-border mt-2 pt-2">
                <div className="px-4 py-2">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Information
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate('/privacy');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                >
                  <Icon name="Shield" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Privacy Policy</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/terms');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                >
                  <Icon name="FileText" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Terms of Service</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/disclosures');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                >
                  <Icon name="Info" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Disclosures</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150"
                >
                  <Icon name="Mail" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Contact Us</span>
                </button>
              </div>

              {/* Progress Information for Mobile */}
              {showProgress && currentStep && totalSteps && (
                <div className="px-4 py-3 border-t border-border">
                  <div className="text-xs font-medium text-text-secondary mb-2">
                    Progress: Step {currentStep} of {totalSteps}
                  </div>
                  {stepLabel && (
                    <div className="text-sm font-medium text-primary mb-2">
                      {stepLabel}
                    </div>
                  )}
                  <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel Footer */}
          {userProfile && (
            <div className="border-t border-border p-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-error-50 transition-colors duration-150 rounded-md"
              >
                <Icon name="LogOut" size={20} className="text-error" />
                <span className="text-sm font-medium text-error">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileHeaderMenu;
