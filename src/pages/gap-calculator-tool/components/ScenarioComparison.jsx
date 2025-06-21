import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ScenarioComparison = ({ 
  presetScenarios, 
  calculateProjections, 
  userData, 
  onSelectScenario 
}) => {
  const [selectedScenarios, setSelectedScenarios] = useState(['Conservative', 'Moderate', 'Aggressive']);

  const handleScenarioToggle = (scenarioName) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioName)) {
        return prev.filter(name => name !== scenarioName);
      } else if (prev.length < 3) {
        return [...prev, scenarioName];
      }
      return prev;
    });
  };

  const getComparisonData = () => {
    return presetScenarios
      .filter(scenario => selectedScenarios.includes(scenario.name))
      .map(scenario => ({
        ...scenario,
        projections: calculateProjections(scenario)
      }));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return 'text-success bg-success-50 border-success-200';
      case 'moderate': return 'text-warning bg-warning-50 border-warning-200';
      case 'aggressive': return 'text-error bg-error-50 border-error-200';
      default: return 'text-primary bg-primary-50 border-primary-200';
    }
  };

  const comparisonData = getComparisonData();

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Select Scenarios to Compare
        </h3>
        <p className="text-text-secondary mb-6">
          Choose up to 3 scenarios to compare side by side. See how different approaches 
          impact your retirement gap closure.
        </p>
        
        <div className="flex flex-wrap gap-3">
          {presetScenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => handleScenarioToggle(scenario.name)}
              disabled={!selectedScenarios.includes(scenario.name) && selectedScenarios.length >= 3}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedScenarios.includes(scenario.name)
                  ? `${getRiskColor(scenario.riskTolerance)} border-current`
                  : 'border-border text-text-secondary hover:border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedScenarios.includes(scenario.name) && (
                  <Icon name="Check" size={16} />
                )}
                <span>{scenario.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {comparisonData.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            Scenario Comparison
          </h3>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Metric</th>
                  {comparisonData.map((scenario) => (
                    <th key={scenario.name} className="text-center py-3 px-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(scenario.riskTolerance)}`}>
                        {scenario.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <ComparisonRow 
                  label="Monthly Contribution"
                  values={comparisonData.map(s => `$${s.monthlyContribution.toLocaleString()}`)}
                />
                <ComparisonRow 
                  label="Retirement Age"
                  values={comparisonData.map(s => `${s.targetRetirementAge} years`)}
                />
                <ComparisonRow 
                  label="Years to Retirement"
                  values={comparisonData.map(s => `${s.projections.yearsToRetirement} years`)}
                />
                <ComparisonRow 
                  label="Total Contributions"
                  values={comparisonData.map(s => `$${s.projections.totalContributions.toLocaleString()}`)}
                />
                <ComparisonRow 
                  label="Projected Value"
                  values={comparisonData.map(s => `$${s.projections.projectedValue.toLocaleString()}`)}
                  highlight={true}
                />
                <ComparisonRow 
                  label="Gap Closure"
                  values={comparisonData.map(s => `${s.projections.gapClosure.toFixed(1)}%`)}
                  highlight={true}
                />
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {comparisonData.map((scenario) => (
              <div key={scenario.name} className="border border-border rounded-lg p-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskColor(scenario.riskTolerance)}`}>
                  {scenario.name}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-text-secondary">Monthly</div>
                    <div className="font-semibold">${scenario.monthlyContribution.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Retire at</div>
                    <div className="font-semibold">{scenario.targetRetirementAge} years</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Projected Value</div>
                    <div className="font-semibold text-primary">${scenario.projections.projectedValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Gap Closure</div>
                    <div className="font-semibold text-success">{scenario.projections.gapClosure.toFixed(1)}%</div>
                  </div>
                </div>
                
                <button
                  onClick={() => onSelectScenario(scenario)}
                  className="w-full mt-4 btn-primary py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Select This Scenario
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {comparisonData.map((scenario) => (
              <button
                key={scenario.name}
                onClick={() => onSelectScenario(scenario)}
                className="btn-secondary px-4 py-2 rounded-md font-medium hover:bg-secondary-700 transition-colors duration-200"
              >
                Use {scenario.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visual Comparison Chart */}
      {comparisonData.length > 1 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            Gap Closure Comparison
          </h3>
          
          <div className="space-y-4">
            {comparisonData.map((scenario) => (
              <div key={scenario.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-primary">{scenario.name}</span>
                  <span className="text-sm font-semibold text-primary">
                    {scenario.projections.gapClosure.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-primary-100 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      scenario.projections.gapClosure >= 80 ? 'bg-success' : 
                      scenario.projections.gapClosure >= 50 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${Math.min(scenario.projections.gapClosure, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for table rows
const ComparisonRow = ({ label, values, highlight = false }) => (
  <tr className={highlight ? 'bg-primary-50' : ''}>
    <td className="py-3 px-4 font-medium text-text-secondary">{label}</td>
    {values.map((value, index) => (
      <td key={index} className={`py-3 px-4 text-center ${highlight ? 'font-semibold text-primary' : ''}`}>
        {value}
      </td>
    ))}
  </tr>
);

export default ScenarioComparison;