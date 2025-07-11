import React, { useState } from 'react';
import { configService } from '../../../../services/configurationService';
import { useToast } from '../../../../components/ui/ToastProvider';
import Icon from '../../../../components/AppIcon';

const CalculationsConfig = ({ config, onUpdate }) => {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const gapRates = config?.GAP_RATES || {};
  const coverageLevels = config?.COVERAGE_LEVELS || {};
  const colaValues = config?.COLA_VALUES || {};
  const calculationConstants = config?.CALCULATION_CONSTANTS || {};
  const retirementConversion = config?.YEARS_UNTIL_RETIREMENT_CONVERSION || {};

  const handleUpdateGapRate = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'gap_calculations',
        `${key}_gap_rate`,
        parseFloat(value),
        'number',
        `${key.charAt(0).toUpperCase() + key.slice(1)} gap calculation rate`,
        `${key.charAt(0).toUpperCase() + key.slice(1)} Gap Rate`
      );
      addToast('Gap rate updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update gap rate', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCoverageLevel = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'coverage_levels',
        key,
        parseFloat(value),
        'number',
        `Multiplier when ${key.replace('_', ' ')}`,
        `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Multiplier`
      );
      addToast('Coverage level updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update coverage level', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateColaValue = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'cola_values',
        key,
        parseInt(value),
        'number',
        `Value when ${key.replace('_', ' ')} COLA protection`,
        `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Value`
      );
      addToast('COLA value updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update COLA value', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateConstant = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'calculation_constants',
        key,
        parseFloat(value),
        'number',
        `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
        `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`
      );
      addToast('Calculation constant updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update calculation constant', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRetirementConversion = async (key, value) => {
    try {
      setSaving(true);
      await configService.updateCoreConfig(
        'retirement_conversion',
        `years_${key.replace('-', '_').replace('+', '_plus')}`,
        parseInt(value),
        'number',
        `Average years for ${key} band`,
        `${key} Years Band`
      );
      addToast('Retirement conversion updated successfully', 'success');
      onUpdate();
    } catch (error) {
      addToast('Failed to update retirement conversion', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Gap Calculation Rates */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Calculator" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Gap Calculation Rates</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Percentage rates used to calculate different types of benefit gaps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Pension Gap Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={gapRates.pension || 0.03}
                onChange={(e) => handleUpdateGapRate('pension', e.target.value)}
                disabled={saving}
                className="input-field pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                {((gapRates.pension || 0.03) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Formula: Current Pension × Rate × Years of Service
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tax Torpedo Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={gapRates.tax || 0.3}
                onChange={(e) => handleUpdateGapRate('tax', e.target.value)}
                disabled={saving}
                className="input-field pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                {((gapRates.tax || 0.3) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Formula: Other Savings × Rate
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Survivor Gap Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={gapRates.survivor || 0.4}
                onChange={(e) => handleUpdateGapRate('survivor', e.target.value)}
                disabled={saving}
                className="input-field pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                {((gapRates.survivor || 0.4) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Formula: Current Pension × Rate
            </p>
          </div>
        </div>
      </div>

      {/* Coverage Levels */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Survivor Coverage Levels</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Multipliers applied based on survivor benefit coverage status.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Has Coverage Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={coverageLevels.yes || 0.3}
              onChange={(e) => handleUpdateCoverageLevel('has_coverage', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Applied when user has survivor coverage
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              No Coverage Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={coverageLevels.no || 1.0}
              onChange={(e) => handleUpdateCoverageLevel('no_coverage', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Applied when user has no survivor coverage
            </p>
          </div>
        </div>
      </div>

      {/* COLA Values */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">COLA (Cost of Living Adjustment) Values</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Values used in pension risk calculations based on COLA protection status.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Has COLA Value
            </label>
            <input
              type="number"
              min="0"
              max="2"
              value={colaValues.yes || 1}
              onChange={(e) => handleUpdateColaValue('has_cola', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Reduces pension risk by 30 points when = 1
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              No COLA Value
            </label>
            <input
              type="number"
              min="0"
              max="2"
              value={colaValues.no || 0}
              onChange={(e) => handleUpdateColaValue('no_cola', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              No risk reduction when = 0
            </p>
          </div>
        </div>
      </div>

      {/* Calculation Constants */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Hash" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Calculation Constants</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Core constants used throughout the calculation engine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Hidden Benefit Base Amount
            </label>
            <input
              type="number"
              min="0"
              value={calculationConstants.hidden_benefit_base || 1800}
              onChange={(e) => handleUpdateConstant('hidden_benefit_base', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Base amount for hidden benefit opportunity calculation
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Maximum Service Years
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={calculationConstants.max_service_years || 28}
              onChange={(e) => handleUpdateConstant('max_service_years', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Used as divisor in hidden benefit calculation
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Lifetime Payout Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={calculationConstants.lifetime_multiplier || 3.0}
              onChange={(e) => handleUpdateConstant('lifetime_multiplier', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Multiplier for lifetime payout calculation
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Monthly to 20-Year Conversion
            </label>
            <input
              type="number"
              min="1"
              value={calculationConstants.monthly_to_20year || 240}
              onChange={(e) => handleUpdateConstant('monthly_to_20year', e.target.value)}
              disabled={saving}
              className="input-field"
            />
            <p className="text-xs text-text-secondary mt-1">
              Months in 20 years (20 × 12 = 240)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationsConfig;
