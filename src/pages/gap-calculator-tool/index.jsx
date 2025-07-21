import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressHeader from "components/ui/ProgressHeader";
import ConversionFooter from "components/ui/ConversionFooter";
import { useAssessment } from "contexts/AssessmentContext";
import { configService } from "../../services/configurationService";
import { useVersion } from "contexts/VersionContext";

import Icon from "components/AppIcon";
import GapSummaryCard from "./components/GapSummaryCard";
import InteractiveCalculator from "./components/InteractiveCalculator";
import ScenarioComparison from "./components/ScenarioComparison";
import EmailReportModal from "../dynamic-results-dashboard/components/EmailReportModal";

const GapCalculatorTool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData: contextUserData, calculatedResults: contextCalculatedResults, hasValidAssessment } = useAssessment();
  const { isPublic, isAgent, enableAdvancedCalculator, enableScenarioComparison } = useVersion();



  const [activeTab, setActiveTab] = useState("calculator");
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState({
    monthlyContribution: 500,
    targetRetirementAge: 65,
    riskTolerance: "moderate",
    name: "Current Scenario",
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [currentProjections, setCurrentProjections] = useState({
    totalContributions: 0,
    projectedValue: 0,
    gapClosure: 0,
    yearsToRetirement: 0,
    monthlyNeeded: 0,
  });
  const [presetScenarios, setPresetScenarios] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Load calculated user data from navigation state
  const [userData, setUserData] = useState(null);

  // Helper function to transform context data to the format expected by this component
  const transformContextData = (contextUserData, contextCalculatedResults) => {
    if (!contextCalculatedResults) return null;

    return {
      profession: contextCalculatedResults.profession,
      yearsOfService: contextCalculatedResults.yearsOfService,
      currentAge: contextCalculatedResults.currentAge || 45,
      state: contextCalculatedResults.state,
      riskScore: contextCalculatedResults.riskScore,
      // Use the totalGap from calculation engine or calculate it
      totalGap: contextCalculatedResults.totalGap ||
        ((contextCalculatedResults.pensionGap || 0) * 240 +
         (contextCalculatedResults.survivorGap || 0) * 240 +
         (contextCalculatedResults.taxTorpedo || 0)),
      // Use the structured gaps from calculation engine or create them
      gaps: contextCalculatedResults.gaps || {
        pension: {
          amount: (contextCalculatedResults.pensionGap || 0) * 240,
          risk: (contextCalculatedResults.riskComponents?.pensionRisk || 0) > 60 ? "high" :
                (contextCalculatedResults.riskComponents?.pensionRisk || 0) > 30 ? "medium" : "low",
          description: `Monthly pension gap: $${contextCalculatedResults.pensionGap || 0}/month`,
        },
        tax: {
          amount: contextCalculatedResults.taxTorpedo || 0,
          risk: (contextCalculatedResults.riskComponents?.taxRisk || 0) > 60 ? "high" :
                (contextCalculatedResults.riskComponents?.taxRisk || 0) > 30 ? "medium" : "low",
          description: `Tax torpedo impact: $${contextCalculatedResults.taxTorpedo || 0}`,
        },
        survivor: {
          amount: (contextCalculatedResults.survivorGap || 0) * 240,
          risk: (contextCalculatedResults.riskComponents?.survivorRisk || 0) > 60 ? "high" :
                (contextCalculatedResults.riskComponents?.survivorRisk || 0) > 30 ? "medium" : "low",
          description: `Monthly survivor benefit gap: $${contextCalculatedResults.survivorGap || 0}/month`,
        },
      },
      calculationLog: contextCalculatedResults.calculationLog,
    };
  };

  useEffect(() => {
    // Check if we have data from navigation state (from results dashboard)
    if (location.state?.userData) {
      setUserData(location.state.userData);
    } else if (hasValidAssessment() && contextUserData && contextCalculatedResults) {
      // Transform context data to the format expected by this component
      const transformedData = transformContextData(contextUserData, contextCalculatedResults);
      if (transformedData) {
        setUserData(transformedData);
      } else {
        navigate("/");
        return;
      }
    } else {
      // If no data available, redirect to start assessment
      navigate("/");
      return;
    }
  }, [location.state, navigate, hasValidAssessment, contextUserData, contextCalculatedResults]);

  // Load preset scenarios from database configuration
  useEffect(() => {
    const loadPresetScenarios = async () => {
      try {
        // Force refresh cache to get latest data
        await configService.refreshCache();
        const config = await configService.getConfiguration();
        console.log('[GapCalculator] Loaded configuration:', config);
        console.log('[GapCalculator] PRESET_SCENARIOS:', config.PRESET_SCENARIOS);

        if (config.PRESET_SCENARIOS && config.PRESET_SCENARIOS.length > 0) {
          console.log('[GapCalculator] Using database preset scenarios');
          setPresetScenarios(config.PRESET_SCENARIOS);
        } else {
          console.log('[GapCalculator] No database scenarios found, using fallback');
          // Fallback to hardcoded scenarios if database is empty
          setPresetScenarios([
            {
              id: "conservative",
              name: "Conservative",
              monthlyContribution: 650,
              targetRetirementAge: 67,
              riskTolerance: "conservative",
              description: "Lower risk, steady growth approach",
            },
            {
              id: "moderate",
              name: "Moderate",
              monthlyContribution: 600,
              targetRetirementAge: 65,
              riskTolerance: "moderate",
              description: "Balanced risk and growth strategy",
            },
            {
              id: "aggressive",
              name: "Aggressive",
              monthlyContribution: 650,
              targetRetirementAge: 62,
              riskTolerance: "aggressive",
              description: "Higher risk, accelerated growth plan",
            },
          ]);
        }
      } catch (error) {
        console.error('Error loading preset scenarios:', error);
        // Use fallback scenarios on error
        setPresetScenarios([
          {
            id: "conservative",
            name: "Conservative",
            monthlyContribution: 650,
            targetRetirementAge: 67,
            riskTolerance: "conservative",
            description: "Lower risk, steady growth approach",
          },
          {
            id: "moderate",
            name: "Moderate",
            monthlyContribution: 600,
            targetRetirementAge: 65,
            riskTolerance: "moderate",
            description: "Balanced risk and growth strategy",
          },
          {
            id: "aggressive",
            name: "Aggressive",
            monthlyContribution: 650,
            targetRetirementAge: 62,
            riskTolerance: "aggressive",
            description: "Higher risk, accelerated growth plan",
          },
        ]);
      }
    };

    loadPresetScenarios();
  }, []);

  // Calculate projections when scenario or userData changes
  useEffect(() => {
    if (userData && currentScenario) {
      const calculateAsync = async () => {
        try {
          const projections = await calculateProjections(currentScenario);
          setCurrentProjections(projections);
        } catch (error) {
          console.error('Error calculating projections:', error);
          // Set safe default values
          setCurrentProjections({
            totalContributions: 0,
            projectedValue: 0,
            gapClosure: 0,
            yearsToRetirement: 0,
            monthlyNeeded: 0,
          });
        }
      };
      calculateAsync();
    }
  }, [userData, currentScenario]);

  // Note: Scenarios are now stored in memory only for this session
  // Future enhancement: Save scenarios to user profile in database

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Loading Your Data
          </h2>
          <p className="text-text-secondary">
            Preparing your personalized calculator...
          </p>
        </div>
      </div>
    );
  }

  const calculateProjections = async (scenario) => {
    // Add validation for userData and totalGap
    if (!userData || !userData.totalGap || userData.totalGap <= 0) {
      return {
        error: "Invalid gap data - please complete the assessment first",
        totalContributions: 0,
        projectedValue: 0,
        gapClosure: 0,
        yearsToRetirement: 0,
        monthlyNeeded: 0,
      };
    }

    if (!userData.currentAge || userData.currentAge <= 0) {
      return {
        error: "Invalid current age - please complete the assessment first",
        totalContributions: 0,
        projectedValue: 0,
        gapClosure: 0,
        yearsToRetirement: 0,
        monthlyNeeded: 0,
      };
    }

    const yearsToRetirement =
      scenario.targetRetirementAge - userData.currentAge;

    // Input validation
    if (yearsToRetirement <= 0) {
      return {
        totalContributions: 0,
        projectedValue: 0,
        gapClosure: 0,
        yearsToRetirement: yearsToRetirement,
        monthlyNeeded: 0,
        error:
          yearsToRetirement === 0
            ? "You are already at retirement age"
            : "Retirement age must be greater than current age",
      };
    }

    if (scenario.monthlyContribution < 0) {
      return {
        totalContributions: 0,
        projectedValue: 0,
        gapClosure: 0,
        yearsToRetirement: yearsToRetirement,
        monthlyNeeded: 0,
        error: "Monthly contribution cannot be negative",
      };
    }

    // Get growth rates from configuration with fallback
    let annualGrowthRates = {
      conservative: 0.05, // 5% annual
      moderate: 0.07, // 7% annual
      aggressive: 0.09, // 9% annual
    };

    // Try to get rates from configuration
    try {
      const config = await configService.getConfiguration();
      if (config.INVESTMENT_GROWTH_RATES) {
        annualGrowthRates = config.INVESTMENT_GROWTH_RATES;
      }
    } catch (error) {
      console.warn('Failed to load investment growth rates from config, using fallback:', error);
    }

    const annualRate = annualGrowthRates[scenario.riskTolerance];
    const monthlyRate = annualRate / 12;
    const months = yearsToRetirement * 12;
    const monthlyContribution = scenario.monthlyContribution;

    const totalContributions = monthlyContribution * months;

    // Correct Future Value of Ordinary Annuity formula: PMT * (((1 + r)^n - 1) / r)
    let projectedValue;
    if (monthlyRate === 0) {
      // Handle edge case where rate is 0
      projectedValue = totalContributions;
    } else {
      projectedValue =
        (monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1)) /
        monthlyRate;
    }

    // Safe gap closure calculation with bounds checking
    const gapClosure = Math.min(
      100,
      Math.max(0, (projectedValue / userData.totalGap) * 100)
    );

    // Correct calculation for monthly needed using Present Value of Annuity formula
    let monthlyNeeded;
    if (monthlyRate === 0) {
      monthlyNeeded = userData.totalGap / months;
    } else {
      monthlyNeeded =
        (userData.totalGap * monthlyRate) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Calculate inflation-adjusted values (optional)
    const inflationRate = 0.03; // 3% annual inflation
    const realRate = (1 + annualRate) / (1 + inflationRate) - 1;
    const realMonthlyRate = realRate / 12;

    let inflationAdjustedValue;
    if (realMonthlyRate === 0) {
      inflationAdjustedValue = totalContributions;
    } else {
      inflationAdjustedValue =
        (monthlyContribution * (Math.pow(1 + realMonthlyRate, months) - 1)) /
        realMonthlyRate;
    }

    return {
      totalContributions,
      projectedValue,
      inflationAdjustedValue,
      gapClosure: Math.round(gapClosure * 10) / 10, // Round to 1 decimal place
      yearsToRetirement,
      monthlyNeeded: Math.ceil(monthlyNeeded),
      annualRate: Math.round(annualRate * 100), // Return as clean percentage
      realAnnualRate: Math.round(realRate * 100 * 10) / 10, // Round to 1 decimal place
      inflationRate: Math.round(inflationRate * 100), // Return as clean percentage
    };
  };

  const handleSaveScenario = async () => {
    setIsCalculating(true);
    setSaveMessage("");

    try {
      // Validate scenario before saving
      const projections = calculateProjections(currentScenario);
      if (projections.error) {
        setSaveMessage("Cannot save scenario: " + projections.error);
        return;
      }

      // Check for duplicate scenarios
      const isDuplicate = savedScenarios.some(
        (scenario) =>
          scenario.monthlyContribution ===
            currentScenario.monthlyContribution &&
          scenario.targetRetirementAge ===
            currentScenario.targetRetirementAge &&
          scenario.riskTolerance === currentScenario.riskTolerance
      );

      if (isDuplicate) {
        setSaveMessage("This scenario is already saved");
        return;
      }

      const newScenario = {
        ...currentScenario,
        id: Date.now(),
        savedAt: new Date(),
        projections,
      };

      setSavedScenarios((prev) => [...prev, newScenario]);
      setSaveMessage("Scenario saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving scenario:", error);
      setSaveMessage("Failed to save scenario");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleScheduleConsultation = () => {
    // Navigate with scenario data
    const nextRoute = isPublic ? "/public/report" : "/report-delivery-confirmation";
    navigate(nextRoute, {
      state: {
        userData,
        currentScenario,
        projections: calculateProjections(currentScenario),
      },
    });
  };

  const handleEmailReport = async (emailData) => {
    // Transform userData to the format expected by report delivery confirmation
    const transformedUserData = {
      profession: userData.profession,
      yearsOfService: userData.yearsOfService,
      currentAge: userData.currentAge || 45,
      state: userData.state,
      riskScore: userData.riskScore,
      riskColor: userData.riskColor,
      totalGap: userData.totalGap,

      // Direct properties for compatibility
      pensionGap: userData.pensionGap || 0,
      taxTorpedo: userData.taxTorpedo || 0,
      survivorGap: userData.survivorGap || 0,

      // Gaps structure for report preview
      gaps: {
        pension: {
          amount: (userData.pensionGap || 0) * 240,
          monthly: userData.pensionGap || 0,
          description: `Monthly pension shortfall: $${userData.pensionGap || 0}/month`,
        },
        tax: {
          amount: userData.taxTorpedo || 0,
          description: `Tax torpedo impact on retirement withdrawals`,
        },
        survivor: {
          amount: (userData.survivorGap || 0) * 240,
          monthly: userData.survivorGap || 0,
          description: `Monthly survivor benefit gap: $${userData.survivorGap || 0}/month`,
        },
      },

      calculationLog: userData.calculationLog,
    };

    const projections = {
      monthlyNeeded: Math.round(
        ((userData.pensionGap || 0) + (userData.survivorGap || 0)) * 0.8
      ) || 500,
    };

    // Navigate to report delivery confirmation with proper data structure
    const nextRoute = isPublic ? "/public/report" : "/report-delivery-confirmation";
    navigate(nextRoute, {
      state: {
        userData: transformedUserData,
        projections: projections,
        emailData,
      },
    });
  };

  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
  };

  const tabs = [
    { id: "calculator", label: "Calculator", icon: "Calculator" },
    ...(enableScenarioComparison ? [{ id: "comparison", label: "Compare", icon: "BarChart3" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressHeader
        currentStep={5}
        totalSteps={6}
        profession={userData.profession}
      />

      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center mb-4">
              <button
                onClick={() => navigate("/dynamic-results-dashboard", {
                  state: {
                    calculatedResults: location.state?.calculatedResults,
                    userData: userData
                  }
                })}
                className="flex items-center gap-2 px-4 py-3 text-primary hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-150 text-sm sm:text-base font-medium min-h-[44px]"
              >
                <Icon name="ChevronLeft" size={18} />
                <span className="font-medium">Back to Results Dashboard</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Gap Calculator Tool
              </h1>
              <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto px-2">
                Explore personalized scenarios to close your retirement gaps.
                Adjust contributions and see real-time projections for your
                financial future.
              </p>
            </div>

            {/* Simple Tab Navigation */}
            <div className="flex justify-center">
              <div className="flex bg-primary-50 rounded-lg p-1 w-full max-w-md sm:w-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-md font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base min-h-[44px] ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-primary hover:bg-primary-100"
                    }`}
                  >
                    <Icon name={tab.icon} size={16} className="sm:hidden" />
                    <Icon
                      name={tab.icon}
                      size={18}
                      className="hidden sm:block"
                    />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Scenario Info */}
          <div className="mb-6 p-3 sm:p-4 bg-accent-50 rounded-lg border border-accent-200">
            <div className="flex items-start gap-3">
              <Icon
                name="Info"
                size={18}
                className="text-accent-600 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5"
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-accent-800 mb-1 text-sm sm:text-base">
                  Scenario Comparison ({savedScenarios.length}/3 saved)
                </div>
                <div className="text-xs sm:text-sm text-accent-700 break-words">
                  Save up to 3 scenarios from the Calculator tab to compare them
                  side-by-side in the Compare tab. Scenarios are stored locally
                  and persist between sessions.
                </div>
              </div>
            </div>
          </div>

          {/* Gap Summary - Always Visible */}
          <div className="mb-8">
            <GapSummaryCard userData={userData} />
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "calculator" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <InteractiveCalculator
                    scenario={currentScenario}
                    onScenarioChange={setCurrentScenario}
                    presetScenarios={presetScenarios}
                    userData={userData}
                    projections={currentProjections}
                  />
                </div>
                <div>
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Projection Results
                    </h3>
                    <ProjectionResults
                      scenario={currentScenario}
                      projections={currentProjections}
                      userData={userData}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comparison" && enableScenarioComparison && (
              <ScenarioComparison
                savedScenarios={savedScenarios}
                onDeleteScenario={(id) =>
                  setSavedScenarios((prev) => prev.filter((s) => s.id !== id))
                }
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 space-y-4">
            {/* Save Message */}
            {saveMessage && (
              <div
                className={`p-3 rounded-lg text-center ${
                  saveMessage.includes("successfully")
                    ? "bg-success-50 text-success-700 border border-success-200"
                    : saveMessage.includes("already saved")
                    ? "bg-warning-50 text-warning-700 border border-warning-200"
                    : "bg-error-50 text-error-700 border border-error-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon
                    name={
                      saveMessage.includes("successfully")
                        ? "CheckCircle"
                        : saveMessage.includes("already saved")
                        ? "AlertCircle"
                        : "XCircle"
                    }
                    size={16}
                  />
                  <span className="text-sm font-medium">{saveMessage}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSaveScenario}
                disabled={isCalculating || savedScenarios.length >= 3}
                className="btn-secondary px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:bg-secondary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : savedScenarios.length >= 3 ? (
                  <>
                    <Icon name="Bookmark" size={20} />
                    <span>Maximum Scenarios Saved (3/3)</span>
                  </>
                ) : (
                  <>
                    <Icon name="Bookmark" size={20} />
                    <span>Save This Scenario ({savedScenarios.length}/3)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleScheduleConsultation}
                className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Calendar" size={20} />
                <span>Schedule Consultation</span>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 card p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="HelpCircle" size={20} className="text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">
                  Need Help Understanding Your Options?
                </h3>
                <p className="text-text-secondary mb-4">
                  Our retirement planning experts can walk you through these
                  scenarios and help you choose the best strategy for your
                  unique situation.
                </p>
                <button
                  onClick={handleScheduleConsultation}
                  className="text-primary hover:text-primary-700 font-medium inline-flex items-center gap-1 transition-colors duration-150"
                >
                  <span>Schedule a free consultation</span>
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Get Detailed Report Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={handleOpenEmailModal}
              className="btn-primary px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-primary-700 transition-colors duration-200"
            >
              <Icon name="FileText" size={20} />
              Get My Detailed Report
              <Icon name="ArrowRight" size={16} />
            </button>
            <p className="text-sm text-text-secondary mt-2">
              Step 6 of 6 - Receive your comprehensive analysis via email
            </p>
          </div>
        </div>
      </main>

      <ConversionFooter />

      {/* Email Report Modal */}
      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailReport}
        profession={userData?.profession || 'teacher'}
      />

    </div>
  );
};

