import { useAuth } from "../contexts/AuthContext";
import {
  hasRole,
  isAdmin,
  isPremium,
  isBasicUser,
  ROLES,
} from "../utils/roles";

/**
 * Custom hook for role-based access control
 * @returns {Object} Role utilities and checks
 */
export const useRole = () => {
  const { user, userRole, loading } = useAuth();

  const currentRole = userRole || ROLES.USER;

  return {
    // Current user role
    role: currentRole,

    // Loading state
    loading,

    // Role checks
    hasRole: (requiredRole) => hasRole(currentRole, requiredRole),
    isAdmin: () => isAdmin(currentRole),
    isPremium: () => isPremium(currentRole),
    isBasicUser: () => isBasicUser(currentRole),

    // Specific permission checks
    canAccessPremiumFeatures: () => isPremium(currentRole),
    canAccessAdminPanel: () => isAdmin(currentRole),
    canManageUsers: () => isAdmin(currentRole),
    canViewFullReports: () => isPremium(currentRole),
    canAccessGapCalculator: () => isPremium(currentRole),

    // User info
    isAuthenticated: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userProfile: { role: currentRole }, // Backward compatibility
  };
};
