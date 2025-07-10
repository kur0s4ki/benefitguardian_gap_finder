import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/ToastProvider'
import Icon from '../../components/AppIcon'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Login = () => {
  const { signIn, loading: authLoading, isAuthenticated, isApproved } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  // Redirect if already authenticated and approved
  React.useEffect(() => {
    if (isAuthenticated() && isApproved()) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isApproved, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Attempting login...')
      const { data, error } = await signIn(email, password)

      if (error) {
        throw error
      }

      console.log('Login successful, navigating...')
      addToast('Login successful! Welcome back.', 'success')

      // Add a small delay to allow auth state to update
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1000)

    } catch (error) {
      console.error('Login error:', error)
      addToast(`Login failed: ${error.message}`, 'error')
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
            <Icon name="Shield" size={32} className="text-primary" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to access BenefitGuardian Gap Finder</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-700 font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-secondary-50 rounded-b-lg text-center text-xs text-text-muted">
          BenefitGuardian Gap Finder • Secure Login • Public Sector Retirement Planning
        </div>
      </div>
    </div>
  )
}

export default Login
