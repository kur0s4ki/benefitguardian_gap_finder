import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const AccessSelectionModal = ({ 
  isOpen, 
  onClose, 
  onSelectPublic,
  onSelectAuthenticated,
  showCloseButton = false 
}) => {
  const navigate = useNavigate();

  const handleAuthenticatedClick = () => {
    if (onSelectAuthenticated) {
      onSelectAuthenticated();
    } else {
      // Default behavior - navigate to login
      navigate('/login', {
        state: { 
          from: { pathname: window.location.pathname },
          returnAfterLogin: true
        }
      });
    }
  };

  const handlePublicClick = () => {
    if (onSelectPublic) {
      onSelectPublic();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={showCloseButton ? onClose : undefined}
          className="absolute inset-0 bg-text-primary/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-xl shadow-modal max-w-lg w-full p-6 sm:p-8"
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <Icon name="X" size={20} className="text-text-secondary" />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Choose Your Access Level
            </h2>
            <p className="text-text-secondary max-w-sm mx-auto">
              Select how you'd like to proceed with your retirement gap analysis
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Full Access Option */}
            <button
              onClick={handleAuthenticatedClick}
              className="w-full p-6 rounded-lg border-2 border-primary bg-primary-50 hover:bg-primary-100 transition-all duration-200 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon name="Unlock" size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-text-primary mb-1">
                    Access Full Version
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Sign in to unlock complete analysis and personalized recommendations
                  </p>
                  <ul className="space-y-1 text-sm text-primary-700">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-primary" />
                      <span>Complete pension gap calculations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-primary" />
                      <span>Personalized recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-primary" />
                      <span>Save and compare scenarios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-primary" />
                      <span>Detailed financial projections</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Public Access Option */}
            <button
              onClick={handlePublicClick}
              className="w-full p-6 rounded-lg border-2 border-border hover:border-warning-300 bg-white hover:bg-warning-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon name="Eye" size={24} className="text-warning-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-text-primary mb-1">
                    Continue with Public Version
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Proceed without signing in for a basic overview
                  </p>
                  <ul className="space-y-1 text-sm text-text-muted">
                    <li className="flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-warning-500" />
                      <span>Limited gap analysis (percentages only)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-warning-500" />
                      <span>General recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-warning-500" />
                      <span>No scenario saving</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-warning-500" />
                      <span>Basic projections only</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-text-muted">
              <Icon name="Shield" size={12} className="inline mr-1" />
              Your data is secure and never shared without your permission
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AccessSelectionModal; 