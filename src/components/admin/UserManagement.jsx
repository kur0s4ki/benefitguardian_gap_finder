import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/ToastProvider";
import { getAvailableRoles, getRoleDisplayName } from "../../utils/roles";
import LoadingSpinner from "../ui/LoadingSpinner";

const UserManagement = () => {
  // Mock data for template
  const [users] = useState([
    {
      id: "1",
      email: "admin@example.com",
      role: "admin",
      created_at: "2025-01-01T00:00:00Z",
    },
    {
      id: "2",
      email: "user1@example.com",
      role: "user",
      created_at: "2025-01-02T00:00:00Z",
    },
    {
      id: "3",
      email: "user2@example.com",
      role: "user",
      created_at: "2025-01-03T00:00:00Z",
    },
  ]);

  const [loading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const { userProfile } = useAuth();
  const { addToast } = useToast();

  const fetchUsers = () => {
    addToast("Users refreshed (template mode)", "success");
  };

  const updateUserRole = (userId, newRole) => {
    setUpdating(userId);

    // Simulate async operation
    setTimeout(() => {
      addToast(
        `User role would be updated to ${newRole} (template mode)`,
        "success"
      );
      setUpdating(null);
    }, 1000);
  };

  // Show loading while checking auth
  if (!userProfile) {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  // Check admin access
  if (userProfile.role !== "admin") {
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
                            {userProfile.email?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userProfile.first_name && userProfile.last_name
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : userProfile.email || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {userProfile.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={userProfile.role}
                      onChange={(e) =>
                        updateUserRole(userProfile.id, e.target.value)
                      }
                      disabled={updating === userProfile.id}
                      className={`text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        userProfile.role === "admin"
                          ? "bg-red-50 text-red-800"
                          : "bg-green-50 text-green-800"
                      }`}
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
