import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useToast } from "../../components/ui/ToastProvider";
import ProgressHeader from "../../components/ui/ProgressHeader";
import Icon from "../../components/AppIcon";
import { supabase } from "../../lib/supabase";

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, loading: authLoading, role } = useRole();
  const { addToast } = useToast();

  // Real data from database
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    role: "user",
  });

  // Fetch users and populate table
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        addToast("Failed to fetch users", "error");
        return;
      }

      console.log("List of users:", data);
      setUsers(data || []);
      addToast("Users refreshed", "success");
    } catch (error) {
      console.error("Exception fetching users:", error);
      addToast("Failed to fetch users", "error");
    } finally {
      setUsersLoading(false);
    }
  }, [addToast]);

  // Load users on page load
  useEffect(() => {
    if (isAuthenticated && role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, role, fetchUsers]);

  // Mock add user function for template
  const handleAddUser = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate async operation
    setTimeout(() => {
      addToast(
        `User ${newUser.email} would be created (template mode)`,
        "success"
      );
      setShowAddUserModal(false);
      setNewUser({ email: "", role: "user" });
      setIsSubmitting(false);
    }, 1000);
  };

  // Show loading while checking authentication and role
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={1} profession="teacher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                name="Loader"
                size={32}
                className="text-primary-600 animate-spin"
              />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Checking Permissions
            </h1>
            <p className="text-text-secondary">
              Please wait while we verify your access...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={1} profession="teacher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} className="text-error-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Access Denied
            </h1>
            <p className="text-text-secondary mb-6">
              You don't have permission to access this page. Admin privileges
              are required.
            </p>
            <button
              onClick={() =>
                navigate(
                  isAuthenticated ? "/profession-selection-landing" : "/login"
                )
              }
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
            >
              {isAuthenticated ? "Return to Home" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader currentStep={1} profession="teacher" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                User Management
              </h1>
              <p className="text-text-secondary">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
            >
              <Icon name="UserPlus" size={16} />
              Add User
            </button>
            <button
              onClick={fetchUsers}
              disabled={usersLoading}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-primary-50 transition-colors duration-150 disabled:opacity-50"
            >
              <Icon
                name="RefreshCw"
                size={16}
                className={usersLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
          <div className="text-sm text-text-secondary">
            {users.length} user{users.length !== 1 ? "s" : ""} total
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          {usersLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No users found
              </h3>
              <p className="text-text-secondary mb-4">
                Get started by adding your first user.
              </p>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
              >
                Add First User
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-primary-25">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <Icon
                              name="User"
                              size={16}
                              className="text-primary-600"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {userItem.email}
                            </div>
                            <div className="text-xs text-text-secondary">
                              ID: {userItem.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            userItem.role === "admin"
                              ? "bg-error-100 text-error-800"
                              : "bg-primary-100 text-primary-800"
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Add New User
                  </h3>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-primary mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-text-primary mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium text-text-primary mb-1"
                    >
                      Profession (Optional)
                    </label>
                    <select
                      id="profession"
                      value={newUser.profession}
                      onChange={(e) =>
                        setNewUser({ ...newUser, profession: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select profession...</option>
                      <option value="teacher">Teacher</option>
                      <option value="nurse">Nurse</option>
                      <option value="first-responder">First Responder</option>
                      <option value="government-employee">
                        Government Employee
                      </option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
