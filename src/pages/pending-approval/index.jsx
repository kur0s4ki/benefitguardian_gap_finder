import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../components/AppIcon'

const PendingApproval = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 via-primary-50 to-background p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg shadow-lg">
        <div className="flex justify-center pt-6">
          <div className="h-16 w-16 bg-warning-100 rounded-full flex items-center justify-center">
            <Icon name="Clock" size={32} className="text-warning-600" />
          </div>
        </div>
        
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Account Pending Approval</h1>
          <p className="text-text-secondary mb-6">
            Your account has been created successfully! An administrator will review and approve your account shortly.
          </p>

          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-warning-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-warning-800 mb-1">What happens next?</h3>
                <ul className="text-sm text-warning-700 space-y-1">
                  <li>• An administrator will review your registration</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• You can then access the full GapGuardian Gold Standard™️ Analysis platform</li>
                </ul>
              </div>
            </div>
          </div>

          {user?.email && (
            <div className="bg-secondary-50 border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-text-secondary">
                <strong>Registered Email:</strong> {user.email}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full btn-secondary py-2 rounded-md font-medium flex items-center justify-center gap-2"
            >
              <Icon name="LogOut" size={16} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-secondary-50 rounded-b-lg text-center text-xs text-text-muted">
          Need help? Contact support at support@gapguardian.com
        </div>
      </div>
    </div>
  )
}

export default PendingApproval
