import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressHeader from 'components/ui/ProgressHeader';
import BackNavigation from 'components/ui/BackNavigation';
import ResultsNavigation from 'components/ui/ResultsNavigation';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';
import GapSummaryCard from './components/GapSummaryCard';
import InteractiveCalculator from './components/InteractiveCalculator';
import ScenarioComparison from './components/ScenarioComparison';
import SavedScenarios from './components/SavedScenarios';

const GapCalculatorTool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('calculator');
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState({
    monthlyContribution: 500,
    targetRetirementAge: 65,
    riskTolerance: 'moderate',
    name: 'Current Scenario'
  });

  // Load calculated user data from navigation state
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if we have data from navigation state (from results dashboard)
    if (location.state?.userData) {
      setUserData(location.state.userData);
    } else {
      // If no navigation state, redirect to assessment
      navigate('/dynamic-results-dashboard');
      return;
    }
  }, [location.state, navigate]);

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
      name: 'Conservative',
      monthlyContribution: 650,
      targetRetirementAge: 67,
      riskTolerance: 'conservative',
      description: 'Lower risk, steady growth approach'
    },
    {
      name: 'Moderate',
      monthlyContribution: 600,
      targetRetirementAge: 65,
      riskTolerance: 'moderate',
      description: 'Balanced risk and growth strategy'
    },
    {
      name: 'Aggressive',
      monthlyContribution: 650,
      targetRetirementAge: 62,
      riskTolerance: 'aggressive',
      description: 'Higher risk, accelerated growth plan'
    }
  ];

  const calculateProjections = (scenario) => {
    const yearsToRetirement = scenario.targetRetirementAge - userData.currentAge;

    // Input validation
    if (yearsToRetirement <= 0) {
      return {
        totalContributions: 0,
        projectedValue: 0,
        gapClosure: 0,
        yearsToRetirement: yearsToRetirement,
        monthlyNeeded: 0,
        error: yearsToRetirement === 0
          ? "You are already at retirement age"
          : "Retirement age must be greater than current age"
      };
    }

    if (scenario.monthlyContribution < 0) {
      return {
        totalContributions: 0,
        projectedValue: 0,
        gapClosure: 0,
        yearsToRetirement: yearsToRetirement,
        monthlyNeeded: 0,
        error: "Monthly contribution cannot be negative"
      };
    }

    // Corrected annual growth rates (more realistic)
    const annualGrowthRates = {
      conservative: 0.05, // 5% annual
      moderate: 0.07,     // 7% annual
      aggressive: 0.09    // 9% annual
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
      projectedValue = monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    }

    // Remove the artificial 100% cap to show over-funding scenarios
    const gapClosure = (projectedValue / userData.totalGap) * 100;

    // Correct calculation for monthly needed using Present Value of Annuity formula
    let monthlyNeeded;
    if (monthlyRate === 0) {
      monthlyNeeded = userData.totalGap / months;
    } else {
      monthlyNeeded = userData.totalGap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Calculate inflation-adjusted values (optional)
    const inflationRate = 0.03; // 3% annual inflation
    const realRate = (1 + annualRate) / (1 + inflationRate) - 1;
    const realMonthlyRate = realRate / 12;

    let inflationAdjustedValue;
    if (realMonthlyRate === 0) {
      inflationAdjustedValue = totalContributions;
    } else {
      inflationAdjustedValue = monthlyContribution * (Math.pow(1 + realMonthlyRate, months) - 1) / realMonthlyRate;
    }

    return {
      totalContributions,
      projectedValue,
      inflationAdjustedValue,
      gapClosure,
      yearsToRetirement,
      monthlyNeeded: Math.ceil(monthlyNeeded),
      annualRate: annualRate * 100, // Return as percentage for display
      realAnnualRate: realRate * 100,
      inflationRate: inflationRate * 100
    };
  };

  const handleSaveScenario = () => {
    const newScenario = {
      ...currentScenario,
      id: Date.now(),
      savedAt: new Date(),
      projections: calculateProjections(currentScenario)
    };
    
    setSavedScenarios(prev => [...prev, newScenario]);
    
    // Show success feedback
    const button = document.querySelector('[data-save-scenario]');
    if (button) {
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = 'Save This Scenario';
      }, 2000);
    }
  };

  const handleScheduleConsultation = () => {
    // Navigate with scenario data
    navigate('/report-delivery-confirmation', {
      state: {
        userData,
        currentScenario,
        projections: calculateProjections(currentScenario)
      }
    });
  };

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: 'Calculator' },
    { id: 'comparison', label: 'Compare', icon: 'BarChart3' },
    { id: 'saved', label: 'Saved', icon: 'Bookmark' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressHeader currentStep={5} totalSteps={6} profession={userData.profession} />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <BackNavigation />
              <ResultsNavigation variant="link" />
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Gap Calculator Tool
              </h1>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Explore personalized scenarios to close your retirement gaps. 
                Adjust contributions and see real-time projections for your financial future.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="flex bg-primary-50 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-primary hover:bg-primary-100'
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Gap Summary - Always Visible */}
          <div className="mb-8">
            <GapSummaryCard userData={userData} />
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'calculator' && (
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

            {activeTab === 'comparison' && (
              <ScenarioComparison
                presetScenarios={presetScenarios}
                calculateProjections={calculateProjections}
                userData={userData}
                onSelectScenario={setCurrentScenario}
              />
            )}

            {activeTab === 'saved' && (
              <SavedScenarios
                scenarios={savedScenarios}
                onLoadScenario={setCurrentScenario}
                onDeleteScenario={(id) => setSavedScenarios(prev => prev.filter(s => s.id !== id))}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSaveScenario}
              data-save-scenario
              className="btn-secondary px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:bg-secondary-700 transition-colors duration-200"
            >
              <Icon name="Bookmark" size={20} />
              <span>Save This Scenario</span>
            </button>
            
            <button
              onClick={handleScheduleConsultation}
              className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors duration-200"
            >
              <Icon name="Calendar" size={20} />
              <span>Schedule Consultation</span>
            </button>
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
                  Our retirement planning experts can walk you through these scenarios and help you 
                  choose the best strategy for your unique situation.
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
            <Icon name="AlertTriangle" size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-error-800 mb-1">
                Cannot Calculate Projections
              </div>
              <div className="text-sm text-error-700">
                {projections.error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gapClosureColor = projections.gapClosure >= 100 ? 'text-success' :
                         projections.gapClosure >= 80 ? 'text-success' :
                         projections.gapClosure >= 50 ? 'text-warning' : 'text-error';

  return (
    <div className="space-y-6">
      {/* Gap Closure Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">Gap Closure</span>
          <span className={`text-lg font-bold ${gapClosureColor}`}>
            {projections.gapClosure.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-primary-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              projections.gapClosure >= 100 ? 'bg-success' :
              projections.gapClosure >= 80 ? 'bg-success' :
              projections.gapClosure >= 50 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${Math.min(projections.gapClosure, 100)}%` }}
          />
        </div>
        {projections.gapClosure > 100 && (
          <div className="mt-2 text-sm text-success font-medium">
            🎉 Exceeds gap by ${((projections.projectedValue - userData.totalGap)).toLocaleString()}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            ${projections.projectedValue.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">Projected Value (Nominal)</div>
          <div className="text-xs text-text-muted mt-1">
            ${projections.inflationAdjustedValue.toLocaleString()} in today's dollars
          </div>
        </div>

        <div className="text-center p-4 bg-secondary-50 rounded-lg">
          <div className="text-2xl font-bold text-secondary mb-1">
            {projections.yearsToRetirement}
          </div>
          <div className="text-sm text-text-secondary">Years to Retirement</div>
          <div className="text-xs text-text-muted mt-1">
            {projections.annualRate.toFixed(1)}% growth rate
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-text-secondary">Monthly Contribution</span>
          <span className="font-semibold">${scenario.monthlyContribution.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Total Contributions</span>
          <span className="font-semibold">${projections.totalContributions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Growth Potential</span>
          <span className="font-semibold text-success">
            ${(projections.projectedValue - projections.totalContributions).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      {projections.gapClosure < 100 && (
        <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={20} className="text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-accent-800 mb-1">Recommendation</div>
              <div className="text-sm text-accent-700">
                To fully close your gap, consider increasing your monthly contribution to
                <strong> ${projections.monthlyNeeded.toLocaleString()}</strong> or extending your retirement timeline.
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
        <div className="p-4 bg-success-50 rounded-lg border border-success-200">
          <div className="flex items-start gap-3">
            <Icon name="CheckCircle" size={20} className="text-success-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-success-800 mb-1">Excellent Progress!</div>
              <div className="text-sm text-success-700">
                This scenario {projections.gapClosure > 100 ? 'exceeds' : 'meets'} your retirement gap target.
                {projections.gapClosure > 100 && (
                  <span> You could reduce contributions to ${Math.ceil(scenario.monthlyContribution * (userData.totalGap / projections.projectedValue)).toLocaleString()}/month and still meet your goal.</span>
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