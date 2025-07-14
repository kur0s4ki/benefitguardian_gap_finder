# Navigation Logic Updates

## Overview
Updated all logout and logo click behaviors throughout the application to follow the correct navigation logic based on user authentication status.

## Navigation Rules Implemented

### 🚪 **Logout Behavior**
**Rule**: Always redirect to landing page after logout
- **Before**: Redirected to `/login`
- **After**: Redirects to `/` (landing page)
- **Rationale**: Landing page provides version selection and better user experience

### 🏠 **Logo/Tool Name Click Behavior**
**Rule**: Smart navigation based on authentication status
- **If Logged In**: Navigate to first step (`/profession-selection-landing`)
- **If Not Logged In**: Navigate to landing page (`/`)
- **Rationale**: Authenticated users want to start assessment, unauthenticated users need version selection

## Components Updated

### 1. **MobileHeaderMenu** (`src/components/ui/MobileHeaderMenu.jsx`)
```jsx
const handleSignOut = async () => {
  await signOut();
  navigate('/'); // Always redirect to landing page after logout
  setIsMobileMenuOpen(false);
};
```

### 2. **ProgressHeader** (`src/components/ui/ProgressHeader.jsx`)
```jsx
const handleLogoClick = () => {
  // If logged in, go to first step; if not logged in, go to landing page
  if (userProfile) {
    navigate("/profession-selection-landing");
  } else {
    navigate("/");
  }
};

const handleSignOut = async () => {
  await signOut();
  navigate('/'); // Always redirect to landing page after logout
};
```

### 3. **StaticPageHeader** (`src/components/ui/StaticPageHeader.jsx`)
```jsx
const handleLogoClick = () => {
  // If logged in, go to first step; if not logged in, go to landing page
  if (userProfile) {
    navigate("/profession-selection-landing");
  } else {
    navigate("/");
  }
};
```

### 4. **Dashboard** (`src/pages/dashboard/index.jsx`)
```jsx
const handleSignOut = async () => {
  await signOut()
  navigate('/') // Always redirect to landing page after logout
}
```

### 5. **PendingApproval** (`src/pages/pending-approval/index.jsx`)
```jsx
const handleSignOut = async () => {
  await signOut()
  navigate('/') // Always redirect to landing page after logout
}
```

### 6. **NotFound** (`src/pages/NotFound.jsx`)
```jsx
const handleGoHome = () => {
  // If logged in, go to first step; if not logged in, go to landing page
  if (userProfile) {
    navigate('/profession-selection-landing');
  } else {
    navigate('/');
  }
};
```

## User Experience Flow

### **For Authenticated Users**

#### **Logo/Title Click**:
1. Click logo/title → Navigate to `/profession-selection-landing`
2. Start assessment flow immediately
3. Efficient path to begin work

#### **Logout**:
1. Click logout → Navigate to `/` (landing page)
2. See version selection options
3. Can choose to login again or try public version

### **For Public Users**

#### **Logo/Title Click**:
1. Click logo/title → Navigate to `/` (landing page)
2. See version selection options
3. Can choose Full Version (login) or Limited Version

#### **Navigation**:
- All logo clicks lead to landing page
- Consistent behavior across all pages
- Clear path to version selection

## Benefits

### 1. **Consistent User Experience**
- Same behavior across all components
- Predictable navigation patterns
- No confusion about where logo clicks lead

### 2. **Better Post-Logout Experience**
- Users see version options after logout
- Can immediately choose to login again
- Can explore public version without barriers

### 3. **Smart Authentication-Aware Navigation**
- Logged-in users get direct access to assessment
- Public users get version selection
- Optimal path for each user type

### 4. **Improved Conversion**
- Post-logout users see value proposition
- Easy path back to full version
- Reduced friction for re-engagement

## Technical Implementation

### **Authentication Detection**
```jsx
import { useAuth } from '../../contexts/AuthContext';
const { userProfile } = useAuth();

// Check if user is authenticated
if (userProfile) {
  // User is logged in - go to first step
  navigate("/profession-selection-landing");
} else {
  // User is not logged in - go to landing page
  navigate("/");
}
```

### **Consistent Logout Pattern**
```jsx
const handleSignOut = async () => {
  await signOut();
  navigate('/'); // Always landing page
};
```

## Testing Scenarios

### **Authenticated User**
1. **Logo Click**: Should go to `/profession-selection-landing`
2. **Logout**: Should go to `/` (landing page)
3. **Post-Logout Logo Click**: Should stay on `/` (landing page)

### **Public User**
1. **Logo Click**: Should go to `/` (landing page)
2. **Navigation**: Consistent across all pages
3. **Login Path**: Clear access to full version

## Pages Affected

✅ **All Assessment Pages** - ProgressHeader with smart logo navigation
✅ **Dashboard** - Logout redirects to landing page
✅ **Static Pages** - Logo clicks follow authentication logic
✅ **Mobile Navigation** - Consistent logout behavior
✅ **Error Pages** - Smart home navigation
✅ **Pending Approval** - Logout redirects to landing page

## Result

Users now experience consistent, intelligent navigation throughout the application:
- **Logout always leads to landing page** for version selection
- **Logo clicks are authentication-aware** for optimal user flow
- **Consistent behavior** across all components and pages
- **Better user experience** with predictable navigation patterns
