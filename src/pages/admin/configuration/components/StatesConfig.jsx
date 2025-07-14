import React, { useState, useEffect } from 'react';
import { configService } from '../../../../services/configurationService';
import { useToast } from '../../../../components/ui/ToastProvider';
import Icon from '../../../../components/AppIcon';

const StatesConfig = ({ config, onUpdate }) => {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    loadStateData();
  }, []);

  const loadStateData = async () => {
    try {
      const data = await configService.getAllStateConfig();
      setStateData(data);
    } catch (error) {
      console.error('Failed to load state data:', error);
    }
  };

  const handleUpdateState = async (stateCode, stateName, factor) => {
    try {
      setSaving(true);
      await configService.updateStateConfig(
        stateCode,
        stateName,
        parseFloat(factor),
        `Cost of living factor for ${stateName}`
      );
      addToast('State factor updated successfully', 'success');
      await loadStateData();
      onUpdate();
    } catch (error) {
      addToast('Failed to update state factor', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredStates = stateData.filter(state => {
    const matchesSearch = state.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         state.state_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterLevel === 'all' ||
                         (filterLevel === 'high' && state.cost_of_living_factor >= 1.2) ||
                         (filterLevel === 'medium' && state.cost_of_living_factor >= 1.1 && state.cost_of_living_factor < 1.2) ||
                         (filterLevel === 'standard' && state.cost_of_living_factor < 1.1);
    
    return matchesSearch && matchesFilter;
  });

  const getFactorColor = (factor) => {
    if (factor >= 1.2) return 'text-red-600 bg-red-50';
    if (factor >= 1.1) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getFactorLabel = (factor) => {
    if (factor >= 1.2) return 'High Cost';
    if (factor >= 1.1) return 'Medium Cost';
    return 'Standard Cost';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Map" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">State Cost-of-Living Factors</h3>
        </div>
        <p className="text-text-secondary mb-6">
          Geographic adjustment multipliers applied to calculations based on state cost of living.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search States
            </label>
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search by state name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Filter by Level
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="input-field"
            >
              <option value="all">All States</option>
              <option value="high">High Cost (≥1.2)</option>
              <option value="medium">Medium Cost (1.1-1.19)</option>
              <option value="standard">Standard Cost (&lt;1.1)</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-800">High Cost States</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stateData.filter(s => s.cost_of_living_factor >= 1.2).length}
            </p>
            <p className="text-sm text-red-600">Factor ≥ 1.2</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800">Medium Cost States</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stateData.filter(s => s.cost_of_living_factor >= 1.1 && s.cost_of_living_factor < 1.2).length}
            </p>
            <p className="text-sm text-yellow-600">Factor 1.1 - 1.19</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Standard Cost States</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stateData.filter(s => s.cost_of_living_factor < 1.1).length}
            </p>
            <p className="text-sm text-green-600">Factor &lt; 1.1</p>
          </div>
        </div>
      </div>

      {/* States Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Cost Factor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStates.map((state) => (
                <tr key={state.state_code} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">
                      {state.state_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary">
                      {state.state_code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="2.0"
                      value={state.cost_of_living_factor}
                      onChange={(e) => handleUpdateState(state.state_code, state.state_name, e.target.value)}
                      disabled={saving}
                      className="w-20 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getFactorColor(state.cost_of_living_factor)}`}>
                      {getFactorLabel(state.cost_of_living_factor)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {state.cost_of_living_factor === 1.0 ? 'No adjustment' :
                     state.cost_of_living_factor > 1.0 ? 
                     `+${((state.cost_of_living_factor - 1) * 100).toFixed(0)}%` :
                     `${((state.cost_of_living_factor - 1) * 100).toFixed(0)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No states found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-info-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-info-800 mb-2">How State Factors Work</h4>
            <ul className="text-sm text-info-700 space-y-1">
              <li>• <strong>Factor 1.0:</strong> Baseline (no adjustment to calculations)</li>
              <li>• <strong>Factor &gt; 1.0:</strong> Higher cost of living (increases calculated amounts)</li>
              <li>• <strong>Factor &lt; 1.0:</strong> Lower cost of living (decreases calculated amounts)</li>
              <li>• <strong>Applied to:</strong> Hidden benefit opportunities and other location-sensitive calculations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatesConfig;
