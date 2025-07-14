import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const UserProfileCard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleManageProfile = () => {
    navigate('/user-profile');
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon name="User" size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
      </div>
      <p className="text-text-secondary mb-4 flex-grow">
        Manage your account details, update your profile information, and view account status.
      </p>
      <button
        onClick={handleManageProfile}
        className="btn-primary w-full py-2 rounded-md font-medium mt-auto"
      >
        Manage Profile
      </button>
    </div>
  );
};

export default UserProfileCard;
