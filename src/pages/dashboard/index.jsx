import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../components/AppIcon'

const Dashboard = () => {
  const { user, userProfile, signOut, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  // Show loading while profile is being fetched to prevent flash
  if (userProfile === null && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleStartAssessment = () => {
    navigate('/service-profile-collection')
  }

  const handleUserManagement = () => {
    navigate('/admin/user-management')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-primary" />
              </div>
              <h1 className="text-xl font-bold text-text-primary">BenefitGuardian</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                Welcome, {userProfile?.full_name || user?.email}
              </span>
              {isAdmin() && (
                <span className="px-2 py-1 bg-primary-100 text-primary text-xs font-medium rounded">
                  Admin
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="btn-secondary px-3 py-1 text-sm rounded flex items-center gap-2"
              >
                <Icon name="LogOut" size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h2>
          <p className="text-text-secondary">
            Welcome to BenefitGuardian Gap Finder. Start your retirement planning assessment or manage your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start Assessment Card */}
          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="Calculator" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Gap Assessment</h3>
            </div>
            <p className="text-text-secondary mb-4">
              Analyze your retirement benefits and identify potential gaps in your financial planning.
            </p>
            <button
              onClick={handleStartAssessment}
              className="btn-primary w-full py-2 rounded-md font-medium"
            >
              Start Assessment
            </button>
          </div>

          {/* Admin Panel Card - Only for Admins */}
          {isAdmin() && (
            <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Icon name="Settings" size={24} className="text-warning-600" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">User Management</h3>
              </div>
              <p className="text-text-secondary mb-4">
                Approve new users and manage user accounts and permissions.
              </p>
              <button
                onClick={handleUserManagement}
                className="btn-primary w-full py-2 rounded-md font-medium"
              >
                Manage Users
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
