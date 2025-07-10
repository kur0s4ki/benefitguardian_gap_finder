import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useToast } from '../../../components/ui/ToastProvider'
import { supabase } from '../../../lib/supabase'
import { UserRoles } from '../../../types/supabase'
import Icon from '../../../components/AppIcon'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

const UserManagement = () => {
  const { user, userProfile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard')
    }
  }, [isAdmin, navigate])

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      addToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Update user approval status
  const updateUserApproval = async (userId, isApproved) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_approved: isApproved })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_approved: isApproved } : user
      ))

      addToast(
        `User ${isApproved ? 'approved' : 'rejected'} successfully`, 
        'success'
      )
    } catch (error) {
      console.error('Error updating user:', error)
      addToast('Failed to update user status', 'error')
    }
  }

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ))

      addToast('User role updated successfully', 'success')
    } catch (error) {
      console.error('Error updating user role:', error)
      addToast('Failed to update user role', 'error')
    }
  }

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'pending' && !user.is_approved) ||
                         (filterStatus === 'approved' && user.is_approved)
    
    return matchesSearch && matchesStatus
  })

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <Icon name="ArrowLeft" size={20} className="text-text-secondary" />
              </button>
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-primary" />
              </div>
              <h1 className="text-xl font-bold text-text-primary">User Management</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {userProfile?.full_name || user?.email}
              </span>
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
          <h2 className="text-3xl font-bold text-text-primary mb-2">User Management</h2>
          <p className="text-text-secondary">
            Approve new users and manage user accounts and permissions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-text-primary">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-text-secondary">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="text-sm border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={UserRoles.USER}>User</option>
                          <option value={UserRoles.ADMIN}>Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_approved 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {user.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {!user.is_approved ? (
                          <button
                            onClick={() => updateUserApproval(user.id, true)}
                            className="text-success-600 hover:text-success-800 font-medium"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserApproval(user.id, false)}
                            className="text-warning-600 hover:text-warning-800 font-medium"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default UserManagement
