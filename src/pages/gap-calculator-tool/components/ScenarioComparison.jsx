import React from 'react';
import Icon from 'components/AppIcon';

const ScenarioComparison = ({
  savedScenarios,
  onDeleteScenario
}) => {
  // Only use saved scenarios - no presets
  const scenarios = savedScenarios || [];

  // All saved scenarios are automatically shown for comparison (up to 3)
  const comparisonData = scenarios.slice(0, 3).map(scenario => ({
    ...scenario,
    // Use existing projections from when scenario was saved
    projections: scenario.projections || {
      error: 'No projection data available',
      totalContributions: 0,
      projectedValue: 0,
      gapClosure: 0
    }
  })).filter(scenario => !scenario.projections.error);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return 'text-success bg-success-50 border-success-200';
      case 'moderate': return 'text-warning bg-warning-50 border-warning-200';
      case 'aggressive': return 'text-error bg-error-50 border-error-200';
      default: return 'text-primary bg-primary-50 border-primary-200';
    }
  };

  // Empty state - no saved scenarios
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <Icon name="Bookmark" size={48} className="text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No Saved Scenarios Yet
          </h3>
          <p className="text-text-secondary mb-6">
            Save scenarios from the Calculator tab to compare them here. You can save up to 3 scenarios for comparison.
          </p>
          <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
            <div className="flex items-center gap-3">
              <Icon name="Info" size={16} className="text-accent-600" />
              <div className="text-sm text-accent-700">
                <strong>How it works:</strong> Adjust settings in the Calculator tab, then click "Save This Scenario" to add it here for comparison.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saved Scenarios Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Your Saved Scenarios
            </h3>
            <p className="text-text-secondary">
              Compare your saved retirement planning scenarios side by side
            </p>
          </div>
          <div className="text-sm text-text-muted">
            {scenarios.length} of 3 scenarios saved
          </div>
        </div>

        {/* Saved Scenarios List */}
        <div className="space-y-3">
          {scenarios.map((scenario, index) => (
            <div key={scenario.id} className="flex items-center justify-between p-4 bg-accent-50 rounded-lg border border-accent-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-text-primary">{scenario.name}</div>
                  <div className="text-sm text-text-secondary">
                    ${scenario.monthlyContribution}/month • Retire at {scenario.targetRetirementAge} • {scenario.riskTolerance}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteScenario(scenario.id)}
                className="p-2 text-error hover:bg-error-50 rounded-md transition-colors duration-150"
                title="Delete scenario"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
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
                    <th key={scenario.id || scenario.name} className="text-center py-3 px-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(scenario.riskTolerance)}`}>
                        <Icon name="Bookmark" size={12} />
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
                  label="Risk Tolerance"
                  values={comparisonData.map(s => {
                    const riskMap = {
                      'conservative': '5% (Conservative)',
                      'moderate': '7% (Moderate)',
                      'aggressive': '9% (Aggressive)'
                    };
                    return riskMap[s.riskTolerance] || s.riskTolerance;
                  })}
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
              <div key={scenario.id || scenario.name} className="border border-border rounded-lg p-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskColor(scenario.riskTolerance)}`}>
                  <Icon name="Bookmark" size={12} />
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
              </div>
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
              <div key={scenario.id || scenario.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon name="Bookmark" size={14} className="text-accent-600" />
                    <span className="font-medium text-text-primary">{scenario.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {scenario.projections.gapClosure.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-primary-100 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      scenario.projections.gapClosure >= 100 ? 'bg-success' :
                      scenario.projections.gapClosure >= 80 ? 'bg-success' :
                      scenario.projections.gapClosure >= 50 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${Math.min(scenario.projections.gapClosure, 100)}%` }}
                  />
                </div>
                {scenario.projections.gapClosure > 100 && (
                  <div className="text-xs text-success-600 mt-1">
                    Exceeds target by {(scenario.projections.gapClosure - 100).toFixed(1)}%
                  </div>
                )}
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