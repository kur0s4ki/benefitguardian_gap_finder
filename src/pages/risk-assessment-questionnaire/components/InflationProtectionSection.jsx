import React from 'react';
import Icon from 'components/AppIcon';

const InflationProtectionSection = ({ value, onChange, profession }) => {
  const professionData = {
    teacher: {
      context: "Many teacher pension plans lack automatic cost-of-living adjustments",
      risk: "Your purchasing power could decrease by 30-50% over retirement"
    },
    nurse: {
      context: "Healthcare worker pensions often have limited inflation protection",
      risk: "Medical costs typically rise faster than general inflation"
    },
    'first-responder': {
      context: "Public safety pensions may not fully protect against inflation",
      risk: "Fixed benefits lose value as living costs increase over time"
    },
    'government-employee': {
      context: "Government pensions vary widely in inflation protection features",
      risk: "Without protection, your pension\'s buying power erodes annually"
    }
  };

  const currentData = professionData[profession] || professionData.teacher;

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="TrendingUp" size={24} className="text-warning" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-2">
            Inflation Protection Status
          </h2>
          <p className="text-text-secondary">
            Does your pension include automatic cost-of-living adjustments (COLA)?
          </p>
        </div>
      </div>

      {/* Context Information */}
      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-warning-700 mb-2">{currentData.context}</p>
            <p className="text-warning-600 font-medium">{currentData.risk}</p>
          </div>
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <button
          onClick={() => onChange(true)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            value === true
              ? 'border-success bg-success-50 shadow-md'
              : 'border-border hover:border-success-200 hover:bg-success-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                value === true
                  ? 'border-success bg-success text-white' :'border-gray-300'
              }`}>
                {value === true && <Icon name="Check" size={16} />}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Yes, I have COLA protection</h3>
                <p className="text-sm text-text-secondary">My pension adjusts for inflation automatically</p>
              </div>
            </div>
            <Icon name="Shield" size={20} className="text-success" />
          </div>
        </button>

        <button
          onClick={() => onChange(false)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            value === false
              ? 'border-error bg-error-50 shadow-md'
              : 'border-border hover:border-error-200 hover:bg-error-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                value === false
                  ? 'border-error bg-error text-white' :'border-gray-300'
              }`}>
                {value === false && <Icon name="Check" size={16} />}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">No, my pension is fixed</h3>
                <p className="text-sm text-text-secondary">My benefits don't adjust for inflation</p>
              </div>
            </div>
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
        </button>

        <button
          onClick={() => onChange(null)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            value === null
              ? 'border-warning bg-warning-50 shadow-md'
              : 'border-border hover:border-warning-200 hover:bg-warning-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                value === null
                  ? 'border-warning bg-warning text-white' :'border-gray-300'
              }`}>
                {value === null && <Icon name="Check" size={16} />}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">I'm not sure</h3>
                <p className="text-sm text-text-secondary">I need help understanding my pension benefits</p>
              </div>
            </div>
            <Icon name="HelpCircle" size={20} className="text-warning" />
          </div>
        </button>
      </div>

      {/* Risk Indicator */}
      {value === false && (
        <div className="mt-6 p-4 bg-error-50 border border-error-200 rounded-lg animate-pulse">
          <div className="flex items-center gap-3">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <div>
              <h4 className="font-semibold text-error-600">High Inflation Risk Detected</h4>
              <p className="text-sm text-error-700">
                Without COLA protection, your pension could lose significant purchasing power over time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InflationProtectionSection;