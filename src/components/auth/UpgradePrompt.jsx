import React from 'react';
import { useRole } from '../../hooks/useRole';
import { getRoleDisplayName, ROLES } from '../../utils/roles';

/**
 * UpgradePrompt component to encourage users to upgrade their access level
 * @param {Object} props
 * @param {string} props.requiredRole - The role required for the feature
 * @param {string} props.featureName - Name of the feature being restricted
 * @param {React.ReactNode} props.children - Custom content (optional)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactNode}
 */
const UpgradePrompt = ({ 
  requiredRole = ROLES.PREMIUM, 
  featureName = "this feature",
  children,
  className = ""
}) => {
  const { role, isAuthenticated } = useRole();

  // Don't show if user already has required role or higher
  if (!isAuthenticated || !requiredRole) {
    return null;
  }

  const requiredRoleDisplay = getRoleDisplayName(requiredRole);
  const currentRoleDisplay = getRoleDisplayName(role);

  if (children) {
    return (
      <div className={`bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">
            Upgrade to Access {featureName}
          </h3>
          
          <p className="text-primary-700 mb-4">
            You currently have <span className="font-medium">{currentRoleDisplay}</span> access. 
            To use {featureName}, you need <span className="font-medium">{requiredRoleDisplay}</span> access.
          </p>
          
          <div className="space-y-3">
            {requiredRole === ROLES.PREMIUM && (
              <div className="bg-white rounded-lg p-4 border border-primary-100">
                <h4 className="font-medium text-primary-800 mb-2">Premium Benefits:</h4>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full access to gap calculator tool
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Detailed financial reports and projections
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority support and consultation scheduling
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced risk assessment tools
                  </li>
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn btn-primary flex-1">
                Upgrade to {requiredRoleDisplay}
              </button>
              <button className="btn btn-outline flex-1">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
