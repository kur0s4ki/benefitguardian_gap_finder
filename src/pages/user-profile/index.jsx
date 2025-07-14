import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || '',
    email: userProfile?.email || user?.email || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      addToast('Full name is required', 'error');
      return;
    }

    if (!formData.email.trim()) {
      addToast('Email is required', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update auth user email if it changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email.trim()
        });

        if (emailError) {
          // If email update fails, still show success for profile update
          console.warn('Email update failed:', emailError);
          addToast('Profile updated successfully. Email change requires verification.', 'warning');
        } else {
          addToast('Profile updated successfully!', 'success');
        }
      } else {
        addToast('Profile updated successfully!', 'success');
      }

      // Update user profile in context
      updateUserProfile({
        full_name: formData.fullName.trim(),
        email: formData.email.trim()
      });

      // Navigate back to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Error updating profile:', error);
      addToast(`Failed to update profile: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Icon name="ChevronLeft" size={18} />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                Welcome, {userProfile?.full_name || user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Personal Information</h1>
          <p className="text-text-secondary">
            Manage your account details and personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Edit Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                  <p className="text-sm text-text-secondary mt-2">
                    Changing your email will require verification
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border">
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 btn-secondary py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 btn-primary py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Account Type
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-medium capitalize">
                      {userProfile?.role || 'User'}
                    </span>
                    {userProfile?.role === 'admin' && (
                      <span className="px-2 py-1 bg-primary-100 text-primary text-xs font-medium rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Member Since
                  </label>
                  <p className="text-text-primary font-medium">
                    {formatDate(userProfile?.created_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Last Updated
                  </label>
                  <p className="text-text-primary font-medium">
                    {formatDate(userProfile?.updated_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-text-primary font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
