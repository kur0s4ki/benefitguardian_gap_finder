import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRole } from "../../hooks/useRole";
import { useToast } from "./ToastProvider";
import Icon from "../AppIcon";

const StaticPageHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  const { addToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoClick = () => {
    navigate("/profession-selection-landing");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    navigate("/login");
    setIsLoggingOut(false);
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
                <div className="font-semibold text-lg text-primary">
                  PublicServ Wealth Group
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Gap Finder
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-primary-50 transition-colors duration-150"
              aria-label="Go back to previous page"
            >
              <Icon name="ChevronLeft" size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary hidden md:inline">
                Back
              </span>
            </button>

            {/* Authentication Section */}
            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-border">
                <div className="hidden sm:flex items-center gap-2">
                  <Icon name="User" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    {user.email}
                  </span>
                </div>

                {/* Admin Dashboard Link */}
                {isAdmin() && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-primary-50 text-primary hover:text-primary-700 transition-colors duration-150"
                    aria-label="Admin Dashboard"
                  >
                    <Icon name="Settings" size={16} />
                    <span className="text-sm font-medium hidden md:inline">
                      Admin
                    </span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-error-50 text-error hover:text-error-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Sign out"
                >
                  {isLoggingOut ? (
                    <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Icon name="LogOut" size={16} />
                  )}
                  <span className="text-sm font-medium hidden md:inline">
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-border">
                <div className="flex items-center gap-2 px-3 py-1 bg-warning-50 border border-warning-200 rounded-md">
                  <Icon name="Eye" size={14} className="text-warning-600" />
                  <span className="text-xs font-medium text-warning-700">
                    Public View
                  </span>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-white hover:bg-primary-700 transition-colors duration-150"
                  aria-label="Sign in for full access"
                >
                  <Icon name="LogIn" size={16} />
                  <span className="text-sm font-medium hidden md:inline">
                    Sign In
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaticPageHeader;