// Projection Results Component
const ProjectionResults = ({ scenario, projections, userData }) => {
  // Ensure projections has default values
  const safeProjections = {
    totalContributions: 0,
    projectedValue: 0,
    gapClosure: 0,
    yearsToRetirement: 0,
    monthlyNeeded: 0,
    error: null,
    ...projections
  };

  // Handle error cases
  if (safeProjections.error) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-error-50 rounded-lg border border-error-200">
          <div className="flex items-start gap-3">
            <Icon
              name="AlertTriangle"
              size={20}
              className="text-error-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <div className="font-medium text-error-800 mb-1">
                Cannot Calculate Projections
              </div>
              <div className="text-sm text-error-700">{safeProjections.error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gapClosureColor =
    safeProjections.gapClosure >= 100
      ? "text-success"
      : safeProjections.gapClosure >= 80
      ? "text-success"
      : safeProjections.gapClosure >= 50
      ? "text-warning"
      : "text-error";

  return (
    <div className="space-y-6">
      {/* Gap Closure Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Gap Closure
          </span>
          <span className={`text-lg font-bold ${gapClosureColor}`}>
            {safeProjections.gapClosure.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-primary-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              safeProjections.gapClosure >= 100
                ? "bg-success"
                : safeProjections.gapClosure >= 80
                ? "bg-success"
                : safeProjections.gapClosure >= 50
                ? "bg-warning"
                : "bg-error"
            }`}
            style={{ width: `${Math.min(safeProjections.gapClosure, 100)}%` }}
          />
        </div>
        {safeProjections.gapClosure > 100 && (
          <div className="mt-2 text-xs sm:text-sm text-success font-medium break-words">
            🎉 Exceeds gap by $
            {(safeProjections.projectedValue - userData.totalGap).toLocaleString()}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="text-center p-3 sm:p-4 bg-primary-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-primary mb-1 break-words">
            ${safeProjections.projectedValue.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-text-secondary">
            Projected Value (Nominal)
          </div>
          <div className="text-xs text-text-muted mt-1 break-words">
            ${(safeProjections.inflationAdjustedValue || safeProjections.projectedValue).toLocaleString()} in today's
            dollars
          </div>
        </div>

        <div className="text-center p-3 sm:p-4 bg-secondary-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-secondary mb-1">
            {safeProjections.yearsToRetirement}
          </div>
          <div className="text-xs sm:text-sm text-text-secondary">
            Years to Retirement
          </div>
          <div className="text-xs text-text-muted mt-1">
            {safeProjections.annualRate || 7}% growth rate
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <span className="text-text-secondary text-sm sm:text-base">
            Monthly Contribution
          </span>
          <span className="font-semibold text-sm sm:text-base break-words text-right">
            ${scenario.monthlyContribution.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-text-secondary text-sm sm:text-base">
            Total Contributions
          </span>
          <span className="font-semibold text-sm sm:text-base break-words text-right">
            ${safeProjections.totalContributions.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-text-secondary text-sm sm:text-base">
            Growth Potential
          </span>
          <span className="font-semibold text-success text-sm sm:text-base break-words text-right">
            $
            {(
              safeProjections.projectedValue - safeProjections.totalContributions
            ).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      {safeProjections.gapClosure < 100 && (
        <div className="p-3 sm:p-4 bg-accent-50 rounded-lg border border-accent-200">
          <div className="flex items-start gap-3">
            <Icon
              name="Lightbulb"
              size={20}
              className="text-accent-600 flex-shrink-0 mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-accent-800 mb-1 text-sm sm:text-base">
                Recommendation
              </div>
              <div className="text-xs sm:text-sm text-accent-700 break-words">
                To fully close your gap, consider increasing your monthly
                contribution to
                <strong className="break-words">
                  {" "}
                  ${safeProjections.monthlyNeeded.toLocaleString()}
                </strong>{" "}
                or extending your retirement timeline.
                <div className="mt-2 text-xs text-accent-600">
                  Based on {safeProjections.annualRate || 7}% annual growth rate
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success message for over-funding */}
      {projections.gapClosure >= 100 && (
        <div className="p-3 sm:p-4 bg-success-50 rounded-lg border border-success-200">
          <div className="flex items-start gap-3">
            <Icon
              name="CheckCircle"
              size={20}
              className="text-success-600 flex-shrink-0 mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-success-800 mb-1 text-sm sm:text-base">
                Excellent Progress!
              </div>
              <div className="text-xs sm:text-sm text-success-700 break-words">
                This scenario{" "}
                {projections.gapClosure > 100 ? "exceeds" : "meets"} your
                retirement gap target.
                {projections.gapClosure > 100 && (
                  <span className="break-words">
                    {" "}
                    You could reduce contributions to $
                    {Math.ceil(
                      scenario.monthlyContribution *
                        (userData.totalGap / projections.projectedValue)
                    ).toLocaleString()}
                    /month and still meet your goal.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GapCalculatorTool;
