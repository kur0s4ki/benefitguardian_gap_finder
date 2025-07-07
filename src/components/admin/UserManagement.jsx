import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRole } from "../../hooks/useRole";
import { useToast } from "../ui/ToastProvider";
import { getAvailableRoles, getRoleDisplayName } from "../../utils/roles";
import LoadingSpinner from "../ui/LoadingSpinner";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { isAdmin } = useRole();
  const { addToast } = useToast();

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          `
          *,
          user:user_id (
            email,
            created_at,
            last_sign_in_at
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      addToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdating(userId);
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user.user_id === userId ? { ...user, role: newRole } : user
        )
      );

      addToast("User role updated successfully", "success");
    } catch (error) {
      console.error("Error updating user role:", error);
      addToast("Failed to update user role", "error");
    } finally {
      setUpdating(null);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">
          User Management
        </h2>
        <button
          onClick={fetchUsers}
          className="btn btn-outline"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userProfile) => (
                <tr key={userProfile.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {userProfile.user?.email?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userProfile.first_name && userProfile.last_name
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : userProfile.user?.email || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {userProfile.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userProfile.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : userProfile.role === "premium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getRoleDisplayName(userProfile.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userProfile.user?.created_at
                      ? new Date(
                          userProfile.user.created_at
                        ).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userProfile.user?.last_sign_in_at
                      ? new Date(
                          userProfile.user.last_sign_in_at
                        ).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={userProfile.role}
                      onChange={(e) =>
                        updateUserRole(userProfile.user_id, e.target.value)
                      }
                      disabled={updating === userProfile.user_id}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {getAvailableRoles().map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">No users found.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
