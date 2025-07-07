import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PublicAccessBanner from '../ui/PublicAccessBanner';

const PublicAccessWrapper = ({ children }) => {
  const { isPublic } = useAuth();

  return (
    <>
      {/* Sticky banner for public users */}
      {isPublic && <PublicAccessBanner variant="sticky" />}
      
      {/* Content with padding when banner is shown */}
      <div className={isPublic ? 'pt-14' : ''}>
        {children}
      </div>
    </>
  );
};

export default PublicAccessWrapper; 