import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressHeader from 'components/ui/ProgressHeader';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';
import InflationProtectionSection from './components/InflationProtectionSection';
import SurvivorPlanningSection from './components/SurvivorPlanningSection';
import RetirementAgeSection from './components/RetirementAgeSection';
import FinancialFearsSection from './components/FinancialFearsSection';
import AssetInputSection from './components/AssetInputSection';
import { calculateBenefitGaps, validateUserData } from 'utils/calculationEngine';
import { useToast } from 'components/ui/ToastProvider';

const RiskAssessmentQuestionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get profession from previous step or default
  const [profession, setProfession] = useState('teacher');
  const [formData, setFormData] = useState({
    inflationProtection: undefined, // This maps to 'cola' in client spec - undefined means not selected, null means "not sure"
    survivorPlanning: null,
    survivorPlanningDetails: '',
    currentAge: '',
    retirementAge: 65,
    financialFears: [],
    currentSavings: '',
    preferNotToSay: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  const { addToast } = useToast();

  // Load data from navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.profession) {
        setProfession(location.state.profession);
      }
    } else {
      // If no navigation state, redirect to start
      navigate('/profession-selection-landing');
    }
  }, [location.state, navigate]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // First check local form validation
    if (!isFormValid()) {
      const validationErrors = getValidationErrors();
      setSubmissionErrors(validationErrors);
      addToast(`Please complete all required fields:\n${validationErrors.join('\n')}`, 'error');
      return;
    }

    setIsSubmitting(true);

    // Validate combined data before calculations
    const preliminaryData = {
      profession,
      yearsOfService: location.state?.serviceProfile?.yearsOfService,
      state: location.state?.serviceProfile?.state,
      retirementAge: formData.retirementAge,
      currentAge: formData.currentAge,
      pensionEstimate: location.state?.serviceProfile?.pensionEstimate,
      pensionUnknown: location.state?.serviceProfile?.pensionUnknown,
      currentSavings: formData.currentSavings,
      preferNotToSay: formData.preferNotToSay,
      inflationProtection: formData.inflationProtection,
      survivorPlanning: formData.survivorPlanning,
      financialFears: formData.financialFears
    };

    const { isValid, errors, warnings } = validateUserData(preliminaryData);

    if (!isValid) {
      setIsSubmitting(false);
      setSubmissionErrors(errors);
      addToast(`Please fix the highlighted errors before continuing:\n${errors.join('\n')}`, 'error');
      return;
    } else {
      setSubmissionErrors([]);
    }

    if (warnings.length > 0) {
      addToast(warnings.join('\n'), 'warning');
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Combine all collected data
    const allData = {
      profession,
      serviceProfile: location.state?.serviceProfile || {},
      riskAssessment: formData
    };

    // Calculate results and navigate with data
    let results;
    try {
      results = calculateBenefitGaps({
        profession: allData.profession,
        yearsOfService: allData.serviceProfile.yearsOfService,
        pensionEstimate: allData.serviceProfile.pensionEstimate,
        pensionUnknown: allData.serviceProfile.pensionUnknown,
        state: allData.serviceProfile.state,
        currentAge: allData.riskAssessment.currentAge,
        retirementAge: allData.riskAssessment.retirementAge,
        inflationProtection: allData.riskAssessment.inflationProtection,
        survivorPlanning: allData.riskAssessment.survivorPlanning,
        currentSavings: parseFloat(allData.riskAssessment.currentSavings) || 0,
        financialFears: allData.riskAssessment.financialFears
      });

      // Check if calculation returned an error
      if (results.error) {
        setIsSubmitting(false);
        addToast(`Calculation error: ${results.error}`, 'error');
        console.error('Calculation engine error:', results.error, results.calculationLog);
        return;
      }
    } catch (error) {
      setIsSubmitting(false);
      addToast(`Unexpected error during calculation: ${error.message}`, 'error');
      console.error('Calculation error:', error);
      return;
    }

    // Store results in localStorage for persistence
    try {
      localStorage.setItem('calculatedResults', JSON.stringify(results));
      localStorage.setItem('userData', JSON.stringify(allData));
    } catch (error) {
      console.error('Error storing results:', error);
    }

    // Navigate to results with calculated data
    navigate('/dynamic-results-dashboard', {
      state: {
        calculatedResults: results,
        userData: allData
      }
    });
  };

  const isFormValid = () => {
    // Age validation
    const currentAge = parseInt(formData.currentAge);
    const retirementAge = parseInt(formData.retirementAge);
    
    const hasValidCurrentAge = currentAge && currentAge >= 21 && currentAge <= 80;
    const hasValidRetirementAge = retirementAge && retirementAge >= 50 && retirementAge <= 80;
    const hasValidAgeRelationship = hasValidCurrentAge && hasValidRetirementAge && retirementAge > currentAge;
    
    // Required field validation
    const hasInflationProtection = formData.inflationProtection !== undefined;
    const hasSurvivorPlanning = formData.survivorPlanning !== null;
    const hasFinancialFears = Array.isArray(formData.financialFears) && formData.financialFears.length > 0;
    
    // Savings validation - either has savings value or prefers not to say
    const hasSavingsInfo = formData.preferNotToSay || 
                          (formData.currentSavings !== '' && 
                           !isNaN(parseFloat(formData.currentSavings)) && 
                           parseFloat(formData.currentSavings) >= 0);
    
    return (
      hasInflationProtection &&
      hasSurvivorPlanning &&
      hasValidAgeRelationship &&
      hasFinancialFears &&
      hasSavingsInfo
    );
  };

  // Helper function to get validation errors for display
  const getValidationErrors = () => {
    const errors = [];
    
    const currentAge = parseInt(formData.currentAge);
    const retirementAge = parseInt(formData.retirementAge);
    
    if (!currentAge || currentAge < 21 || currentAge > 80) {
      errors.push('Current age must be between 21 and 80');
    }
    
    if (!retirementAge || retirementAge < 50 || retirementAge > 80) {
      errors.push('Retirement age must be between 50 and 80');
    }
    
    if (currentAge && retirementAge && retirementAge <= currentAge) {
      errors.push('Retirement age must be greater than current age');
    }
    
    if (formData.inflationProtection === undefined) {
      errors.push('Please select your inflation protection preference');
    }
    
    if (formData.survivorPlanning === null) {
      errors.push('Please select your survivor planning preference');
    }
    
    if (!Array.isArray(formData.financialFears) || formData.financialFears.length === 0) {
      errors.push('Please select at least one financial concern');
    }
    
    if (!formData.preferNotToSay && 
        (formData.currentSavings === '' || 
         isNaN(parseFloat(formData.currentSavings)) || 
         parseFloat(formData.currentSavings) < 0)) {
      errors.push('Please enter a valid savings amount or select "Prefer not to say"');
    }
    
    return errors;
  };

  const getProfessionTheme = () => {
    const themes = {
      teacher: {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        accent: 'text-blue-600',
        icon: 'GraduationCap'
      },
      nurse: {
        bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
        accent: 'text-teal-600',
        icon: 'Heart'
      },
      'first-responder': {
        bg: 'bg-gradient-to-br from-red-50 to-orange-50',
        accent: 'text-red-600',
        icon: 'Shield'
      },
      'government-employee': {
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        accent: 'text-purple-600',
        icon: 'Building2'
      }
    };
    return themes[profession] || themes.teacher;
  };

  const sections = [
    { id: 'inflation', title: 'Inflation Protection', component: InflationProtectionSection },
    { id: 'survivor', title: 'Survivor Planning', component: SurvivorPlanningSection },
    { id: 'retirement', title: 'Retirement Timeline', component: RetirementAgeSection },
    { id: 'fears', title: 'Financial Concerns', component: FinancialFearsSection },
    { id: 'assets', title: 'Current Assets', component: AssetInputSection }
  ];

  const theme = getProfessionTheme();

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <ProgressHeader currentStep={3} totalSteps={6} profession={profession} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name={theme.icon} size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Risk Assessment Questionnaire
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Help us understand your retirement vulnerabilities to provide personalized recommendations
          </p>
          
          {/* Progress Indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-text-secondary">Step 3 of 3</span>
              <div className="w-32 h-2 bg-primary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-sm font-medium text-primary">Complete</span>
            </div>
          </div>
        </div>

        {/* Assessment Sections */}
        <div className="space-y-8">
          {/* Desktop Layout - All sections visible */}
          <div className="hidden lg:block space-y-8">
            <InflationProtectionSection
              value={formData.inflationProtection}
              onChange={(value) => updateFormData('inflationProtection', value)}
              profession={profession}
            />
            
            <SurvivorPlanningSection
              value={formData.survivorPlanning}
              details={formData.survivorPlanningDetails}
              onChange={(value) => updateFormData('survivorPlanning', value)}
              onDetailsChange={(value) => updateFormData('survivorPlanningDetails', value)}
              profession={profession}
            />
            
            <RetirementAgeSection
              currentAge={formData.currentAge}
              value={formData.retirementAge}
              onCurrentAgeChange={(value) => updateFormData('currentAge', value)}
              onChange={(value) => updateFormData('retirementAge', value)}
              profession={profession}
            />
            
            <FinancialFearsSection
              value={formData.financialFears}
              onChange={(value) => updateFormData('financialFears', value)}
              profession={profession}
            />
            
            <AssetInputSection
              savings={formData.currentSavings}
              preferNotToSay={formData.preferNotToSay}
              onSavingsChange={(value) => updateFormData('currentSavings', value)}
              onPreferNotToSayChange={(value) => updateFormData('preferNotToSay', value)}
              profession={profession}
            />
          </div>

          {/* Mobile Layout - One section at a time */}
          <div className="lg:hidden">
            <div className="mb-6">
              <div className="flex justify-center space-x-2">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index <= currentSection ? 'bg-primary' : 'bg-primary-100'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-text-secondary mt-2">
                {sections[currentSection]?.title}
              </p>
            </div>

            {/* Current Section */}
            {currentSection === 0 && (
              <InflationProtectionSection
                value={formData.inflationProtection}
                onChange={(value) => updateFormData('inflationProtection', value)}
                profession={profession}
              />
            )}
            
            {currentSection === 1 && (
              <SurvivorPlanningSection
                value={formData.survivorPlanning}
                details={formData.survivorPlanningDetails}
                onChange={(value) => updateFormData('survivorPlanning', value)}
                onDetailsChange={(value) => updateFormData('survivorPlanningDetails', value)}
                profession={profession}
              />
            )}
            
            {currentSection === 2 && (
              <RetirementAgeSection
                currentAge={formData.currentAge}
                value={formData.retirementAge}
                onCurrentAgeChange={(value) => updateFormData('currentAge', value)}
                onChange={(value) => updateFormData('retirementAge', value)}
                profession={profession}
              />
            )}
            
            {currentSection === 3 && (
              <FinancialFearsSection
                value={formData.financialFears}
                onChange={(value) => updateFormData('financialFears', value)}
                profession={profession}
              />
            )}
            
            {currentSection === 4 && (
              <AssetInputSection
                savings={formData.currentSavings}
                preferNotToSay={formData.preferNotToSay}
                onSavingsChange={(value) => updateFormData('currentSavings', value)}
                onPreferNotToSayChange={(value) => updateFormData('preferNotToSay', value)}
                profession={profession}
              />
            )}

            {/* Mobile Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                  currentSection === 0
                    ? 'text-text-muted cursor-not-allowed' :'text-primary hover:bg-primary-50'
                }`}
              >
                <Icon name="ChevronLeft" size={18} />
                <span>Previous</span>
              </button>

              {currentSection < sections.length - 1 ? (
                <button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-150"
                >
                  <span>Next</span>
                  <Icon name="ChevronRight" size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-150 ${
                    isFormValid() && !isSubmitting
                      ? 'bg-accent text-secondary hover:bg-accent-500 hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Calculator" size={20} />
                      <span>Calculate My Results</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Submit Button */}
        <div className="hidden lg:block mt-12 text-center">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              isFormValid() && !isSubmitting
                ? 'bg-accent text-secondary hover:bg-accent-500 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
                <span>Calculating Your Results...</span>
              </>
            ) : (
              <>
                <Icon name="Calculator" size={24} />
                <span>Calculate My Results</span>
                <Icon name="ArrowRight" size={20} />
              </>
            )}
          </button>
          
          <p className="text-sm text-text-secondary mt-4 max-w-md mx-auto">
            Get your personalized GrowthGuard Risk Score and discover hidden benefit opportunities
          </p>
        </div>

        {/* Form Validation Summary */}
        {(!isFormValid() || submissionErrors.length > 0) && (
          <div className="mt-8 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning-600 mb-2">Please complete all sections:</h3>
                <ul className="text-sm text-warning-700 space-y-1">
                  {formData.inflationProtection === undefined && (
                    <li>• Inflation protection status</li>
                  )}
                  {formData.survivorPlanning === null && (
                    <li>• Survivor income planning</li>
                  )}
                  {(!formData.currentAge || !formData.retirementAge) && (
                    <li>• Current and retirement age</li>
                  )}
                  {formData.currentAge && formData.retirementAge && formData.retirementAge <= formData.currentAge && (
                    <li>• Retirement age must be greater than current age</li>
                  )}
                  {formData.financialFears.length === 0 && (
                    <li>• Financial concerns selection</li>
                  )}
                  {!formData.currentSavings && !formData.preferNotToSay && (
                    <li>• Current savings information</li>
                  )}
                  {submissionErrors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <ConversionFooter />
    </div>
  );
};

export default RiskAssessmentQuestionnaire;