import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressHeader from 'components/ui/ProgressHeader';
import BackNavigation from 'components/ui/BackNavigation';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';
import YearsOfServiceSlider from './components/YearsOfServiceSlider';
import PensionEstimateInput from './components/PensionEstimateInput';
import StateSelector from './components/StateSelector';

const ServiceProfileCollection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get profession from previous step or default
  const profession = location.state?.profession || 'teacher';
  
  // Form state
  const [formData, setFormData] = useState({
    yearsOfService: 15,
    pensionEstimate: '',
    pensionUnknown: false,
    selectedState: ''
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('serviceProfileData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data on changes
  useEffect(() => {
    sessionStorage.setItem('serviceProfileData', JSON.stringify(formData));
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Years of service validation
    if (!formData.yearsOfService || formData.yearsOfService < 5 || formData.yearsOfService > 40) {
      newErrors.yearsOfService = 'Please select years of service between 5-40 years';
    }
    
    // Pension estimate validation
    if (!formData.pensionUnknown && (!formData.pensionEstimate || formData.pensionEstimate <= 0)) {
      newErrors.pensionEstimate = 'Please enter a valid pension estimate or select "I don\'t know"';
    }
    
    // State validation
    if (!formData.selectedState) {
      newErrors.selectedState = 'Please select your state';
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    if (isValid) {
      // Save service profile data to session storage
      const serviceProfileData = {
        profession,
        yearsOfService: formData.yearsOfService,
        pensionEstimate: formData.pensionUnknown ? "I don't know" : formData.pensionEstimate,
        pensionUnknown: formData.pensionUnknown,
        state: formData.selectedState
      };

      sessionStorage.setItem('serviceProfileData', JSON.stringify(serviceProfileData));

      navigate('/risk-assessment-questionnaire', {
        state: {
          profession,
          serviceProfile: serviceProfileData
        }
      });
    }
  };

  const getProfessionTheme = () => {
    const themes = {
      teacher: {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        icon: 'GraduationCap',
        color: 'text-primary',
        accent: 'bg-primary'
      },
      nurse: {
        bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
        icon: 'Heart',
        color: 'text-teal-600',
        accent: 'bg-teal-600'
      },
      'first-responder': {
        bg: 'bg-gradient-to-br from-red-50 to-orange-50',
        icon: 'Shield',
        color: 'text-red-600',
        accent: 'bg-red-600'
      },
      'government-employee': {
        bg: 'bg-gradient-to-br from-slate-50 to-gray-50',
        icon: 'Building2',
        color: 'text-slate-600',
        accent: 'bg-slate-600'
      }
    };
    return themes[profession] || themes.teacher;
  };

  const theme = getProfessionTheme();
  const sections = ['Years of Service', 'Pension Estimate', 'State Selection'];

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col`}>
      <ProgressHeader currentStep={2} totalSteps={6} profession={profession} />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 lg:w-20 lg:h-20 ${theme.accent} rounded-full flex items-center justify-center shadow-lg`}>
              <Icon name={theme.icon} size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">
            Tell Us About Your Service
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Help us calculate your personalized retirement benefits by sharing some basic career information.
          </p>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="lg:hidden mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Step {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentSection + 1) / sections.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-primary mt-2">
            {sections[currentSection]}
          </p>
        </div>

        {/* Desktop Layout - All Sections Visible */}
        <div className="hidden lg:block">
          <div className="grid gap-8">
            {/* Years of Service */}
            <div className="card p-8">
              <YearsOfServiceSlider
                value={formData.yearsOfService}
                onChange={(value) => handleInputChange('yearsOfService', value)}
                error={errors.yearsOfService}
                profession={profession}
              />
            </div>

            {/* Pension Estimate */}
            <div className="card p-8">
              <PensionEstimateInput
                value={formData.pensionEstimate}
                unknown={formData.pensionUnknown}
                onChange={(value) => handleInputChange('pensionEstimate', value)}
                onUnknownToggle={(unknown) => handleInputChange('pensionUnknown', unknown)}
                error={errors.pensionEstimate}
                profession={profession}
              />
            </div>

            {/* State Selection */}
            <div className="card p-8">
              <StateSelector
                value={formData.selectedState}
                onChange={(value) => handleInputChange('selectedState', value)}
                error={errors.selectedState}
                profession={profession}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - One Section at a Time */}
        <div className="lg:hidden">
          <div className="card p-6 min-h-[400px] flex flex-col">
            {currentSection === 0 && (
              <YearsOfServiceSlider
                value={formData.yearsOfService}
                onChange={(value) => handleInputChange('yearsOfService', value)}
                error={errors.yearsOfService}
                profession={profession}
                mobile={true}
              />
            )}
            
            {currentSection === 1 && (
              <PensionEstimateInput
                value={formData.pensionEstimate}
                unknown={formData.pensionUnknown}
                onChange={(value) => handleInputChange('pensionEstimate', value)}
                onUnknownToggle={(unknown) => handleInputChange('pensionUnknown', unknown)}
                error={errors.pensionEstimate}
                profession={profession}
                mobile={true}
              />
            )}
            
            {currentSection === 2 && (
              <StateSelector
                value={formData.selectedState}
                onChange={(value) => handleInputChange('selectedState', value)}
                error={errors.selectedState}
                profession={profession}
                mobile={true}
              />
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-between items-center mt-6">
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

            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={currentSection === sections.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                currentSection === sections.length - 1
                  ? 'text-text-muted cursor-not-allowed' :'text-primary hover:bg-primary-50'
              }`}
            >
              <span>Next</span>
              <Icon name="ChevronRight" size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 lg:mt-12">
          <BackNavigation />
          
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
              isValid
                ? 'btn-primary hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Risk Assessment
            <Icon name="ArrowRight" size={20} className="ml-2 inline" />
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 lg:mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="HelpCircle" size={16} />
            <span>Need help? All information is kept secure and confidential.</span>
          </div>
        </div>
      </main>

      <ConversionFooter />
    </div>
  );
};

export default ServiceProfileCollection;