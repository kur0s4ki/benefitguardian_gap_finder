import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRole } from "../../hooks/useRole";
import ProgressHeader from "../../components/ui/ProgressHeader";
import Icon from "../../components/AppIcon";

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useRole();

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
              You don't have permission to access this page. Admin privileges are required.
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

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Users" size={48} className="text-primary-600" />
            </div>
            
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              User Management Dashboard
            </h2>
            
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              This page is under construction. User management features will be added here, including:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="UserPlus" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Add Users</h3>
                <p className="text-sm text-text-secondary">Create new user accounts</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Edit" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Edit Profiles</h3>
                <p className="text-sm text-text-secondary">Modify user information</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Shield" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Manage Roles</h3>
                <p className="text-sm text-text-secondary">Assign user permissions</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Eye" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">View Activity</h3>
                <p className="text-sm text-text-secondary">Monitor user actions</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Mail" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Send Notifications</h3>
                <p className="text-sm text-text-secondary">Communicate with users</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="BarChart" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Analytics</h3>
                <p className="text-sm text-text-secondary">User engagement metrics</p>
              </div>
            </div>

            <div className="text-sm text-text-secondary">
              <p>Features will be implemented in future updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
