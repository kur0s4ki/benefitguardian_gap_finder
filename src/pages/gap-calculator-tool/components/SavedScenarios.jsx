import React from 'react';
import Icon from 'components/AppIcon';

const SavedScenarios = ({ scenarios, onLoadScenario, onDeleteScenario }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return 'text-success bg-success-50';
      case 'moderate': return 'text-warning bg-warning-50';
      case 'aggressive': return 'text-error bg-error-50';
      default: return 'text-primary bg-primary-50';
    }
  };

  if (scenarios.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Bookmark" size={32} className="text-secondary-400" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No Saved Scenarios Yet
        </h3>
        <p className="text-text-secondary mb-6">
          Create and save scenarios in the calculator to compare them later. 
          Your saved scenarios will appear here for easy access.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
          <Icon name="Info" size={16} />
          <span>Use the "Save This Scenario" button in the calculator tab</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Saved Scenarios
            </h3>
            <p className="text-text-secondary">
              Your bookmarked retirement planning scenarios
            </p>
          </div>
          <div className="text-sm text-text-muted">
            {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} saved
          </div>
        </div>

        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="border border-border rounded-lg p-4 hover:shadow-modal transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(scenario.riskTolerance)}`} />
                  <div>
                    <h4 className="font-semibold text-text-primary">
                      {scenario.name}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Saved on {formatDate(scenario.savedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLoadScenario(scenario)}
                    className="p-2 text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
                    title="Load scenario"
                  >
                    <Icon name="Play" size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteScenario(scenario.id)}
                    className="p-2 text-error hover:bg-error-50 rounded-md transition-colors duration-150"
                    title="Delete scenario"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              {/* Scenario Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">
                    ${scenario.monthlyContribution.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-secondary">Monthly</div>
                </div>
                
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="text-lg font-bold text-secondary">
                    {scenario.targetRetirementAge}
                  </div>
                  <div className="text-xs text-text-secondary">Retire Age</div>
                </div>
                
                <div className="text-center p-3 bg-success-50 rounded-lg">
                  <div className="text-lg font-bold text-success">
                    ${scenario.projections.projectedValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-secondary">Projected</div>
                </div>
                
                <div className="text-center p-3 bg-accent-50 rounded-lg">
                  <div className="text-lg font-bold text-accent-600">
                    {scenario.projections.gapClosure.toFixed(1)}%
                  </div>
                  <div className="text-xs text-text-secondary">Gap Closed</div>
                </div>
              </div>

              {/* Gap Closure Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-secondary">Gap Closure Progress</span>
                  <span className="text-sm font-semibold text-primary">
                    {scenario.projections.gapClosure.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-primary-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      scenario.projections.gapClosure >= 80 ? 'bg-success' : 
                      scenario.projections.gapClosure >= 50 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${Math.min(scenario.projections.gapClosure, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onLoadScenario(scenario)}
                  className="flex-1 btn-primary py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Load Scenario
                </button>
                <button
                  onClick={() => onDeleteScenario(scenario.id)}
                  className="px-4 py-2 border border-error text-error hover:bg-error-50 rounded-md font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {scenarios.length > 1 && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Manage all saved scenarios
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all saved scenarios? This action cannot be undone.')) {
                  scenarios.forEach(scenario => onDeleteScenario(scenario.id));
                }
              }}
              className="text-sm text-error hover:text-error-600 font-medium transition-colors duration-150"
            >
              Clear All Scenarios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedScenarios;