import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const InteractiveCalculator = ({
  scenario,
  onScenarioChange,
  presetScenarios,
  userData,
  calculateProjections
}) => {
  const [activePreset, setActivePreset] = useState('custom');

  // Sync activePreset with current scenario
  useEffect(() => {
    if (!presetScenarios || presetScenarios.length === 0) return;

    const matchingPreset = presetScenarios.find(preset =>
      preset.monthlyContribution === scenario.monthlyContribution &&
      preset.targetRetirementAge === scenario.targetRetirementAge &&
      preset.riskTolerance === scenario.riskTolerance
    );

    setActivePreset(matchingPreset ? matchingPreset.name.toLowerCase() : 'custom');
  }, [scenario, presetScenarios]);

  const handleSliderChange = (field, value) => {
    onScenarioChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.name.toLowerCase());
    onScenarioChange(prev => ({
      ...prev,
      monthlyContribution: preset.monthlyContribution,
      targetRetirementAge: preset.targetRetirementAge,
      riskTolerance: preset.riskTolerance,
      name: preset.name
    }));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return 'bg-success text-success-600';
      case 'moderate': return 'bg-warning text-warning-600';
      case 'aggressive': return 'bg-error text-error-600';
      default: return 'bg-primary text-primary-600';
    }
  };

  const projections = calculateProjections(scenario);

  // Validation check
  if (!presetScenarios || presetScenarios.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <Icon name="AlertCircle" size={48} className="text-warning-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Calculator Unavailable
          </h3>
          <p className="text-text-secondary">
            Unable to load calculator presets. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Interactive Calculator
      </h3>

      {/* Preset Scenarios */}
      <div className="mb-8">
        <h4 className="font-medium text-text-primary mb-4">Quick Start Scenarios</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presetScenarios.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                activePreset === preset.name.toLowerCase()
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(preset.riskTolerance)}`} />
                <span className="font-semibold text-text-primary">{preset.name}</span>
              </div>
              <div className="text-sm text-text-secondary mb-2">
                {preset.description}
              </div>
              <div className="text-xs text-text-muted">
                ${preset.monthlyContribution}/mo • Age {preset.targetRetirementAge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Controls */}
      <div className="space-y-8">
        {/* Monthly Contribution Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="font-medium text-text-primary">
              Monthly Contribution
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                ${scenario.monthlyContribution.toLocaleString()}
              </span>
              <div className="text-sm text-text-secondary">/month</div>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="100"
              max="2000"
              step="25"
              value={scenario.monthlyContribution}
              onChange={(e) => handleSliderChange('monthlyContribution', parseInt(e.target.value))}
              className="w-full h-3 bg-primary-100 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>$100</span>
              <span>$2,000</span>
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-4">
            {[250, 500, 750, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleSliderChange('monthlyContribution', amount)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  scenario.monthlyContribution === amount
                    ? 'bg-primary text-white' :'bg-primary-50 text-primary hover:bg-primary-100'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Target Retirement Age Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="font-medium text-text-primary">
              Target Retirement Age
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary">
                {scenario.targetRetirementAge}
              </span>
              <div className="text-sm text-text-secondary">years old</div>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="55"
              max="70"
              step="1"
              value={scenario.targetRetirementAge}
              onChange={(e) => handleSliderChange('targetRetirementAge', parseInt(e.target.value))}
              className="w-full h-3 bg-secondary-100 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>55</span>
              <span>70</span>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-text-secondary">
            {scenario.targetRetirementAge - userData.currentAge} years until retirement
          </div>
        </div>

        {/* Risk Tolerance Selection */}
        <div>
          <label className="font-medium text-text-primary mb-4 block">
            Risk Tolerance
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {['conservative', 'moderate', 'aggressive'].map((risk) => (
              <button
                key={risk}
                onClick={() => handleSliderChange('riskTolerance', risk)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                  scenario.riskTolerance === risk
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getRiskColor(risk)}`} />
                <div className="font-medium text-text-primary capitalize mb-1">
                  {risk}
                </div>
                <div className="text-xs text-text-secondary">
                  {risk === 'conservative' && 'Target: 5% annually'}
                  {risk === 'moderate' && 'Target: 7% annually'}
                  {risk === 'aggressive' && 'Target: 9% annually'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Feedback */}
      {projections.error ? (
        <div className="mt-8 p-4 bg-error-50 rounded-lg border border-error-200">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-error-800 mb-1">
                Invalid Scenario
              </div>
              <div className="text-sm text-error-700">
                {projections.error}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 p-4 bg-accent-50 rounded-lg border border-accent-200">
          <div className="flex items-start gap-3">
            <Icon name="TrendingUp" size={20} className="text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-accent-800 mb-1">
                Scenario Impact
              </div>
              <div className="text-sm text-accent-700">
                This scenario could close <strong>{projections.gapClosure.toFixed(1)}%</strong> of your
                retirement gap, building <strong>${projections.projectedValue.toLocaleString()}</strong> by
                age {scenario.targetRetirementAge}.
                {projections.gapClosure > 100 && (
                  <span className="block mt-1 text-success-700 font-medium">
                    🎉 This scenario exceeds your gap by ${((projections.projectedValue - userData.totalGap)).toLocaleString()}!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Haptic Feedback Simulation */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }
        
        .slider::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default InteractiveCalculator;