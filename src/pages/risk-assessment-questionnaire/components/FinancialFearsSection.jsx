import React from 'react';
import Icon from 'components/AppIcon';

const FinancialFearsSection = ({ value, onChange, profession }) => {
  const professionSpecificFears = {
    teacher: [
      { id: 'pension-cuts', label: 'Pension benefit reductions', icon: 'Scissors', priority: 'high' },
      { id: 'summer-income', label: 'Summer income gaps', icon: 'Sun', priority: 'medium' },
      { id: 'healthcare-retirement', label: 'Healthcare costs in retirement', icon: 'Heart', priority: 'high' }
    ],
    nurse: [
      { id: 'shift-work-impact', label: 'Impact of shift work on health', icon: 'Clock', priority: 'high' },
      { id: 'burnout-early-retirement', label: 'Burnout forcing early retirement', icon: 'Flame', priority: 'high' },
      { id: 'nurse-healthcare-costs', label: 'Rising healthcare expenses', icon: 'TrendingUp', priority: 'medium' }
    ],
    'first-responder': [
      { id: 'disability-risk', label: 'Disability from line of duty', icon: 'Shield', priority: 'high' },
      { id: 'ptsd-impact', label: 'PTSD affecting work capacity', icon: 'Brain', priority: 'high' },
      { id: 'early-retirement-health', label: 'Health issues forcing early retirement', icon: 'Heart', priority: 'medium' }
    ],
    'government-employee': [
      { id: 'pension-reform', label: 'Government pension reforms', icon: 'Building2', priority: 'high' },
      { id: 'job-security', label: 'Budget cuts affecting job security', icon: 'Briefcase', priority: 'medium' },
      { id: 'benefit-changes', label: 'Changes to benefit packages', icon: 'FileText', priority: 'medium' }
    ]
  };

  const commonFears = [
    { id: 'market-volatility', label: 'Market volatility affecting investments', icon: 'TrendingDown', priority: 'high' },
    { id: 'inflation', label: 'Inflation eroding purchasing power', icon: 'TrendingUp', priority: 'high' },
    { id: 'longevity-risk', label: 'Outliving my retirement savings', icon: 'Clock', priority: 'high' },
    { id: 'healthcare-costs', label: 'Unexpected healthcare expenses', icon: 'Heart', priority: 'high' },
    { id: 'family-support', label: 'Supporting adult children financially', icon: 'Users', priority: 'medium' },
    { id: 'long-term-care', label: 'Long-term care costs', icon: 'Home', priority: 'medium' },
    { id: 'tax-increases', label: 'Tax increases in retirement', icon: 'Receipt', priority: 'medium' },
    { id: 'social-security', label: 'Social Security benefit reductions', icon: 'DollarSign', priority: 'medium' },
    { id: 'emergency-fund', label: 'Lack of emergency savings', icon: 'AlertTriangle', priority: 'low' },
    { id: 'debt-retirement', label: 'Carrying debt into retirement', icon: 'CreditCard', priority: 'low' }
  ];

  const professionFears = professionSpecificFears[profession] || [];
  const allFears = [...professionFears, ...commonFears];

  const toggleFear = (fearId) => {
    const newValue = value.includes(fearId)
      ? value.filter(id => id !== fearId)
      : [...value, fearId];
    onChange(newValue);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error-200 hover:border-error bg-error-50 hover:bg-error-100';
      case 'medium': return 'border-warning-200 hover:border-warning bg-warning-50 hover:bg-warning-100';
      case 'low': return 'border-primary-200 hover:border-primary bg-primary-50 hover:bg-primary-100';
      default: return 'border-border hover:border-primary-200 bg-surface hover:bg-primary-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-primary';
      default: return 'text-text-secondary';
    }
  };

  const getSelectedColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error bg-error-100 shadow-md';
      case 'medium': return 'border-warning bg-warning-100 shadow-md';
      case 'low': return 'border-primary bg-primary-100 shadow-md';
      default: return 'border-primary bg-primary-100 shadow-md';
    }
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="AlertTriangle" size={24} className="text-error" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-2">
            Financial Concerns
          </h2>
          <p className="text-text-secondary">
            Select all financial concerns that worry you about retirement. (Choose at least one)
          </p>
        </div>
      </div>

      {/* Selection Counter */}
      <div className="mb-6 p-3 bg-primary-50 border border-primary-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            {value.length} concern{value.length !== 1 ? 's' : ''} selected
          </span>
          {value.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="text-sm text-primary hover:text-primary-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Profession-Specific Fears */}
      {professionFears.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Icon name="Star" size={18} className="text-accent" />
            Common {profession.replace('-', ' ')} concerns
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {professionFears.map((fear) => (
              <button
                key={fear.id}
                onClick={() => toggleFear(fear.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  value.includes(fear.id)
                    ? getSelectedColor(fear.priority)
                    : getPriorityColor(fear.priority)
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    value.includes(fear.id)
                      ? 'border-white bg-white' :'border-gray-300'
                  }`}>
                    {value.includes(fear.id) && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={fear.icon} size={16} className={getPriorityIcon(fear.priority)} />
                      <span className="text-sm font-medium text-text-primary">
                        {fear.label}
                      </span>
                    </div>
                    {fear.priority === 'high' && (
                      <div className="text-xs text-error-600 font-medium">High Priority</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Common Financial Fears */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          General retirement concerns
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonFears.map((fear) => (
            <button
              key={fear.id}
              onClick={() => toggleFear(fear.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                value.includes(fear.id)
                  ? getSelectedColor(fear.priority)
                  : getPriorityColor(fear.priority)
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  value.includes(fear.id)
                    ? 'border-white bg-white' :'border-gray-300'
                }`}>
                  {value.includes(fear.id) && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={fear.icon} size={16} className={getPriorityIcon(fear.priority)} />
                    <span className="text-sm font-medium text-text-primary">
                      {fear.label}
                    </span>
                  </div>
                  {fear.priority === 'high' && (
                    <div className="text-xs text-error-600 font-medium">High Priority</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Level Indicator */}
      {value.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-error-50 to-warning-50 border border-error-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name="TrendingUp" size={20} className="text-error" />
            <div>
              <h4 className="font-semibold text-error-600">
                {value.length >= 5 ? 'High Risk Profile' : 
                 value.length >= 3 ? 'Moderate Risk Profile' : 'Low Risk Profile'}
              </h4>
              <p className="text-sm text-error-700">
                {value.length >= 5 
                  ? 'Multiple concerns indicate significant retirement planning needs.'
                  : value.length >= 3
                  ? 'Several concerns suggest focused planning is beneficial.' :'Your concerns are manageable with proper planning.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Message */}
      {value.length === 0 && (
        <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name="AlertTriangle" size={18} className="text-warning" />
            <p className="text-sm text-warning-700">
              Please select at least one financial concern to continue with your assessment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialFearsSection;