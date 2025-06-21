import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PensionEstimateInput = ({ 
  value, 
  unknown, 
  onChange, 
  onUnknownToggle, 
  error, 
  profession, 
  mobile = false 
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    onChange(inputValue);
  };

  const formatCurrency = (val) => {
    if (!val) return '';
    const number = parseFloat(val);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getProfessionContext = () => {
    const contexts = {
      teacher: {
        title: 'Monthly Pension Estimate',
        description: 'Your expected monthly pension payment from your teacher retirement system',
        averages: {
          low: '$2,200',
          average: '$3,800',
          high: '$5,500'
        },
        helpText: `Your pension estimate can typically be found on:
• Annual benefit statements from your state teacher retirement system
• Online retirement portal or member account
• HR department pension calculators
• Recent pension projection reports

If you're unsure, we'll use state averages based on your years of service to provide accurate calculations.`
      },
      nurse: {
        title: 'Monthly Pension Estimate',
        description: 'Your expected monthly pension payment from your healthcare retirement plan',
        averages: {
          low: '$1,900',
          average: '$3,200',
          high: '$4,800'
        },
        helpText: `Your pension estimate can typically be found on:
• Hospital or healthcare system retirement statements
• State public employee retirement system documents
• Union pension plan summaries
• HR benefits portal

If you're unsure, we'll use healthcare industry averages to provide accurate calculations.`
      },
      'first-responder': {
        title: 'Monthly Pension Estimate',
        description: 'Your expected monthly pension payment from your public safety retirement system',
        averages: {
          low: '$2,800',
          average: '$4,500',
          high: '$6,200'
        },
        helpText: `Your pension estimate can typically be found on:
• Police or fire department retirement statements
• State public safety retirement system documents
• Annual pension benefit summaries
• Department HR pension calculators

If you're unsure, we'll use public safety averages to provide accurate calculations.`
      },
      'government-employee': {
        title: 'Monthly Pension Estimate',
        description: 'Your expected monthly pension payment from your government retirement system',
        averages: {
          low: '$2,100',
          average: '$3,600',
          high: '$5,100'
        },
        helpText: `Your pension estimate can typically be found on:
• State or local government retirement statements
• Public employee retirement system documents
• Annual benefit statements
• Government HR pension portals

If you're unsure, we'll use government employee averages to provide accurate calculations.`
      }
    };
    return contexts[profession] || contexts.teacher;
  };

  const context = getProfessionContext();

  return (
    <div className={`${mobile ? 'flex-1 flex flex-col' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-1">
            {context.title}
          </h3>
          <p className="text-text-secondary text-sm">
            {context.description}
          </p>
        </div>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-full hover:bg-primary-50 transition-colors duration-150"
          aria-label="Show help information"
        >
          <Icon name="HelpCircle" size={20} className="text-primary" />
        </button>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h4 className="font-medium text-primary mb-3">Where to Find Your Pension Estimate:</h4>
          <div className="text-sm text-text-secondary whitespace-pre-line">
            {context.helpText}
          </div>
        </div>
      )}

      <div className={`${mobile ? 'flex-1 flex flex-col justify-center' : ''}`}>
        {/* Toggle Switch */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg border border-accent-200">
            <div>
              <p className="font-medium text-text-primary">I don't know my pension estimate</p>
              <p className="text-sm text-text-secondary">We'll calculate using profession averages</p>
            </div>
            <button
              onClick={() => onUnknownToggle(!unknown)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                unknown ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  unknown ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {!unknown ? (
          <>
            {/* Manual Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Monthly Pension Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-secondary text-lg">$</span>
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={handleInputChange}
                  placeholder="3,500"
                  className={`input-field w-full pl-8 pr-4 py-4 text-lg font-medium ${
                    mobile ? 'text-center' : ''
                  } ${error ? 'border-error focus:border-error focus:ring-error-100' : ''}`}
                />
              </div>
              {value && (
                <p className="mt-2 text-sm text-text-secondary">
                  Monthly estimate: {formatCurrency(value)}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <p className="text-sm font-medium text-text-secondary mb-3">Common Ranges:</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(context.averages).map(([level, amount]) => (
                  <button
                    key={level}
                    onClick={() => onChange(amount.replace(/[$,]/g, ''))}
                    className="p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-150 text-center"
                  >
                    <div className="text-sm font-medium text-primary capitalize">{level}</div>
                    <div className="text-lg font-bold text-primary">{amount}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Unknown State Display */
          <div className="mb-6 p-6 bg-success-50 rounded-lg border border-success-200 text-center">
            <Icon name="Calculator" size={48} className="text-success mx-auto mb-4" />
            <h4 className="font-semibold text-success-600 mb-2">We'll Calculate For You</h4>
            <p className="text-text-secondary">
              Based on your profession and years of service, we'll use industry-standard pension calculations 
              to provide accurate retirement projections.
            </p>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm text-text-secondary">
                Typical range for your profession: {context.averages.low} - {context.averages.high}
              </p>
            </div>
          </div>
        )}

        {/* Confidence Indicator */}
        <div className="p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Shield" size={18} className="text-secondary" />
            <span className="font-medium text-secondary">Calculation Accuracy</span>
          </div>
          <p className="text-sm text-text-secondary">
            {unknown 
              ? 'Using profession averages provides 85% accuracy for initial projections.'
              : 'Your specific pension amount provides 95% accuracy for projections.'
            }
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
            <span className="text-sm text-error-600">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PensionEstimateInput;