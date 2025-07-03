import { 
  hasRole, 
  isAdmin, 
  isPremium, 
  isBasicUser, 
  getRoleDisplayName, 
  getRoleDescription,
  getAvailableRoles,
  ROLES 
} from '../roles';

describe('Role Management Utilities', () => {
  describe('hasRole', () => {
    test('should return true when user has exact required role', () => {
      expect(hasRole(ROLES.USER, ROLES.USER)).toBe(true);
      expect(hasRole(ROLES.PREMIUM, ROLES.PREMIUM)).toBe(true);
      expect(hasRole(ROLES.ADMIN, ROLES.ADMIN)).toBe(true);
    });

    test('should return true when user has higher role than required', () => {
      expect(hasRole(ROLES.PREMIUM, ROLES.USER)).toBe(true);
      expect(hasRole(ROLES.ADMIN, ROLES.USER)).toBe(true);
      expect(hasRole(ROLES.ADMIN, ROLES.PREMIUM)).toBe(true);
    });

    test('should return false when user has lower role than required', () => {
      expect(hasRole(ROLES.USER, ROLES.PREMIUM)).toBe(false);
      expect(hasRole(ROLES.USER, ROLES.ADMIN)).toBe(false);
      expect(hasRole(ROLES.PREMIUM, ROLES.ADMIN)).toBe(false);
    });

    test('should return false for invalid roles', () => {
      expect(hasRole(null, ROLES.USER)).toBe(false);
      expect(hasRole(ROLES.USER, null)).toBe(false);
      expect(hasRole('invalid', ROLES.USER)).toBe(false);
      expect(hasRole(ROLES.USER, 'invalid')).toBe(false);
    });
  });

  describe('isAdmin', () => {
    test('should return true only for admin role', () => {
      expect(isAdmin(ROLES.ADMIN)).toBe(true);
      expect(isAdmin(ROLES.PREMIUM)).toBe(false);
      expect(isAdmin(ROLES.USER)).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });
  });

  describe('isPremium', () => {
    test('should return true for premium and admin roles', () => {
      expect(isPremium(ROLES.PREMIUM)).toBe(true);
      expect(isPremium(ROLES.ADMIN)).toBe(true);
      expect(isPremium(ROLES.USER)).toBe(false);
      expect(isPremium(null)).toBe(false);
    });
  });

  describe('isBasicUser', () => {
    test('should return true only for basic user role', () => {
      expect(isBasicUser(ROLES.USER)).toBe(true);
      expect(isBasicUser(ROLES.PREMIUM)).toBe(false);
      expect(isBasicUser(ROLES.ADMIN)).toBe(false);
      expect(isBasicUser(null)).toBe(false);
    });
  });

  describe('getRoleDisplayName', () => {
    test('should return correct display names', () => {
      expect(getRoleDisplayName(ROLES.USER)).toBe('User');
      expect(getRoleDisplayName(ROLES.PREMIUM)).toBe('Premium');
      expect(getRoleDisplayName(ROLES.ADMIN)).toBe('Administrator');
      expect(getRoleDisplayName('invalid')).toBe('Unknown');
    });
  });

  describe('getRoleDescription', () => {
    test('should return correct descriptions', () => {
      expect(getRoleDescription(ROLES.USER)).toBe('Basic access to public features');
      expect(getRoleDescription(ROLES.PREMIUM)).toBe('Full access to all calculator features and reports');
      expect(getRoleDescription(ROLES.ADMIN)).toBe('Full system access including user management');
      expect(getRoleDescription('invalid')).toBe('Unknown role');
    });
  });

  describe('getAvailableRoles', () => {
    test('should return array of role objects', () => {
      const roles = getAvailableRoles();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles).toHaveLength(3);
      
      const userRole = roles.find(r => r.value === ROLES.USER);
      expect(userRole).toEqual({
        value: ROLES.USER,
        label: 'User',
        description: 'Basic access to public features'
      });
    });
  });
});
