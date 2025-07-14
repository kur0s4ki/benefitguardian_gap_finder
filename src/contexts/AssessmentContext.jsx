import React, { createContext, useContext, useState, useCallback } from 'react';

const AssessmentContext = createContext();

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState({
    userData: null,
    calculatedResults: null,
    isCompleted: false,
  });

  const saveAssessmentResults = useCallback((userData, calculatedResults) => {
    setAssessmentData({
      userData,
      calculatedResults,
      isCompleted: true,
    });
  }, []);

  const clearAssessmentData = useCallback(() => {
    setAssessmentData({
      userData: null,
      calculatedResults: null,
      isCompleted: false,
    });
  }, []);

  const hasValidAssessment = useCallback(() => {
    return assessmentData.isCompleted && 
           assessmentData.userData && 
           assessmentData.calculatedResults;
  }, [assessmentData]);

  const value = {
    ...assessmentData,
    saveAssessmentResults,
    clearAssessmentData,
    hasValidAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentContext;
