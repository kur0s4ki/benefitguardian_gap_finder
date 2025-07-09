import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProgressHeader from "../../components/ui/ProgressHeader";
import Icon from "../../components/AppIcon";

const ManageMyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={1} profession="teacher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} className="text-warning-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Authentication Required
            </h1>
            <p className="text-text-secondary mb-6">
              Please sign in to access your profile management page.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader currentStep={1} profession="teacher" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Manage My Profile
              </h1>
              <p className="text-text-secondary">
                Update your personal information and preferences
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

        {/* User Info Card */}
        <div className="bg-white rounded-lg border border-border shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {user.email}
                </h2>
                <p className="text-text-secondary">
                  Account created: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Settings" size={48} className="text-primary-600" />
            </div>
            
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Profile Management
            </h2>
            
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              This page is under construction. Profile management features will be added here, including:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="User" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Personal Info</h3>
                <p className="text-sm text-text-secondary">Update name, email, and contact details</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Lock" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Security</h3>
                <p className="text-sm text-text-secondary">Change password and security settings</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Bell" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Notifications</h3>
                <p className="text-sm text-text-secondary">Manage email and app notifications</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Sliders" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Preferences</h3>
                <p className="text-sm text-text-secondary">Customize your experience</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Download" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Data Export</h3>
                <p className="text-sm text-text-secondary">Download your data and reports</p>
              </div>
              
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Icon name="Trash2" size={24} className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">Account</h3>
                <p className="text-sm text-text-secondary">Delete or deactivate account</p>
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

export default ManageMyProfile;
