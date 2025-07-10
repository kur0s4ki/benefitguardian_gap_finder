import React, { useState } from 'react'
import Icon from '../AppIcon'
import { UserRoles } from '../../types/supabase'

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: UserRoles.USER
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: UserRoles.USER
      })
      setErrors({})
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error creating user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: UserRoles.USER
      })
      setErrors({})
      onClose()
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="UserPlus" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Add New User</h2>
                <p className="text-sm text-text-secondary">Create a new user account</p>
              </div>
            </div>
            {!isSubmitting && (
              <button
                onClick={handleClose}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Full Name Input */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="User" size={18} className="text-text-secondary" />
              </div>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter full name"
                disabled={isSubmitting}
                className={`input-field w-full pl-10 pr-4 py-3 ${
                  errors.fullName ? 'border-error focus:border-error focus:ring-error-100' : ''
                } ${isSubmitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.fullName && (
              <div className="mt-2 flex items-center gap-2 text-sm text-error">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Mail" size={18} className="text-text-secondary" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="user@example.com"
                disabled={isSubmitting}
                className={`input-field w-full pl-10 pr-4 py-3 ${
                  errors.email ? 'border-error focus:border-error focus:ring-error-100' : ''
                } ${isSubmitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.email && (
              <div className="mt-2 flex items-center gap-2 text-sm text-error">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Lock" size={18} className="text-text-secondary" />
              </div>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                disabled={isSubmitting}
                className={`input-field w-full pl-10 pr-4 py-3 ${
                  errors.password ? 'border-error focus:border-error focus:ring-error-100' : ''
                } ${isSubmitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.password && (
              <div className="mt-2 flex items-center gap-2 text-sm text-error">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Shield" size={18} className="text-text-secondary" />
              </div>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                disabled={isSubmitting}
                className={`input-field w-full pl-10 pr-4 py-3 ${
                  isSubmitting ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              >
                <option value={UserRoles.USER}>User</option>
                <option value={UserRoles.ADMIN}>Admin</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Creating User...</span>
              </>
            ) : (
              <>
                <Icon name="UserPlus" size={18} />
                <span>Create User</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal
