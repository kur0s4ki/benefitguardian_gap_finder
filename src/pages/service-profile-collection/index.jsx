import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressHeader from "components/ui/ProgressHeader";
import ConversionFooter from "components/ui/ConversionFooter";
import Icon from "components/AppIcon";
import YearsOfServiceSlider from "./components/YearsOfServiceSlider";
import PensionEstimateInput from "./components/PensionEstimateInput";
import StateSelector from "./components/StateSelector";
import { useVersion } from "contexts/VersionContext";

const ServiceProfileCollection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPublic, isAgent } = useVersion();

  // Get profession from previous step, sessionStorage, or default
  const getProfession = () => {
    // First try location state
    if (location.state?.profession) {
      return location.state.profession;
    }

    // Then try sessionStorage
    try {
      const storedProfession = sessionStorage.getItem("selectedProfession");
      if (storedProfession) {
        const professionData = JSON.parse(storedProfession);
        return professionData.id || "teacher";
      }
    } catch (error) {
      console.warn("Error parsing stored profession:", error);
    }

    // Default fallback
    return "teacher";
  };

  const profession = getProfession();

  // Form state
  const [formData, setFormData] = useState({
    yearsOfService: 15,
    pensionEstimate: "",
    pensionUnknown: false,
    selectedState: "",
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Ref for the mobile section container
  const mobileSectionRef = useRef(null);

  // Enhanced scroll function to scroll to section container
  const scrollToSection = () => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (mobileSectionRef.current) {
        // Scroll to the mobile section container with smooth behavior
        mobileSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    });
  };

  // Enhanced section navigation with proper timing
  const handleSectionChange = (newSection) => {
    // Prevent rapid section changes
    if (newSection === currentSection) return;

    // Update section first
    setCurrentSection(newSection);

    // Delay scroll to allow React state update and animation to start
    setTimeout(() => {
      scrollToSection();
    }, 150); // Longer delay to ensure content is fully rendered
  };

  // Validate form on changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    // Years of service validation
    if (
      !formData.yearsOfService ||
      formData.yearsOfService < 5 ||
      formData.yearsOfService > 40
    ) {
      newErrors.yearsOfService =
        "Please select years of service between 5-40 years";
    }

    // Pension estimate validation
    if (
      !formData.pensionUnknown &&
      (!formData.pensionEstimate || formData.pensionEstimate <= 0)
    ) {
      newErrors.pensionEstimate =
        'Please enter a valid pension estimate or select "I don\'t know"';
    }

    // State validation
    if (!formData.selectedState) {
      newErrors.selectedState = "Please select your state";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    if (isValid) {
      // Prepare service profile data
      const serviceProfileData = {
        profession,
        yearsOfService: formData.yearsOfService,
        pensionEstimate: formData.pensionUnknown
          ? "I don't know"
          : formData.pensionEstimate,
        pensionUnknown: formData.pensionUnknown,
        state: formData.selectedState,
      };

      const nextRoute = isPublic ? "/public/questionnaire" : "/risk-assessment-questionnaire";
      navigate(nextRoute, {
        state: {
          profession,
          serviceProfile: serviceProfileData,
        },
      });
    }
  };

  const getProfessionTheme = () => {
    const themes = {
      teacher: {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
        icon: "GraduationCap",
        color: "text-primary",
        accent: "bg-primary",
      },
      nurse: {
        bg: "bg-gradient-to-br from-teal-50 to-cyan-50",
        icon: "Heart",
        color: "text-teal-600",
        accent: "bg-teal-600",
      },
      "first-responder": {
        bg: "bg-gradient-to-br from-red-50 to-orange-50",
        icon: "Shield",
        color: "text-red-600",
        accent: "bg-red-600",
      },
      "government-employee": {
        bg: "bg-gradient-to-br from-slate-50 to-gray-50",
        icon: "Building2",
        color: "text-slate-600",
        accent: "bg-slate-600",
      },
    };
    return themes[profession] || themes.teacher;
  };

  const theme = getProfessionTheme();
  const sections = ["Years of Service", "Pension Estimate", "State Selection"];

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <ProgressHeader currentStep={2} totalSteps={6} profession={profession} />

      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 lg:w-20 lg:h-20 ${theme.accent} rounded-full flex items-center justify-center shadow-lg`}
            >
              <Icon name={theme.icon} size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">
            Tell Us About Your Service
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Help us calculate your personalized retirement benefits by sharing
            some basic career information.
          </p>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="lg:hidden mb-4">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-sm font-medium text-text-secondary">
              Step {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
              Complete
            </span>
          </div>
          <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden mx-1">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
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
                onChange={(value) => handleInputChange("yearsOfService", value)}
                error={errors.yearsOfService}
                profession={profession}
              />
            </div>

            {/* Pension Estimate */}
            <div className="card p-8">
              <PensionEstimateInput
                value={formData.pensionEstimate}
                unknown={formData.pensionUnknown}
                onChange={(value) =>
                  handleInputChange("pensionEstimate", value)
                }
                onUnknownToggle={(unknown) =>
                  handleInputChange("pensionUnknown", unknown)
                }
                error={errors.pensionEstimate}
                profession={profession}
              />
            </div>

            {/* State Selection */}
            <div className="card p-8">
              <StateSelector
                value={formData.selectedState}
                onChange={(value) => handleInputChange("selectedState", value)}
                error={errors.selectedState}
                profession={profession}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - One Section at a Time */}
        <div className="lg:hidden">
          <div className="min-h-[450px]" ref={mobileSectionRef}>
            {currentSection === 0 && (
              <div className="swipe-enter">
                <YearsOfServiceSlider
                  value={formData.yearsOfService}
                  onChange={(value) =>
                    handleInputChange("yearsOfService", value)
                  }
                  error={errors.yearsOfService}
                  profession={profession}
                  mobile={true}
                />
              </div>
            )}

            {currentSection === 1 && (
              <div className="swipe-enter">
                <PensionEstimateInput
                  value={formData.pensionEstimate}
                  unknown={formData.pensionUnknown}
                  onChange={(value) =>
                    handleInputChange("pensionEstimate", value)
                  }
                  onUnknownToggle={(unknown) =>
                    handleInputChange("pensionUnknown", unknown)
                  }
                  error={errors.pensionEstimate}
                  profession={profession}
                  mobile={true}
                />
              </div>
            )}

            {currentSection === 2 && (
              <div className="swipe-enter">
                <StateSelector
                  value={formData.selectedState}
                  onChange={(value) =>
                    handleInputChange("selectedState", value)
                  }
                  error={errors.selectedState}
                  profession={profession}
                  mobile={true}
                />
              </div>
            )}
          </div>

          {/* Enhanced Mobile Navigation */}
          <div className="flex justify-between items-center mt-6 px-1">
            <button
              onClick={() =>
                handleSectionChange(Math.max(0, currentSection - 1))
              }
              disabled={currentSection === 0}
              className={`mobile-nav-button ${
                currentSection === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                  : "bg-white text-primary hover:bg-primary-50 hover:shadow-xl mobile-touch-feedback"
              }`}
              aria-label="Previous section"
            >
              <Icon name="ChevronLeft" size={28} />
            </button>

            {/* Mobile Progress Dots */}
            <div className="flex items-center space-x-4">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionChange(index)}
                  className="p-2 transition-all duration-200"
                  aria-label={`Go to ${sections[index]}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentSection
                        ? "bg-primary scale-150"
                        : "bg-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                handleSectionChange(
                  Math.min(sections.length - 1, currentSection + 1)
                )
              }
              disabled={currentSection === sections.length - 1}
              className={`mobile-nav-button ${
                currentSection === sections.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                  : "bg-primary text-white hover:bg-primary-700 hover:shadow-xl mobile-touch-feedback"
              }`}
              aria-label="Next section"
            >
              <Icon name="ChevronRight" size={28} />
            </button>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col gap-4 mt-8 lg:mt-12 lg:flex-row lg:justify-between lg:items-center">
          <button
            onClick={() => navigate("/profession-selection-landing")}
            className="w-full lg:w-auto px-8 py-3 rounded-lg font-semibold text-lg border border-border bg-white text-text-primary hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="ChevronLeft" size={20} />
            <span>Back</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`w-full lg:w-auto px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isValid
                ? "btn-primary hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Continue to Risk Assessment</span>
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 lg:mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="HelpCircle" size={16} />
            <span>
              Need help? All information is kept secure and confidential.
            </span>
          </div>
        </div>
      </main>

      <ConversionFooter />
    </div>
  );
};

export default ServiceProfileCollection;
