import React from 'react';
import { useRole } from '../../hooks/useRole';
import { useToast } from '../ui/ToastProvider';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * RoleGuard component for role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if access is granted
 * @param {string} props.requiredRole - Required role for access
 * @param {React.ReactNode} props.fallback - Content to render if access is denied
 * @param {boolean} props.showToast - Whether to show a toast message on access denial
 * @param {string} props.toastMessage - Custom toast message
 * @param {boolean} props.requireAuth - Whether authentication is required
 * @returns {React.ReactNode}
 */
const RoleGuard = ({ 
  children, 
  requiredRole,
  fallback = null, 
  showToast = false,
  toastMessage = 'You do not have permission to access this feature',
  requireAuth = true
}) => {
  const { hasRole, loading, isAuthenticated } = useRole();
  const { addToast } = useToast();

  // Show loading spinner while checking authentication and role
  if (loading) {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  // Check authentication if required
  if (requireAuth && !isAuthenticated) {
    if (showToast) {
      addToast('Please sign in to access this feature', 'warning');
    }
    
    return fallback || (
      <div className="text-center py-8">
        <p className="text-text-secondary">
          Please sign in to access this feature.
        </p>
      </div>
    );
  }

  // Check role if specified
  if (requiredRole && !hasRole(requiredRole)) {
    if (showToast) {
      addToast(toastMessage, 'warning');
    }
    
    return fallback || (
      <div className="text-center py-8">
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-warning-100 rounded-full">
            <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-warning-800 mb-2">
            Access Restricted
          </h3>
          <p className="text-warning-700">
            {toastMessage}
          </p>
        </div>
      </div>
    );
  }

  // Access granted, render children
  return children;
};

export default RoleGuard;
