import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRole } from "../../hooks/useRole";
import { useToast } from "../../components/ui/ToastProvider";
import ProgressHeader from "../../components/ui/ProgressHeader";
import Icon from "../../components/AppIcon";
import { supabase } from "../../lib/supabase";

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { addToast } = useToast();

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    role: "user",
    profession: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        addToast("Failed to fetch users", "error");
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Exception fetching users:", error);
      addToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, we'll create a user profile entry directly
      // In a production environment, you'd want to use Supabase's admin API
      // or implement a proper user invitation system

      // Generate a temporary user ID (in production, this would come from auth)
      const tempUserId = crypto.randomUUID();

      // Create the user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: tempUserId,
            email: newUser.email,
            role: newUser.role,
            profession: newUser.profession || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        addToast(`Failed to create user: ${profileError.message}`, "error");
        return;
      }

      addToast(
        `User ${newUser.email} created successfully! (Note: This is a demo - in production, the user would receive an invitation email)`,
        "success"
      );
      setShowAddUserModal(false);
      setNewUser({ email: "", role: "user", profession: "" });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Exception creating user:", error);
      addToast("Failed to create user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    if (user && isAdmin()) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  // Redirect if not admin
  if (!user || !isAdmin()) {
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
              onClick={() => navigate("/profession-selection-landing")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
            >
              Return to Home
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
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-primary-50 transition-colors duration-150 disabled:opacity-50"
            >
              <Icon
                name="RefreshCw"
                size={16}
                className={loading ? "animate-spin" : ""}
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
          {loading ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Profession
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {userItem.profession || "Not set"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary hover:text-primary-700 mr-3">
                          Edit
                        </button>
                        <button className="text-error hover:text-error-700">
                          Delete
                        </button>
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
