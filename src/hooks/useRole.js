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
  const { user, userProfile, loading } = useAuth();

  const userRole = userProfile?.role || ROLES.USER;

  // Debug logging
  console.log("🔍 useRole Debug:");
  console.log("  - user:", user?.email);
  console.log("  - userProfile:", userProfile);
  console.log("  - userRole:", userRole);
  console.log("  - loading:", loading);

  return {
    // Current user role
    role: userRole,

    // Loading state
    loading,

    // Role checks
    hasRole: (requiredRole) => hasRole(userRole, requiredRole),
    isAdmin: () => {
      const result = isAdmin(userRole);
      console.log(
        "🔑 isAdmin() called - userRole:",
        userRole,
        "result:",
        result
      );
      return result;
    },
    isPremium: () => isPremium(userRole),
    isBasicUser: () => isBasicUser(userRole),

    // Specific permission checks
    canAccessPremiumFeatures: () => isPremium(userRole),
    canAccessAdminPanel: () => isAdmin(userRole),
    canManageUsers: () => isAdmin(userRole),
    canViewFullReports: () => isPremium(userRole),
    canAccessGapCalculator: () => isPremium(userRole),

    // User info
    isAuthenticated: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userProfile,
  };
};
