import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressHeader from "components/ui/ProgressHeader";
import BackNavigation from "components/ui/BackNavigation";
import ResultsNavigation from "components/ui/ResultsNavigation";
import ConversionFooter from "components/ui/ConversionFooter";
import { useAuth } from "contexts/AuthContext";
import Icon from "components/AppIcon";
import GapSummaryCard from "./components/GapSummaryCard";
import InteractiveCalculator from "./components/InteractiveCalculator";
import ScenarioComparison from "./components/ScenarioComparison";

const GapCalculatorTool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPublic } = useAuth();

  // Block access for public users
  useEffect(() => {
    if (isPublic) {
      navigate("/login");
    }
  }, [isPublic, navigate]);
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

  // Load calculated user data from navigation state
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if we have data from navigation state (from results dashboard)
    if (location.state?.userData) {
      setUserData(location.state.userData);
    } else {
      // If no navigation state, redirect to assessment
      navigate("/dynamic-results-dashboard");
      return;
    }
  }, [location.state, navigate]);

  // Load saved scenarios from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gapCalculatorScenarios");
      if (saved) {
        const parsedScenarios = JSON.parse(saved);
        setSavedScenarios(parsedScenarios);
      }
    } catch (error) {
      console.warn("Error loading saved scenarios:", error);
    }
  }, []);

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "gapCalculatorScenarios",
        JSON.stringify(savedScenarios)
      );
    } catch (error) {
      console.warn("Error saving scenarios:", error);
    }
  }, [savedScenarios]);

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

  const presetScenarios = [
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
  ];

  const calculateProjections = (scenario) => {
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

    // Corrected annual growth rates (more realistic)
    const annualGrowthRates = {
      conservative: 0.05, // 5% annual
      moderate: 0.07, // 7% annual
      aggressive: 0.09, // 9% annual
    };

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
    navigate("/report-delivery-confirmation", {
      state: {
        userData,
        currentScenario,
        projections: calculateProjections(currentScenario),
      },
    });
  };

  const tabs = [
    { id: "calculator", label: "Calculator", icon: "Calculator" },
    { id: "comparison", label: "Compare", icon: "BarChart3" },
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
                onClick={() => navigate("/dynamic-results-dashboard")}
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
                    calculateProjections={calculateProjections}
                  />
                </div>
                <div>
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Projection Results
                    </h3>
                    <ProjectionResults
                      scenario={currentScenario}
                      projections={calculateProjections(currentScenario)}
                      userData={userData}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comparison" && (
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
      </main>

      <ConversionFooter />
    </div>
  );
};

// Projection Results Component
const ProjectionResults = ({ scenario, projections, userData }) => {
  // Handle error cases
  if (projections.error) {
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
              <div className="text-sm text-error-700">{projections.error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gapClosureColor =
    projections.gapClosure >= 100
      ? "text-success"
      : projections.gapClosure >= 80
      ? "text-success"
      : projections.gapClosure >= 50
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
            {projections.gapClosure.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-primary-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              projections.gapClosure >= 100
                ? "bg-success"
                : projections.gapClosure >= 80
                ? "bg-success"
                : projections.gapClosure >= 50
                ? "bg-warning"
                : "bg-error"
            }`}
            style={{ width: `${Math.min(projections.gapClosure, 100)}%` }}
          />
        </div>
        {projections.gapClosure > 100 && (
          <div className="mt-2 text-xs sm:text-sm text-success font-medium break-words">
            🎉 Exceeds gap by $
            {(projections.projectedValue - userData.totalGap).toLocaleString()}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="text-center p-3 sm:p-4 bg-primary-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-primary mb-1 break-words">
            ${projections.projectedValue.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-text-secondary">
            Projected Value (Nominal)
          </div>
          <div className="text-xs text-text-muted mt-1 break-words">
            ${projections.inflationAdjustedValue.toLocaleString()} in today's
            dollars
          </div>
        </div>

        <div className="text-center p-3 sm:p-4 bg-secondary-50 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-secondary mb-1">
            {projections.yearsToRetirement}
          </div>
          <div className="text-xs sm:text-sm text-text-secondary">
            Years to Retirement
          </div>
          <div className="text-xs text-text-muted mt-1">
            {projections.annualRate}% growth rate
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
            ${projections.totalContributions.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-text-secondary text-sm sm:text-base">
            Growth Potential
          </span>
          <span className="font-semibold text-success text-sm sm:text-base break-words text-right">
            $
            {(
              projections.projectedValue - projections.totalContributions
            ).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      {projections.gapClosure < 100 && (
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
                  ${projections.monthlyNeeded.toLocaleString()}
                </strong>{" "}
                or extending your retirement timeline.
                <div className="mt-2 text-xs text-accent-600">
                  Based on {projections.annualRate}% annual growth rate
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
