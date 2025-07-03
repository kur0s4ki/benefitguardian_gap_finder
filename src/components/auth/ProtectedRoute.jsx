import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user is authenticated but trying to access login page
  if (!requireAuth && user) {
    // Redirect to the main app
    return <Navigate to="/profession-selection-landing" replace />
  }

  // Render the protected component
  return children
}

export default ProtectedRoute
