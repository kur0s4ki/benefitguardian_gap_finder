import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('calculator');
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState({
    monthlyContribution: 500,
    targetRetirementAge: 65,
    riskTolerance: 'moderate',
    name: 'Current Scenario'
  });

  // Mock user data from previous steps
  const userData = {
    profession: 'teacher',
    yearsOfService: 15,
    currentAge: 45,
    state: 'California',
    monthlyPension: 2800,
    gaps: {
      pension: {
        amount: 125000,
        risk: 'high',
        description: 'Projected pension shortfall based on inflation and longevity'
      },
      tax: {
        amount: 85000,
        risk: 'medium',
        description: 'Tax torpedo impact on retirement withdrawals'
      },
      survivor: {
        amount: 95000,
        risk: 'high',
        description: 'Survivor benefit protection gap for spouse'
      }
    },
    totalGap: 305000,
    riskScore: 78
  };

  const presetScenarios = [
    {
      name: 'Conservative',
      monthlyContribution: 300,
      targetRetirementAge: 67,
      riskTolerance: 'conservative',
      description: 'Lower risk, steady growth approach'
    },
    {
      name: 'Moderate',
      monthlyContribution: 500,
      targetRetirementAge: 65,
      riskTolerance: 'moderate',
      description: 'Balanced risk and growth strategy'
    },
    {
      name: 'Aggressive',
      monthlyContribution: 750,
      targetRetirementAge: 62,
      riskTolerance: 'aggressive',
      description: 'Higher risk, accelerated growth plan'
    }
  ];

  const calculateProjections = (scenario) => {
    const yearsToRetirement = scenario.targetRetirementAge - userData.currentAge;
    const totalContributions = scenario.monthlyContribution * 12 * yearsToRetirement;
    
    const growthMultipliers = {
      conservative: 1.06,
      moderate: 1.08,
      aggressive: 1.10
    };
    
    const multiplier = growthMultipliers[scenario.riskTolerance];
    const projectedValue = totalContributions * Math.pow(multiplier, yearsToRetirement);
    
    const gapClosure = Math.min((projectedValue / userData.totalGap) * 100, 100);
    
    return {
      totalContributions,
      projectedValue,
      gapClosure,
      yearsToRetirement,
      monthlyNeeded: Math.ceil(userData.totalGap / (12 * yearsToRetirement * multiplier))
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
    // Store scenario data for consultation
    sessionStorage.setItem('consultationData', JSON.stringify({
      userData,
      currentScenario,
      projections: calculateProjections(currentScenario)
    }));
    
    navigate('/report-delivery-confirmation');
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
  const gapClosureColor = projections.gapClosure >= 80 ? 'text-success' : 
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
              projections.gapClosure >= 80 ? 'bg-success' : 
              projections.gapClosure >= 50 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${Math.min(projections.gapClosure, 100)}%` }}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            ${projections.projectedValue.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">Projected Value</div>
        </div>
        
        <div className="text-center p-4 bg-secondary-50 rounded-lg">
          <div className="text-2xl font-bold text-secondary mb-1">
            {projections.yearsToRetirement}
          </div>
          <div className="text-sm text-text-secondary">Years to Retirement</div>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GapCalculatorTool;