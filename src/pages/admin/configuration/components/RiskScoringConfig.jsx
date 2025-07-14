import React, { useState } from 'react';
import { configService } from '../../../../services/configurationService';
import { useToast } from '../../../../components/ui/ToastProvider';
import Icon from '../../../../components/AppIcon';

const RiskScoringConfig = ({ config, onUpdate }) => {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const riskWeights = config?.RISK_WEIGHTS || {};
  const riskThresholds = config?.RISK_THRESHOLDS || {};
  const riskBonuses = config?.RISK_BONUSES || {};

  const handleUpdateWeight = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'risk_scoring',
        `${key}_weight`,
        parseFloat(value),
        'number',
        `Weight for ${key} risk in overall score`,
        `${key.charAt(0).toUpperCase() + key.slice(1)} Risk Weight`
      );
      addToast('Risk weight updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update risk weight', 'error');
    } finally {
      setSaving(false);
    }
  };

  const validateThresholds = (lowValue, moderateValue) => {
    const low = parseInt(lowValue);
    const moderate = parseInt(moderateValue);

    if (isNaN(low) || isNaN(moderate)) {
      return { valid: false, message: 'Threshold values must be valid numbers' };
    }

    if (low < 0 || low > 100 || moderate < 0 || moderate > 100) {
      return { valid: false, message: 'Threshold values must be between 0 and 100' };
    }

    if (low >= moderate) {
      return { valid: false, message: 'Low risk threshold must be less than moderate risk threshold' };
    }

    if (moderate >= 100) {
      return { valid: false, message: 'Moderate risk threshold must be less than 100 to allow for high risk category' };
    }

    return { valid: true, message: '' };
  };

  const handleUpdateThreshold = async (key, value) => {
    try {
      setSaving(true);

      // Get current values for validation
      const currentLow = key === 'low' ? parseInt(value) : (riskThresholds.low || 39);
      const currentModerate = key === 'moderate' ? parseInt(value) : (riskThresholds.moderate || 69);

      // Validate thresholds
      const validation = validateThresholds(currentLow, currentModerate);
      if (!validation.valid) {
        addToast(validation.message, 'error');
        setSaving(false);
        return;
      }

      await configService.updateCoreConfig(
        'risk_thresholds',
        `${key}_risk_max`,
        parseInt(value),
        'number',
        `Maximum score for ${key} risk category`,
        `${key.charAt(0).toUpperCase() + key.slice(1)} Risk Threshold`
      );
      addToast('Risk threshold updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update risk threshold', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBonus = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'risk_bonuses',
        `${key}_bonus`,
        parseInt(value),
        'number',
        `Additional risk points for ${key.replace('_', ' ')}`,
        `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Bonus`
      );
      addToast('Risk bonus updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update risk bonus', 'error');
    } finally {
      setSaving(false);
    }
  };

  const totalWeight = (riskWeights.pension || 0.5) + (riskWeights.tax || 0.3) + (riskWeights.survivor || 0.2);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.01;

  // Validate current threshold values
  const currentLow = riskThresholds.low || 39;
  const currentModerate = riskThresholds.moderate || 69;
  const thresholdValidation = validateThresholds(currentLow, currentModerate);
  const areThresholdsValid = thresholdValidation.valid;

  return (
    <div className="space-y-8">
      {/* Risk Weights */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Target" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Risk Score Weights</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Configure how different risk components contribute to the overall risk score.
          Total should equal 1.0 (100%).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Pension Risk Weight
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={riskWeights.pension || 0.5}
              onChange={(e) => handleUpdateWeight('pension', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Currently: {((riskWeights.pension || 0.5) * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tax Risk Weight
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={riskWeights.tax || 0.3}
              onChange={(e) => handleUpdateWeight('tax', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Currently: {((riskWeights.tax || 0.3) * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Survivor Risk Weight
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={riskWeights.survivor || 0.2}
              onChange={(e) => handleUpdateWeight('survivor', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Currently: {((riskWeights.survivor || 0.2) * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded border ${
          isWeightValid 
            ? 'bg-success-50 border-success-200' 
            : 'bg-warning-50 border-warning-200'
        }`}>
          <p className={`text-sm ${
            isWeightValid ? 'text-success-800' : 'text-warning-800'
          }`}>
            <strong>Total Weight:</strong> {totalWeight.toFixed(3)}
            {isWeightValid ? ' ✓ Valid' : ' ⚠️ Should equal 1.0'}
          </p>
        </div>
      </div>

      {/* Risk Thresholds */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Risk Thresholds</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Set the score boundaries that determine risk level categories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Low Risk Maximum Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={riskThresholds.low || 39}
              onChange={(e) => handleUpdateThreshold('low', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Scores 0-{riskThresholds.low || 39} = Low Risk (Green)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Moderate Risk Maximum Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={riskThresholds.moderate || 69}
              onChange={(e) => handleUpdateThreshold('moderate', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Scores {(riskThresholds.low || 39) + 1}-{riskThresholds.moderate || 69} = Moderate Risk (Yellow)
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-info-50 border border-info-200 rounded">
          <p className="text-sm text-info-800">
            <strong>High Risk:</strong> Scores {(riskThresholds.moderate || 69) + 1}-100 = High Risk (Red)
          </p>
        </div>

        {/* Validation Feedback */}
        {!areThresholdsValid && (
          <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <p className="text-sm text-error-800 font-medium">
                Validation Error: {thresholdValidation.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Risk Bonuses */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Plus" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Risk Bonuses</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Additional risk points added for specific conditions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Early Retirement Bonus
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={riskBonuses.early_retirement || 20}
              onChange={(e) => handleUpdateBonus('early_retirement', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Added when retirement age is 55-62
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tax Surprises Bonus
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={riskBonuses.tax_surprises || 30}
              onChange={(e) => handleUpdateBonus('tax_surprises', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Added when user selects tax surprises as a concern
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScoringConfig;
