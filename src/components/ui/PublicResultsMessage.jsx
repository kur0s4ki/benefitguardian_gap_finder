import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const PublicResultsMessage = ({ 
  className = "",
  showOnlyWhenPublic = true 
}) => {
  const { isPublic } = useAuth();
  const navigate = useNavigate();

  // Only show for public users if showOnlyWhenPublic is true
  if (showOnlyWhenPublic && !isPublic) {
    return null;
  }

  const handleGetGuidanceClick = () => {
    navigate('/login');
  };

  return (
    <div className={`bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Users" size={32} className="text-accent-600" />
        </div>
        
        <h3 className="text-xl font-bold text-text-primary mb-3">
          Join 83% of Public Heroes Getting Guidance
        </h3>
        
        <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
          Did you know that <strong>83% of all Public Heroes get ZERO guidance</strong> on their retirement options? 
          Don't be part of that statistic. Get your personalized guidance today and secure your financial future.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGetGuidanceClick}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-150 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Your Guidance Today
          </button>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Shield" size={16} className="text-accent-600" />
            <span>Free • Secure • Personalized</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-accent-200">
          <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Complete Analysis</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Exact Gap Amounts</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Action Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicResultsMessage;
