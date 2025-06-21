import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AssetInputSection = ({ 
  savings, 
  preferNotToSay, 
  onSavingsChange, 
  onPreferNotToSayChange, 
  profession 
}) => {
  const [inputFocused, setInputFocused] = useState(false);

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleSavingsChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    onSavingsChange(value);
    if (value && preferNotToSay) {
      onPreferNotToSayChange(false);
    }
  };

  const handlePreferNotToSayChange = (checked) => {
    onPreferNotToSayChange(checked);
    if (checked) {
      onSavingsChange('');
    }
  };

  const savingsRanges = [
    { min: 0, max: 25000, label: 'Under $25K', color: 'error', advice: 'Building emergency savings should be a priority' },
    { min: 25000, max: 100000, label: '$25K - $100K', color: 'warning', advice: 'Good start, but may need to accelerate savings' },
    { min: 100000, max: 500000, label: '$100K - $500K', color: 'success', advice: 'Solid foundation for retirement planning' },
    { min: 500000, max: 1000000, label: '$500K - $1M', color: 'primary', advice: 'Strong retirement savings position' },
    { min: 1000000, max: Infinity, label: '$1M+', color: 'primary', advice: 'Excellent retirement preparation' }
  ];

  const getCurrentRange = () => {
    const numericValue = parseInt(savings) || 0;
    return savingsRanges.find(range => numericValue >= range.min && numericValue < range.max);
  };

  const quickAmounts = [
    { amount: 50000, label: '$50K' },
    { amount: 100000, label: '$100K' },
    { amount: 250000, label: '$250K' },
    { amount: 500000, label: '$500K' },
    { amount: 750000, label: '$750K' },
    { amount: 1000000, label: '$1M' }
  ];

  const professionContext = {
    teacher: {
      context: "Teachers often have 403(b) plans and may have limited investment options",
      tip: "Consider both your 403(b) and any personal retirement accounts"
    },
    nurse: {
      context: "Healthcare workers may have 401(k) or 403(b) plans depending on employer",
      tip: "Include all retirement accounts, HSAs, and personal savings"
    },
    'first-responder': {
      context: "First responders often have deferred compensation plans and DROP programs",
      tip: "Include pension DROP accounts and any supplemental retirement savings"
    },
    'government-employee': {
      context: "Government employees typically have TSP (federal) or 457 plans (state/local)",
      tip: "Include your TSP/457 balance and any additional retirement accounts"
    }
  };

  const currentContext = professionContext[profession] || professionContext.teacher;
  const currentRange = getCurrentRange();

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="PiggyBank" size={24} className="text-success" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-2">
            Current Retirement Assets
          </h2>
          <p className="text-text-secondary">
            What's the approximate value of your current retirement savings?
          </p>
        </div>
      </div>

      {/* Context Information */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-success flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-success-700 mb-2">{currentContext.context}</p>
            <p className="text-success-600 font-medium">{currentContext.tip}</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        {/* Main Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Total Retirement Savings
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="DollarSign" size={20} className="text-text-secondary" />
            </div>
            <input
              type="text"
              value={savings ? formatCurrency(savings) : ''}
              onChange={handleSavingsChange}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              disabled={preferNotToSay}
              placeholder="Enter amount (e.g., $250,000)"
              className={`input-field pl-10 pr-4 py-3 text-lg font-semibold w-full transition-all duration-200 ${
                inputFocused ? 'ring-2 ring-primary-200 border-primary' : ''
              } ${
                preferNotToSay ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        {!preferNotToSay && (
          <div>
            <p className="text-sm font-medium text-text-secondary mb-3">Quick select:</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {quickAmounts.map((item) => (
                <button
                  key={item.amount}
                  onClick={() => onSavingsChange(item.amount.toString())}
                  className={`p-2 rounded-lg border transition-all duration-150 text-sm font-medium ${
                    parseInt(savings) === item.amount
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-200 hover:bg-primary-50 text-text-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prefer Not to Say Option */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="preferNotToSay"
            checked={preferNotToSay}
            onChange={(e) => handlePreferNotToSayChange(e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary-200 border-gray-300 rounded"
          />
          <label htmlFor="preferNotToSay" className="text-sm font-medium text-text-primary cursor-pointer">
            I prefer not to share this information
          </label>
        </div>

        {/* Range Feedback */}
        {savings && !preferNotToSay && currentRange && (
          <div className={`p-4 rounded-lg border ${
            currentRange.color === 'error' ? 'bg-error-50 border-error-200' :
            currentRange.color === 'warning' ? 'bg-warning-50 border-warning-200' :
            currentRange.color === 'success'? 'bg-success-50 border-success-200' : 'bg-primary-50 border-primary-200'
          }`}>
            <div className="flex items-start gap-3">
              <Icon 
                name={
                  currentRange.color === 'error' ? 'AlertTriangle' :
                  currentRange.color === 'warning' ? 'Clock' :
                  currentRange.color === 'success' ? 'CheckCircle' : 'TrendingUp'
                } 
                size={18} 
                className={`flex-shrink-0 mt-0.5 ${
                  currentRange.color === 'error' ? 'text-error' :
                  currentRange.color === 'warning' ? 'text-warning' :
                  currentRange.color === 'success' ? 'text-success' : 'text-primary'
                }`} 
              />
              <div className="text-sm">
                <h4 className={`font-semibold mb-1 ${
                  currentRange.color === 'error' ? 'text-error-600' :
                  currentRange.color === 'warning' ? 'text-warning-600' :
                  currentRange.color === 'success' ? 'text-success-600' : 'text-primary-600'
                }`}>
                  {currentRange.label} Range
                </h4>
                <p className={`${
                  currentRange.color === 'error' ? 'text-error-700' :
                  currentRange.color === 'warning' ? 'text-warning-700' :
                  currentRange.color === 'success' ? 'text-success-700' : 'text-primary-700'
                }`}>
                  {currentRange.advice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Assurance */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Icon name="Lock" size={18} className="text-primary" />
            <div className="text-sm">
              <h4 className="font-semibold text-primary-600 mb-1">Your Information is Secure</h4>
              <p className="text-primary-700">
                This information is used only for your personalized analysis and is never shared with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Assets Note */}
        <div className="text-center text-sm text-text-secondary">
          <p>
            Include: 401(k), 403(b), 457, TSP, IRA, Roth IRA, and other retirement accounts
          </p>
          <p className="mt-1">
            Exclude: Primary residence, Social Security, and pension values
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetInputSection;