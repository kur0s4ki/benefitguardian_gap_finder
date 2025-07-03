# Role Management System

This document describes the role-based access control (RBAC) system implemented in the BenefitGuardian Gap Finder application.

## Overview

The role management system provides three levels of access:

- **User** (Basic): Default role for new users with access to public features
- **Premium**: Enhanced access with full calculator features and detailed reports
- **Admin**: Full system access including user management capabilities

## Database Schema

### User Profiles Table

```sql
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Role Enum

```sql
CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin');
```

## Components

### Core Files

- `src/utils/roles.js` - Role constants and utility functions
- `src/hooks/useRole.js` - Custom hook for role-based access control
- `src/components/auth/RoleGuard.jsx` - Component for protecting content based on roles
- `src/components/auth/UpgradePrompt.jsx` - Component for encouraging role upgrades
- `src/components/admin/UserManagement.jsx` - Admin interface for managing user roles

### Usage Examples

#### Protecting Routes

```jsx
import RoleGuard from 'components/auth/RoleGuard';
import { ROLES } from 'utils/roles';

<Route
  path="/premium-feature"
  element={
    <RoleGuard requiredRole={ROLES.PREMIUM}>
      <PremiumFeature />
    </RoleGuard>
  }
/>
```

#### Using the Role Hook

```jsx
import { useRole } from 'hooks/useRole';

const MyComponent = () => {
  const { isPremium, isAdmin, canAccessPremiumFeatures } = useRole();
  
  return (
    <div>
      {isPremium() && <PremiumContent />}
      {isAdmin() && <AdminPanel />}
      {canAccessPremiumFeatures() && <AdvancedTools />}
    </div>
  );
};
```

#### Conditional Rendering

```jsx
import { useRole } from 'hooks/useRole';
import UpgradePrompt from 'components/auth/UpgradePrompt';
import { ROLES } from 'utils/roles';

const FeatureComponent = () => {
  const { hasRole } = useRole();
  
  if (!hasRole(ROLES.PREMIUM)) {
    return (
      <UpgradePrompt 
        requiredRole={ROLES.PREMIUM}
        featureName="advanced analytics"
      />
    );
  }
  
  return <AdvancedAnalytics />;
};
```

## Role Permissions

### User (Basic)
- Access to public assessment flow
- Basic risk assessment results
- Limited data visibility
- Upgrade prompts for premium features

### Premium
- Full access to gap calculator tool
- Detailed financial reports and projections
- Complete risk assessment data
- Priority support features
- Advanced planning tools

### Admin
- All premium features
- User management interface
- Role assignment capabilities
- System administration access
- Analytics and reporting dashboard

## Security Features

### Row Level Security (RLS)

The system implements RLS policies to ensure data security:

- Users can only view/edit their own profiles
- Admins can view/edit all user profiles
- Role changes are restricted to admin users

### Authentication Integration

- Automatic profile creation on user signup
- Role information fetched with user session
- Seamless integration with Supabase Auth

## Admin Features

### User Management

Admins can access the user management interface at `/admin` to:

- View all registered users
- Change user roles
- Monitor user activity
- Manage system permissions

### Navigation

Admin users see additional navigation options:
- Admin dashboard link in headers
- Quick access to user management
- System administration tools

## Testing

Run the role management tests:

```bash
npm test src/utils/__tests__/roles.test.js
```

## Future Enhancements

- Role-based feature flags
- Subscription management integration
- Advanced permission granularity
- Audit logging for role changes
- Bulk user management operations
