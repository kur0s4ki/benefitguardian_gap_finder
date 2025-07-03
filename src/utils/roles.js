/**
 * Role management utilities
 */

// Define available roles
export const ROLES = {
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin'
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.PREMIUM]: 2,
  [ROLES.ADMIN]: 3
};

/**
 * Check if a user has a specific role
 * @param {string} userRole - The user's current role
 * @param {string} requiredRole - The required role
 * @returns {boolean} - True if user has the required role or higher
 */
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Check if a user has admin privileges
 * @param {string} userRole - The user's current role
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

/**
 * Check if a user has premium privileges
 * @param {string} userRole - The user's current role
 * @returns {boolean} - True if user is premium or admin
 */
export const isPremium = (userRole) => {
  return hasRole(userRole, ROLES.PREMIUM);
};

/**
 * Check if a user is a basic user
 * @param {string} userRole - The user's current role
 * @returns {boolean} - True if user is basic user
 */
export const isBasicUser = (userRole) => {
  return userRole === ROLES.USER;
};

/**
 * Get role display name
 * @param {string} role - The role
 * @returns {string} - Display name for the role
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.USER]: 'User',
    [ROLES.PREMIUM]: 'Premium',
    [ROLES.ADMIN]: 'Administrator'
  };
  return displayNames[role] || 'Unknown';
};

/**
 * Get role description
 * @param {string} role - The role
 * @returns {string} - Description of the role
 */
export const getRoleDescription = (role) => {
  const descriptions = {
    [ROLES.USER]: 'Basic access to public features',
    [ROLES.PREMIUM]: 'Full access to all calculator features and reports',
    [ROLES.ADMIN]: 'Full system access including user management'
  };
  return descriptions[role] || 'Unknown role';
};

/**
 * Get available roles for selection
 * @returns {Array} - Array of role objects with value, label, and description
 */
export const getAvailableRoles = () => {
  return Object.values(ROLES).map(role => ({
    value: role,
    label: getRoleDisplayName(role),
    description: getRoleDescription(role)
  }));
};
