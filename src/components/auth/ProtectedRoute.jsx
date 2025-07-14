import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireApproval = true,
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { user, userProfile, loading, initialized, isAuthenticated, isApproved, isAdmin, isCreatingUser } = useAuth()
  const location = useLocation()

  // Show loading while auth is initializing or profile is loading
  if (!initialized || loading || (isAuthenticated() && userProfile === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If user is authenticated but not approved, redirect to pending approval
  // Skip this check if admin is currently creating a user
  if (requireAuth && isAuthenticated() && requireApproval && !isApproved() && !isCreatingUser) {
    return <Navigate to="/pending-approval" replace />
  }

  // If admin access is required but user is not admin
  if (requireAdmin && (!isAuthenticated() || !isAdmin())) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
