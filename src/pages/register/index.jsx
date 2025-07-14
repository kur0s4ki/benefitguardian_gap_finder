import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/ToastProvider'
import Icon from '../../components/AppIcon'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Register = () => {
  const { signUp, loading: authLoading, isAuthenticated, isApproved } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated and approved
  React.useEffect(() => {
    if (isAuthenticated() && isApproved()) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isApproved, navigate])

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signUp(email, password, fullName)

      if (error) {
        throw error
      }

      addToast('Registration successful! Your account is pending approval.', 'success')
      navigate('/pending-approval')
    } catch (error) {
      console.error('Registration error:', error)
      addToast(`Registration failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 via-primary-50 to-background p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg shadow-lg">
        <div className="flex justify-center pt-6">
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="UserPlus" size={32} className="text-primary" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary">Join GapGuardian Gold Standard™️ Analysis</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-secondary-50 rounded-b-lg text-center text-xs text-text-muted">
          GapGuardian Gold Standard™️ Analysis • Secure Registration • Public Sector Retirement Planning
        </div>
      </div>
    </div>
  )
}

export default Register
