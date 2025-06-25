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

  // Common pension ranges - 4 options covering typical spectrum
  const quickAmounts = [1500, 2500, 3500, 5000];

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
          <div className={`flex items-center justify-between ${mobile ? 'p-5' : 'p-4'} bg-accent-50 rounded-lg border border-accent-200`}>
            <div>
              <p className={`font-medium text-text-primary ${mobile ? 'text-base' : ''}`}>I don't know my pension estimate</p>
              <p className={`text-sm text-text-secondary ${mobile ? 'mt-1' : ''}`}>We'll calculate using profession averages</p>
            </div>
            <button
              onClick={() => onUnknownToggle(!unknown)}
              className={`relative inline-flex ${mobile ? 'h-7 w-12' : 'h-6 w-11'} items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${mobile ? 'mobile-touch-feedback' : ''} ${
                unknown ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block ${mobile ? 'h-5 w-5' : 'h-4 w-4'} transform rounded-full bg-white transition-transform duration-200 ${
                  unknown ? (mobile ? 'translate-x-6' : 'translate-x-6') : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Input Field */}
        {!unknown && (
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="pensionEstimate" className={`block font-medium text-text-primary mb-2 ${mobile ? 'text-base' : ''}`}>
                Monthly pension estimate
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary ${mobile ? 'text-lg' : ''}`}>
                  $
                </span>
                <input
                  id="pensionEstimate"
                  type="number"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="2,500"
                  min="0"
                  max="20000"
                  step="50"
                  className={`${mobile ? 'mobile-input-field text-lg' : 'input-field'} w-full ${mobile ? 'pl-8 pr-4' : 'pl-7 pr-3'} ${
                    error ? 'border-error focus:border-error focus:ring-error-100' : ''
                  } ${mobile ? 'mobile-touch-feedback' : ''}`}
                />
              </div>
              {error && (
                <p className={`mt-2 text-error ${mobile ? 'text-sm' : 'text-xs'} flex items-center gap-1`}>
                  <Icon name="AlertCircle" size={mobile ? 16 : 14} />
                  {error}
                </p>
              )}
            </div>

            {/* Helpful Range Indicator */}
            <div className={`text-center ${mobile ? 'mt-4' : 'mt-3'}`}>
              <p className={`text-text-muted ${mobile ? 'text-sm' : 'text-xs'}`}>
                Typical range: $1,500 - $4,500/month
              </p>
            </div>
          </div>
        )}

        {/* Quick Amount Buttons */}
        {!unknown && (
          <div className={`${mobile ? 'mt-6 mb-8' : 'mb-6'}`}>
            <p className={`font-medium text-text-secondary mb-3 ${mobile ? 'text-sm' : ''}`}>Common Monthly Amounts:</p>
            <div className={`grid ${mobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-3'}`}>
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => onChange(amount.toString())}
                  className={`p-2 rounded-lg transition-all duration-150 text-sm font-medium ${
                    parseInt(value) === amount
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-border hover:border-primary-200 hover:bg-primary-50 text-text-secondary'
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unknown State Display */}
        {unknown && (
          <div className={`${mobile ? 'mt-6' : 'mb-6'} p-4 bg-success-50 rounded-lg border border-success-200`}>
            <div className="flex items-center gap-3">
              <Icon name="Calculator" size={24} className="text-success flex-shrink-0" />
              <div className="flex-1">
                <h4 className={`font-semibold text-success-600 mb-1 ${mobile ? 'text-base' : ''}`}>We'll Calculate For You</h4>
                <p className={`text-sm text-text-secondary ${mobile ? 'mobile-text-readable' : ''}`}>
                  Using industry-standard calculations based on your profession and years of service.
                </p>
                <p className={`text-xs text-text-secondary mt-1 ${mobile ? 'text-sm' : ''}`}>
                  Typical range: {context.averages.low} - {context.averages.high}
                </p>
              </div>
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