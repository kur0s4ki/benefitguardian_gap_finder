import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useToast } from '../../../components/ui/ToastProvider'
import { supabase } from '../../../lib/supabase'
import { UserRoles } from '../../../types/supabase'
import Icon from '../../../components/AppIcon'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import AddUserModal from '../../../components/admin/AddUserModal'

const UserManagement = () => {
  const { user, userProfile, signOut, isAdmin, setIsCreatingUser } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)

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
        .update({ role: role })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: role } : user
      ))

      addToast('User role updated successfully', 'success')
    } catch (error) {
      console.error('Error updating user role:', error)
      addToast('Failed to update user role', 'error')
    }
  }

  // Add new user using admin.createUser()
  const handleAddUser = async (userData) => {
    try {
      // Set flag to prevent auth state changes from affecting admin session
      setIsCreatingUser(true)

      // Create admin Supabase client with service role key
      const { createClient } = await import('@supabase/supabase-js')
      const adminSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // Create user using admin API - this won't auto-login the user
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm email for admin-created users
        user_metadata: {
          full_name: userData.fullName
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create/update user profile using admin client
        const { error: profileError } = await adminSupabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            full_name: userData.fullName,
            email: userData.email,
            role: userData.role,
            is_approved: true // Admin-created users are auto-approved
          })

        if (profileError) throw profileError

        // Refresh users list
        await fetchUsers()

        addToast('User created successfully', 'success')
        setShowAddUserModal(false)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      addToast(`Failed to create user: ${error.message}`, 'error')
      throw error // Re-throw to let modal handle loading state
    } finally {
      // Always clear the flag, even if there was an error
      setIsCreatingUser(false)
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, usersPerPage])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Show loading while profile is being fetched
  if (userProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">User Management</h2>
              <p className="text-text-secondary">
                Approve new users and manage user accounts and permissions.
              </p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Icon name="UserPlus" size={18} />
              Add User
            </button>
          </div>
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
            <div className="relative inline-block">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 pr-8 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Users</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              </div>
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
            {/* Summary Info */}
            {filteredUsers.length > 0 && (
              <div className="px-6 py-3 bg-secondary-50 border-b border-border">
                <div className="flex justify-between items-center text-sm text-text-secondary">
                  <span>
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                    {searchTerm && ` matching "${searchTerm}"`}
                    {filterStatus !== 'all' && ` (${filterStatus})`}
                  </span>
                  {totalPages > 1 && (
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>
              </div>
            )}
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
                  {currentUsers.map((user) => (
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
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="text-sm border border-border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white min-w-[80px]"
                          >
                            <option value={UserRoles.USER}>User</option>
                            <option value={UserRoles.ADMIN}>Admin</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                          </div>
                        </div>
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

            {/* Pagination Controls */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-text-secondary">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Show:</span>
                    <div className="relative inline-block">
                      <select
                        value={usersPerPage}
                        onChange={(e) => setUsersPerPage(Number(e.target.value))}
                        className="border border-border rounded px-2 py-1 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white min-w-[60px]"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">

                      </div>
                    </div>
                    <span className="text-text-secondary">per page</span>
                  </div>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-border rounded hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Icon name="ChevronLeft" size={16} />
                      Previous
                    </button>

                  <div className="flex items-center space-x-1">
                    {/* Smart pagination - show first, last, current and nearby pages */}
                    {totalPages <= 7 ? (
                      // Show all pages if 7 or fewer
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'border border-border hover:bg-secondary-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      // Show smart pagination with ellipsis
                      <>
                        {/* First page */}
                        <button
                          onClick={() => setCurrentPage(1)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === 1
                              ? 'bg-primary text-white'
                              : 'border border-border hover:bg-secondary-50'
                          }`}
                        >
                          1
                        </button>

                        {/* Left ellipsis */}
                        {currentPage > 3 && (
                          <span className="px-2 text-text-secondary">...</span>
                        )}

                        {/* Current page and neighbors */}
                        {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                          .filter(page => page > 1 && page < totalPages)
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm rounded ${
                                currentPage === page
                                  ? 'bg-primary text-white'
                                  : 'border border-border hover:bg-secondary-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                        {/* Right ellipsis */}
                        {currentPage < totalPages - 2 && (
                          <span className="px-2 text-text-secondary">...</span>
                        )}

                        {/* Last page */}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === totalPages
                              ? 'bg-primary text-white'
                              : 'border border-border hover:bg-secondary-50'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-border rounded hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
                )}
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />
    </div>
  )
}

export default UserManagement
