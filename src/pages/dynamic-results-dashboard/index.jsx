import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressHeader from "components/ui/ProgressHeader";
import ConversionFooter from "components/ui/ConversionFooter";

import { getRiskLevelSync } from "utils/riskUtils";
import { useAssessment } from "contexts/AssessmentContext";
import { useVersion } from "contexts/VersionContext";

import RiskGauge from "./components/RiskGauge";
import GapAnalysisCard from "./components/GapAnalysisCard";
import DetailedBreakdown from "./components/DetailedBreakdown";
import CallToActionSection from "./components/CallToActionSection";
import { PublicHeroStatistic } from "components/ui/StatisticHighlight";
import PublicVersionCTA from "components/ui/PublicVersionCTA";

const DynamicResultsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    calculatedResults: contextResults,
    hasValidAssessment,
    clearAssessmentData,
  } = useAssessment();
  const { isPublic, ctaMessage } = useVersion();
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [calculationError, setCalculationError] = useState(null);

  // Load data from navigation state or context
  useEffect(() => {
    try {
      // Check if we have calculated results from navigation state
      if (location.state?.calculatedResults) {
        setCalculatedResults(location.state.calculatedResults);
      } else if (hasValidAssessment()) {
        // Fallback to context data if available
        setCalculatedResults(contextResults);
      } else {
        // If no data available, redirect to start based on version
        const startRoute = isPublic
          ? "/public/assessment"
          : "/profession-selection-landing";
        navigate(startRoute, { replace: true });
        return;
      }
    } catch (error) {
      console.error("Error loading results:", error);
      setCalculationError(error.message);
    }
  }, [location.state, contextResults, hasValidAssessment, isPublic, navigate]);

  const professionThemes = {
    teacher: {
      emoji: "🍎",
      title: "Educator",
      bgGradient: "from-blue-50 to-indigo-50",
      accentColor: "text-primary",
    },
    nurse: {
      emoji: "⚕️",
      title: "Healthcare Hero",
      bgGradient: "from-teal-50 to-cyan-50",
      accentColor: "text-success",
    },
    "first-responder": {
      emoji: "🚒",
      title: "First Responder",
      bgGradient: "from-red-50 to-orange-50",
      accentColor: "text-error",
    },
    "government-employee": {
      emoji: "💼",
      title: "Public Servant",
      bgGradient: "from-slate-50 to-gray-50",
      accentColor: "text-secondary",
    },
  };

  const currentTheme = useMemo(
    () =>
      professionThemes[calculatedResults?.profession] ||
      professionThemes.teacher,
    [calculatedResults?.profession]
  );

  // Loading effect after calculation is complete
  useEffect(() => {
    if (calculatedResults || calculationError) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowResults(true), 300);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [calculatedResults, calculationError]);

  const riskLevel = useMemo(
    () =>
      calculatedResults
        ? getRiskLevelSync(calculatedResults.riskScore)
        : {
            level: "Unknown",
            shortLevel: "Unknown",
            color: "text-gray-500",
            bgColorLight: "bg-gray-50",
          },
    [calculatedResults?.riskScore]
  );

  const handleNavigateToCalculator = useCallback(() => {
    // Validate calculatedResults before transformation
    if (!calculatedResults) {
      console.error("No calculated results available for navigation");
      return;
    }

    // Use the standardized data structure from calculation engine
    const transformedData = {
      profession: calculatedResults.profession,
      yearsOfService: calculatedResults.yearsOfService,
      currentAge: calculatedResults.currentAge || 45,
      state: calculatedResults.state,
      monthlyPension: calculatedResults.currentPension,
      gaps: calculatedResults.gaps || {
        // Fallback for older data format - fixed calculation
        pension: {
          amount: (calculatedResults.pensionGap || 0) * 240,
          monthly: calculatedResults.pensionGap || 0,
          risk:
            (calculatedResults.riskComponents?.pensionRisk || 0) > 60
              ? "high"
              : (calculatedResults.riskComponents?.pensionRisk || 0) > 30
              ? "medium"
              : "low",
          description: `Monthly pension shortfall: $${
            calculatedResults.pensionGap || 0
          }/month`,
        },
        tax: {
          amount: calculatedResults.taxTorpedo || 0,
          risk:
            (calculatedResults.riskComponents?.taxRisk || 0) > 60
              ? "high"
              : (calculatedResults.riskComponents?.taxRisk || 0) > 30
              ? "medium"
              : "low",
          description: `Tax torpedo impact on retirement withdrawals`,
        },
        survivor: {
          amount: (calculatedResults.survivorGap || 0) * 240,
          monthly: calculatedResults.survivorGap || 0,
          risk:
            (calculatedResults.riskComponents?.survivorRisk || 0) > 60
              ? "high"
              : (calculatedResults.riskComponents?.survivorRisk || 0) > 30
              ? "medium"
              : "low",
          description: `Monthly survivor benefit gap: $${
            calculatedResults.survivorGap || 0
          }/month`,
        },
      },
      totalGap:
        calculatedResults.totalGap ||
        (calculatedResults.pensionGap || 0) * 240 +
          (calculatedResults.survivorGap || 0) * 240 +
          (calculatedResults.taxTorpedo || 0),
      riskScore: calculatedResults.riskScore,
      riskColor: calculatedResults.riskColor,
      hiddenBenefitOpportunity: calculatedResults.hiddenBenefitOpportunity,
      calculationLog: calculatedResults.calculationLog,
      monthlyContribution: calculatedResults.monthlyContribution,
      lifetimePayout: calculatedResults.lifetimePayout,
      riskComponents: calculatedResults.riskComponents || {},
    };

    const nextRoute = isPublic ? "/public/calculator" : "/gap-calculator-tool";
    navigate(nextRoute, {
      state: {
        userData: transformedData,
      },
    });
  }, [calculatedResults, navigate]);

  const handleStartNewAssessment = useCallback(() => {
    clearAssessmentData();
    const startRoute = isPublic ? "/public/assessment" : "/";
    navigate(startRoute);
  }, [clearAssessmentData, navigate, isPublic]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader
          currentStep={4}
          profession={calculatedResults?.profession || "teacher"}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Analyzing Your Retirement Profile
            </h2>
            <p className="text-text-secondary">
              Calculating personalized gap analysis using GapGuardian Gold
              Standard™️ Analysis engine...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (calculationError) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={4} profession="teacher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-error text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Calculation Error
            </h2>
            <p className="text-text-secondary mb-4">{calculationError}</p>
            <div className="space-y-3">
              <button
                onClick={handleStartNewAssessment}
                className="btn-primary px-6 py-2 rounded-lg w-full"
              >
                Start New Assessment
              </button>
              <button
                onClick={() =>
                  navigate(
                    isPublic ? "/public/profile" : "/service-profile-collection"
                  )
                }
                className="btn-secondary px-6 py-2 rounded-lg w-full"
              >
                Return to Profile Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!calculatedResults) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={4} profession="teacher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No Data Available
            </h2>
            <p className="text-text-secondary mb-4">
              Please complete the assessment to see your results.
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div>
        <ProgressHeader
          currentStep={4}
          profession={calculatedResults.profession}
        />

        <main
          className={`bg-gradient-to-br ${currentTheme.bgGradient} min-h-screen`}
        >
          {/* Hero Section */}
          <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
            <div className="max-w-4xl mx-auto text-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel.bgColorLight} mb-4`}
              >
                <span className="text-2xl">{currentTheme.emoji}</span>
                <span className={`font-semibold ${riskLevel.color}`}>
                  {currentTheme.title} Risk Analysis
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Your Personalized Retirement Gap Analysis
              </h1>

              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Based on your {calculatedResults.yearsOfService} years of
                service and retirement planning profile, we've identified
                critical gaps that could impact your financial security.
              </p>

              {/* Hidden Benefit Opportunity Highlight */}
              <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200 max-w-md mx-auto">
                <div className="text-sm font-medium text-accent-800 mb-1">
                  💡 Hidden Benefit Opportunity
                </div>
                <div className="text-2xl font-bold text-accent-900">
                  $
                  {calculatedResults.hiddenBenefitOpportunity?.toLocaleString() ||
                    "0"}
                  /month
                </div>
                <div className="text-xs text-accent-700">
                  Potential additional monthly benefit based on your profile
                </div>
              </div>
            </div>
          </div>

          {/* Risk Gauge Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-4xl mx-auto">
              <RiskGauge
                score={calculatedResults.riskScore}
                profession={calculatedResults.profession}
                riskComponents={calculatedResults.riskComponents || {}}
                showResults={showResults}
              />
            </div>
          </div>

          {/* Gap Analysis Cards */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
                {isPublic
                  ? "Key Retirement Risk Identified"
                  : "Critical Retirement Gaps Identified"}
              </h2>

              {isPublic ? (
                // Public Version - Show only Tax Torpedo
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Statistic Highlight */}
                  <PublicHeroStatistic className="mb-6" />

                  <GapAnalysisCard
                    title="Tax Torpedo Risk"
                    amount={calculatedResults.taxTorpedo}
                    icon="Zap"
                    emoji="💥"
                    description={`Potential tax impact on $${
                      calculatedResults.otherSavings?.toLocaleString() || "0"
                    } in savings`}
                    riskLevel={
                      (calculatedResults.riskComponents?.taxRisk || 0) > 50
                        ? "high"
                        : "moderate"
                    }
                    delay={0}
                  />

                  {/* CTA Message for Public Version */}
                  <PublicVersionCTA
                    title="Want to See Your Complete Analysis?"
                    showStatistic={true}
                    className="mt-8"
                  />
                </div>
              ) : (
                // Agent Version - Show all gaps
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GapAnalysisCard
                    title="Pension Gap"
                    amount={calculatedResults.pensionGap}
                    icon="TrendingDown"
                    emoji="📉"
                    description={`Monthly pension shortfall: $${calculatedResults.pensionGap}/month`}
                    riskLevel={
                      (calculatedResults.riskComponents?.pensionRisk || 0) > 60
                        ? "high"
                        : "moderate"
                    }
                    delay={0}
                  />

                  <GapAnalysisCard
                    title="Tax Torpedo Risk"
                    amount={calculatedResults.taxTorpedo}
                    icon="Zap"
                    emoji="💥"
                    description={`Potential tax impact on $${
                      calculatedResults.otherSavings?.toLocaleString() || "0"
                    } in savings`}
                    riskLevel={
                      (calculatedResults.riskComponents?.taxRisk || 0) > 50
                        ? "high"
                        : "moderate"
                    }
                    delay={200}
                  />

                  <GapAnalysisCard
                    title="Survivor Protection Gap"
                    amount={calculatedResults.survivorGap}
                    icon="Heart"
                    emoji="❤️‍🩹"
                    description={`Monthly survivor benefit gap: $${calculatedResults.survivorGap}/month`}
                    riskLevel={
                      (calculatedResults.riskComponents?.survivorRisk || 0) > 60
                        ? "high"
                        : "moderate"
                    }
                    delay={400}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Detailed Breakdown - Hidden for now (used for calculation debugging) */}
          {false && !isPublic && (
            <div className="px-4 sm:px-6 lg:px-8 pb-8">
              <div className="max-w-4xl mx-auto">
                <DetailedBreakdown
                  userData={calculatedResults}
                  onNavigateToCalculator={handleNavigateToCalculator}
                />
              </div>
            </div>
          )}

          {/* Call to Action Section - Agent Version Only */}
          {!isPublic && (
            <div className="px-4 sm:px-6 lg:px-8 pb-12">
              <div className="max-w-4xl mx-auto">
                <CallToActionSection
                  onNext={handleNavigateToCalculator}
                  profession={calculatedResults.profession}
                />
              </div>
            </div>
          )}
        </main>

        <ConversionFooter />
      </div>
    </div>
  );
};

export default DynamicResultsDashboard;
