import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const PublicAccessModal = ({ 
  isOpen, 
  onClose, 
  feature = "this feature",
  title = "Sign In Required",
  description = "This feature is available to logged-in users only.",
  showCloseButton = true 
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login', {
      state: { 
        from: { pathname: window.location.pathname },
        returnAfterLogin: true
      }
    });
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
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-warning-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {title}
            </h2>
            <p className="text-text-secondary max-w-sm mx-auto">
              {description}
            </p>
          </div>

          {/* Feature Access Information */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-warning-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning-800 mb-2">
                  {feature} requires full access
                </h3>
                <p className="text-sm text-warning-700 mb-3">
                  Sign in to unlock complete retirement gap analysis and personalized tools
                </p>
                <ul className="space-y-1 text-sm text-warning-700">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-warning-600" />
                    <span>Complete pension gap calculations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-warning-600" />
                    <span>Interactive calculator tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-warning-600" />
                    <span>Detailed report generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-warning-600" />
                    <span>Save and compare scenarios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full p-4 rounded-lg border-2 border-primary bg-primary text-white hover:bg-primary-700 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3">
                <Icon name="LogIn" size={20} className="text-white" />
                <div className="text-left">
                  <div className="font-semibold">Sign In for Full Access</div>
                  <div className="text-sm text-primary-100">
                    Access all tools and features
                  </div>
                </div>
              </div>
            </button>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-full p-3 rounded-lg border border-border text-text-secondary hover:bg-gray-50 transition-colors duration-200"
              >
                Continue with Limited View
              </button>
            )}
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

export default PublicAccessModal; 