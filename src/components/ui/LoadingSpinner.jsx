import React from 'react'
import Icon from '../AppIcon'

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = true,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4'
      case 'large':
        return 'w-8 h-8'
      default:
        return 'w-6 h-6'
    }
  }

  const getTextSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-lg'
      default:
        return 'text-base'
    }
  }

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`${getSizeClasses()} border-2 border-primary border-t-transparent rounded-full animate-spin`}></div>
      {message && (
        <p className={`${getTextSizeClasses()} text-text-secondary font-medium`}>
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Icon name="Shield" size={48} className="text-primary mx-auto mb-4" />
          </div>
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
