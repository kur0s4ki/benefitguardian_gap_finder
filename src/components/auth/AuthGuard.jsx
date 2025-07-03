import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../ui/ToastProvider'
import LoadingSpinner from '../ui/LoadingSpinner'

const AuthGuard = ({ 
  children, 
  fallback = null, 
  showToast = false,
  toastMessage = 'Please sign in to access this feature'
}) => {
  const { user, loading } = useAuth()
  const { addToast } = useToast()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  // If user is not authenticated
  if (!user) {
    if (showToast) {
      addToast(toastMessage, 'warning')
    }
    
    return fallback || (
      <div className="text-center py-8">
        <p className="text-text-secondary">
          Please sign in to access this feature.
        </p>
      </div>
    )
  }

  // User is authenticated, render children
  return children
}

export default AuthGuard
