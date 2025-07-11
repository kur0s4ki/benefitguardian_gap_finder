import React, { useState, useEffect } from 'react';
import { configService } from '../../../../services/configurationService';
import { useToast } from '../../../../components/ui/ToastProvider';
import Icon from '../../../../components/AppIcon';

const InvestmentsConfig = ({ config, onUpdate }) => {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [investmentData, setInvestmentData] = useState([]);

  useEffect(() => {
    loadInvestmentData();
  }, []);

  const loadInvestmentData = async () => {
    try {
      const data = await configService.getAllInvestmentScenarios();
      setInvestmentData(data);
    } catch (error) {
      console.error('Failed to load investment data:', error);
    }
  };

  const handleUpdateScenario = async (scenario) => {
    try {
      setSaving(true);
      await configService.updateInvestmentScenario(
        scenario.scenario_id,
        scenario.name,
        scenario.monthly_contribution,
        scenario.target_retirement_age,
        scenario.risk_tolerance,
        scenario.annual_growth_rate,
        scenario.description,
        scenario.display_order
      );
      addToast('Investment scenario updated successfully', 'success');
      await loadInvestmentData();
      onUpdate();
    } catch (error) {
      addToast('Failed to update investment scenario', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateScenarioField = (scenarioId, field, value) => {
    setInvestmentData(prev => prev.map(scenario => 
      scenario.scenario_id === scenarioId 
        ? { ...scenario, [field]: value }
        : scenario
    ));
  };

  const getRiskColor = (riskTolerance) => {
    switch (riskTolerance) {
      case 'conservative': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'aggressive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Investment Scenarios</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Configure preset investment scenarios used in the gap calculator tool.
        </p>
      </div>

      {/* Investment Scenarios */}
      <div className="space-y-6">
        {investmentData.map((scenario) => (
          <div key={scenario.scenario_id} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon name="Target" size={18} className="text-primary" />
                <h4 className="text-lg font-medium text-text-primary">{scenario.name}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(scenario.risk_tolerance)}`}>
                  {scenario.risk_tolerance.charAt(0).toUpperCase() + scenario.risk_tolerance.slice(1)}
                </span>
              </div>
              <button
                onClick={() => handleUpdateScenario(scenario)}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icon name="Save" size={16} />
                Save
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={scenario.name}
                  onChange={(e) => updateScenarioField(scenario.scenario_id, 'name', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={scenario.monthly_contribution}
                    onChange={(e) => updateScenarioField(scenario.scenario_id, 'monthly_contribution', parseInt(e.target.value))}
                    className="input-field pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Target Retirement Age
                </label>
                <input
                  type="number"
                  min="55"
                  max="75"
                  value={scenario.target_retirement_age}
                  onChange={(e) => updateScenarioField(scenario.scenario_id, 'target_retirement_age', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Risk Tolerance
                </label>
                <select
                  value={scenario.risk_tolerance}
                  onChange={(e) => updateScenarioField(scenario.scenario_id, 'risk_tolerance', e.target.value)}
                  className="input-field"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Annual Growth Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="0.20"
                    value={scenario.annual_growth_rate}
                    onChange={(e) => updateScenarioField(scenario.scenario_id, 'annual_growth_rate', parseFloat(e.target.value))}
                    className="input-field pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                    {(scenario.annual_growth_rate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={scenario.display_order}
                  onChange={(e) => updateScenarioField(scenario.scenario_id, 'display_order', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={scenario.description}
                onChange={(e) => updateScenarioField(scenario.scenario_id, 'description', e.target.value)}
                rows={2}
                className="input-field resize-none"
                placeholder="Brief description of this investment scenario..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Growth Rate Guidelines */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-info-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-info-800 mb-2">Growth Rate Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-info-700">
              <div>
                <div className="font-medium text-green-700 mb-1">Conservative (3-6%)</div>
                <p>Lower risk investments like bonds, CDs, and stable value funds. Suitable for risk-averse investors or those close to retirement.</p>
              </div>
              <div>
                <div className="font-medium text-yellow-700 mb-1">Moderate (6-8%)</div>
                <p>Balanced mix of stocks and bonds. Good for investors with moderate risk tolerance and medium-term horizons.</p>
              </div>
              <div>
                <div className="font-medium text-red-700 mb-1">Aggressive (8-12%)</div>
                <p>Higher allocation to stocks and growth investments. Suitable for younger investors with longer time horizons.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Preview */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Calculator" size={20} className="text-primary" />
          <h4 className="text-lg font-medium text-text-primary">Scenario Impact Preview</h4>
        </div>
        <p className="text-text-secondary mb-4">
          Example calculation for a 35-year-old planning to retire at each scenario's target age:
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-border">
              <tr>
                <th className="px-4 py-2 text-left">Scenario</th>
                <th className="px-4 py-2 text-left">Years to Retire</th>
                <th className="px-4 py-2 text-left">Total Contributions</th>
                <th className="px-4 py-2 text-left">Projected Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {investmentData.map((scenario) => {
                const yearsToRetire = scenario.target_retirement_age - 35;
                const totalContributions = scenario.monthly_contribution * 12 * yearsToRetire;
                const monthlyRate = scenario.annual_growth_rate / 12;
                const months = yearsToRetire * 12;
                const projectedValue = scenario.monthly_contribution * 
                  ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                
                return (
                  <tr key={scenario.scenario_id}>
                    <td className="px-4 py-2 font-medium">{scenario.name}</td>
                    <td className="px-4 py-2">{yearsToRetire} years</td>
                    <td className="px-4 py-2">${totalContributions.toLocaleString()}</td>
                    <td className="px-4 py-2 font-medium text-primary">${Math.round(projectedValue).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsConfig;
