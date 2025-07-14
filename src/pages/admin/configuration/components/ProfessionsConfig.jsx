import React, { useState, useEffect } from 'react';
import { configService } from '../../../../services/configurationService';
import { useToast } from '../../../../components/ui/ToastProvider';
import Icon from '../../../../components/AppIcon';

const ProfessionsConfig = ({ config, onUpdate }) => {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [professionData, setProfessionData] = useState([]);

  useEffect(() => {
    loadProfessionData();
  }, []);

  const loadProfessionData = async () => {
    try {
      const data = await configService.getAllProfessionConfig();
      setProfessionData(data);
    } catch (error) {
      console.error('Failed to load profession data:', error);
    }
  };

  const handleUpdateProfession = async (profession, configType, value) => {
    try {
      setSaving(true);
      await configService.updateProfessionConfig(
        profession,
        configType,
        value,
        `${configType.replace('_', ' ')} for ${profession}`
      );
      addToast('Profession setting updated successfully', 'success');
      await loadProfessionData();
      onUpdate();
    } catch (error) {
      addToast('Failed to update profession setting', 'error');
    } finally {
      setSaving(false);
    }
  };

  const professions = [
    { id: 'teacher', name: 'Teacher', icon: 'GraduationCap' },
    { id: 'nurse', name: 'Nurse', icon: 'Heart' },
    { id: 'first-responder', name: 'First Responder', icon: 'Shield' },
    { id: 'state-local-hero', name: 'State/Local Hero', icon: 'Building2' },
  ];

  const getProfessionValue = (profession, configType) => {
    const item = professionData.find(p => p.profession === profession && p.config_type === configType);
    return item ? parseFloat(item.value) : 0;
  };

  return (
    <div className="space-y-8">
      {/* Default Pension Values */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="DollarSign" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Default Pension Values</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Default monthly pension amounts used when users select "I don't know" for their pension estimate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {professions.map((profession) => (
            <div key={profession.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon name={profession.icon} size={18} className="text-primary" />
                <h4 className="font-medium text-text-primary">{profession.name}</h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Monthly Pension Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={getProfessionValue(profession.id, 'default_pension')}
                    onChange={(e) => handleUpdateProfession(profession.id, 'default_pension', e.target.value)}
                    disabled={saving}
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Profession Risk Factors</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Multipliers applied to calculations based on profession-specific risk factors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {professions.map((profession) => (
            <div key={profession.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon name={profession.icon} size={18} className="text-primary" />
                <h4 className="font-medium text-text-primary">{profession.name}</h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Risk Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="2.0"
                  value={getProfessionValue(profession.id, 'risk_factor')}
                  onChange={(e) => handleUpdateProfession(profession.id, 'risk_factor', e.target.value)}
                  disabled={saving}
                  className="input-field"
                />
                <p className="text-xs text-text-secondary mt-1">
                  {getProfessionValue(profession.id, 'risk_factor') === 1.0 ? 'Baseline risk' :
                   getProfessionValue(profession.id, 'risk_factor') > 1.0 ? 
                   `${((getProfessionValue(profession.id, 'risk_factor') - 1) * 100).toFixed(0)}% higher risk` :
                   `${((1 - getProfessionValue(profession.id, 'risk_factor')) * 100).toFixed(0)}% lower risk`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-info-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-info-800 mb-2">How These Settings Work</h4>
            <ul className="text-sm text-info-700 space-y-1">
              <li>• <strong>Default Pension Values:</strong> Used when users don't know their pension estimate</li>
              <li>• <strong>Risk Factors:</strong> Applied as multipliers in various calculations</li>
              <li>• <strong>Risk Factor 1.0:</strong> Baseline (no adjustment)</li>
              <li>• <strong>Risk Factor &gt; 1.0:</strong> Higher risk profession (increases calculations)</li>
              <li>• <strong>Risk Factor &lt; 1.0:</strong> Lower risk profession (decreases calculations)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionsConfig;
