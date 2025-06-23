import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressHeader from 'components/ui/ProgressHeader';
import ConversionFooter from 'components/ui/ConversionFooter';

import RiskGauge from './components/RiskGauge';
import GapAnalysisCard from './components/GapAnalysisCard';
import DetailedBreakdown from './components/DetailedBreakdown';
import CallToActionSection from './components/CallToActionSection';

const DynamicResultsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [calculationError, setCalculationError] = useState(null);

  // Load data from navigation state or localStorage
  useEffect(() => {
    try {
      // Check if we have calculated results from navigation state
      if (location.state?.calculatedResults) {
        setCalculatedResults(location.state.calculatedResults);
      } else {
        // Try to load from localStorage
        const storedResults = localStorage.getItem('calculatedResults');
        if (storedResults) {
          setCalculatedResults(JSON.parse(storedResults));
        } else {
          // If no stored data, redirect to start
          setCalculationError('No assessment data found. Please complete the assessment first.');
          return;
        }
      }

    } catch (error) {
      console.error('Error loading results:', error);
      setCalculationError(error.message);
    }
  }, [location.state]);

  const professionThemes = {
    teacher: {
      emoji: '🍎',
      title: 'Educator',
      bgGradient: 'from-blue-50 to-indigo-50',
      accentColor: 'text-primary'
    },
    nurse: {
      emoji: '⚕️',
      title: 'Healthcare Hero',
      bgGradient: 'from-teal-50 to-cyan-50',
      accentColor: 'text-success'
    },
    'first-responder': {
      emoji: '🚒',
      title: 'First Responder',
      bgGradient: 'from-red-50 to-orange-50',
      accentColor: 'text-error'
    },
    'government-employee': {
      emoji: '🏛️',
      title: 'Public Servant',
      bgGradient: 'from-slate-50 to-gray-50',
      accentColor: 'text-secondary'
    }
  };

  const currentTheme = professionThemes[calculatedResults?.profession] || professionThemes.teacher;

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

  const getRiskLevel = (score) => {
    if (score < 40) return { level: 'Low', color: 'text-success', bgColor: 'bg-success-50' };
    if (score < 70) return { level: 'Moderate', color: 'text-warning', bgColor: 'bg-warning-50' };
    return { level: 'High', color: 'text-error', bgColor: 'bg-error-50' };
  };

  const riskLevel = calculatedResults ? getRiskLevel(calculatedResults.riskScore) : { level: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-50' };

  const handleNavigateToCalculator = () => {
    // Transform calculated results to the format expected by Gap Calculator
    const transformedData = {
      profession: calculatedResults.profession,
      yearsOfService: calculatedResults.yearsOfService,
      currentAge: calculatedResults.currentAge || 45,
      state: calculatedResults.state,
      monthlyPension: calculatedResults.currentPension,
      gaps: {
        pension: {
          amount: calculatedResults.pensionGap * 240, // Convert monthly to 20-year total
          risk: calculatedResults.riskComponents?.pensionRisk > 60 ? 'high' : 'medium',
          description: `Monthly pension shortfall: $${calculatedResults.pensionGap}/month`
        },
        tax: {
          amount: calculatedResults.taxTorpedo,
          risk: calculatedResults.riskComponents?.taxRisk > 50 ? 'high' : 'medium',
          description: `Tax torpedo impact on retirement withdrawals`
        },
        survivor: {
          amount: calculatedResults.survivorGap * 240, // Convert monthly to 20-year total
          risk: calculatedResults.riskComponents?.survivorRisk > 60 ? 'high' : 'medium',
          description: `Monthly survivor benefit gap: $${calculatedResults.survivorGap}/month`
        }
      },
      totalGap: (calculatedResults.pensionGap + calculatedResults.survivorGap) * 240 + calculatedResults.taxTorpedo,
      riskScore: calculatedResults.riskScore,
      hiddenBenefitOpportunity: calculatedResults.hiddenBenefitOpportunity
    };

    navigate('/gap-calculator-tool', {
      state: {
        userData: transformedData
      }
    });
  };

  const handleEmailReport = async () => {
    // HubSpot integration would go here
    console.log('Email report requested');

    // Transform calculated results to the format expected by report delivery confirmation
    const transformedUserData = {
      profession: calculatedResults.profession,
      yearsOfService: calculatedResults.yearsOfService,
      currentAge: calculatedResults.currentAge || 45,
      state: calculatedResults.state,
      riskScore: calculatedResults.riskScore,
      riskColor: calculatedResults.riskScore >= 70 ? 'red' :
                 calculatedResults.riskScore >= 40 ? 'gold' : 'green',
      gaps: {
        pension: {
          amount: calculatedResults.pensionGap * 240, // Convert monthly to 20-year total
          description: `Monthly pension shortfall: $${calculatedResults.pensionGap}/month`
        },
        tax: {
          amount: calculatedResults.taxTorpedo,
          description: `Tax torpedo impact on retirement withdrawals`
        },
        survivor: {
          amount: calculatedResults.survivorGap * 240, // Convert monthly to 20-year total
          description: `Monthly survivor benefit gap: $${calculatedResults.survivorGap}/month`
        }
      }
    };

    const projections = {
      monthlyNeeded: Math.round((calculatedResults.pensionGap + calculatedResults.survivorGap) * 0.8) || 500
    };

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));

    navigate('/report-delivery-confirmation', {
      state: {
        userData: transformedUserData,
        projections: projections
      }
    });
  };

  const handleBookAudit = () => {
    // Calendly integration would go here
    console.log('Audit booking requested');
    window.open('https://calendly.com/publicserv-wealth', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={4} profession={calculatedResults?.profession || 'teacher'} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Analyzing Your Retirement Profile
            </h2>
            <p className="text-text-secondary">
              Calculating personalized gap analysis using PublicServ Wealth Group™ engine...
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
            <p className="text-text-secondary mb-4">
              {calculationError}
            </p>
            <button
              onClick={() => navigate('/service-profile-collection')}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              Return to Profile Setup
            </button>
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
              onClick={() => navigate('/')}
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
      <ProgressHeader currentStep={4} profession={calculatedResults.profession} />

      <main className={`bg-gradient-to-br ${currentTheme.bgGradient} min-h-screen`}>
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel.bgColor} mb-4`}>
              <span className="text-2xl">{currentTheme.emoji}</span>
              <span className={`font-semibold ${riskLevel.color}`}>
                {currentTheme.title} Risk Analysis
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Your Personalized Retirement Gap Analysis
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Based on your {calculatedResults.yearsOfService} years of service and retirement planning profile,
              we've identified critical gaps that could impact your financial security.
            </p>

            {/* Hidden Benefit Opportunity Highlight */}
            <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200 max-w-md mx-auto">
              <div className="text-sm font-medium text-accent-800 mb-1">
                💡 Hidden Benefit Opportunity
              </div>
              <div className="text-2xl font-bold text-accent-900">
                ${calculatedResults.hiddenBenefitOpportunity.toLocaleString()}/month
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
              showResults={showResults}
            />
          </div>
        </div>

        {/* Gap Analysis Cards */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
              Critical Retirement Gaps Identified
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GapAnalysisCard
                title="Pension Gap"
                amount={calculatedResults.pensionGap}
                icon="TrendingDown"
                emoji="📉"
                description={`Monthly pension shortfall: $${calculatedResults.pensionGap}/month`}
                riskLevel={calculatedResults.riskComponents.pensionRisk > 60 ? "high" : "moderate"}
                delay={0}
              />

              <GapAnalysisCard
                title="Tax Torpedo Risk"
                amount={calculatedResults.taxTorpedo}
                icon="Zap"
                emoji="💥"
                description={`Potential tax impact on $${calculatedResults.otherSavings.toLocaleString()} in savings`}
                riskLevel={calculatedResults.riskComponents.taxRisk > 50 ? "high" : "moderate"}
                delay={200}
              />

              <GapAnalysisCard
                title="Survivor Protection Gap"
                amount={calculatedResults.survivorGap}
                icon="Heart"
                emoji="❤️‍🩹"
                description={`Monthly survivor benefit gap: $${calculatedResults.survivorGap}/month`}
                riskLevel={calculatedResults.riskComponents.survivorRisk > 60 ? "high" : "moderate"}
                delay={400}
              />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <DetailedBreakdown
              userData={calculatedResults}
              onNavigateToCalculator={handleNavigateToCalculator}
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <CallToActionSection
              onEmailReport={handleEmailReport}
              onBookAudit={handleBookAudit}
              profession={calculatedResults.profession}
            />
          </div>
        </div>
      </main>

      <ConversionFooter />
    </div>
  );
};

export default DynamicResultsDashboard;