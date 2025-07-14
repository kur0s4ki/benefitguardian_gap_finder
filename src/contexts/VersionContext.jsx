import React, { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

const VersionContext = createContext();

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};

export const VersionProvider = ({ children }) => {
  const location = useLocation();
  
  // Determine version based on route path
  const isPublic = location.pathname.startsWith('/public');
  const isAgent = !isPublic && !['/login', '/register', '/pending-approval', '/', '/privacy', '/terms', '/disclosures', '/contact', '/404'].includes(location.pathname);
  const isLanding = location.pathname === '/';
  
  // Version-specific configurations
  const versionConfig = {
    isPublic,
    isAgent,
    isLanding,
    
    // Display configurations
    showFullCalculations: isAgent,
    showLimitedResults: isPublic,
    showCTAMessaging: isPublic,
    requireAuthentication: isAgent,
    
    // Data visibility flags
    canShowTotalGap: isAgent,
    canShowPensionGap: isAgent,
    canShowSurvivorGap: isAgent,
    canShowTaxTorpedo: true, // Both versions can show this
    canShowDetailedBreakdown: isAgent,
    canShowProjections: isAgent,
    canShowRiskScore: true, // Both versions, but different detail levels
    
    // Feature flags
    enableAdvancedCalculator: isAgent,
    enableReportDownload: isAgent,
    enableScenarioComparison: isAgent,
    enableLeadCapture: isPublic,
    
    // Messaging
    ctaMessage: "Did you know that 83% of all Public Hero's get ZERO guidance on their retirement options? Get your guidance today.",
    upgradeMessage: "Get the full analysis with detailed gap calculations and personalized recommendations.",
    
    // Route helpers
    getAssessmentStartRoute: () => isPublic ? '/public/assessment' : '/profession-selection-landing',
    getResultsRoute: () => isPublic ? '/public/results' : '/dynamic-results-dashboard',
    getCalculatorRoute: () => isPublic ? '/public/calculator' : '/gap-calculator-tool',
    getReportRoute: () => isPublic ? '/public/report' : '/report-delivery-confirmation',
  };

  const value = {
    ...versionConfig,
    
    // Helper methods
    shouldShowComponent: (componentName) => {
      const componentVisibility = {
        'total-gap': versionConfig.canShowTotalGap,
        'pension-gap': versionConfig.canShowPensionGap,
        'survivor-gap': versionConfig.canShowSurvivorGap,
        'tax-torpedo': versionConfig.canShowTaxTorpedo,
        'detailed-breakdown': versionConfig.canShowDetailedBreakdown,
        'projections': versionConfig.canShowProjections,
        'cta-messaging': versionConfig.showCTAMessaging,
        'lead-capture': versionConfig.enableLeadCapture,
        'advanced-calculator': versionConfig.enableAdvancedCalculator,
        'scenario-comparison': versionConfig.enableScenarioComparison,
      };
      
      return componentVisibility[componentName] ?? true;
    },
    
    getVersionLabel: () => {
      if (isPublic) return 'Limited Version';
      if (isAgent) return 'Full Version';
      return 'BenefitGuardian';
    },
    
    getVersionDescription: () => {
      if (isPublic) return 'Quick assessment with Tax Torpedo analysis';
      if (isAgent) return 'Complete retirement gap analysis with detailed recommendations';
      return 'Retirement Gap Analysis Tool';
    }
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};

export default VersionContext;
