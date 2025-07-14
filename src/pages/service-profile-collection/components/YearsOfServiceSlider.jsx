import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const YearsOfServiceSlider = ({ 
  value, 
  onChange, 
  error, 
  profession, 
  mobile = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSliderChange = (e) => {
    onChange(parseInt(e.target.value));
  };

  const getProfessionContext = () => {
    const contexts = {
      teacher: {
        title: 'Years in Education',
        description: 'Include all years teaching in public schools, colleges, or universities',
        examples: ['K-12 teaching experience', 'Higher education positions', 'Administrative roles in education']
      },
      nurse: {
        title: 'Years in Healthcare',
        description: 'Include all years working in hospitals, clinics, or healthcare facilities',
        examples: ['Hospital nursing experience', 'Clinic and outpatient care', 'Healthcare administration']
      },
      'first-responder': {
        title: 'Years of Service',
        description: 'Include all years in emergency services and public safety',
        examples: ['Police department service', 'Fire department experience', 'Emergency medical services']
      },
      'government-employee': {
        title: 'Years in Public Service',
        description: 'Include all years working for state, local, or federal government',
        examples: ['State government positions', 'Local municipality roles', 'Federal service time']
      }
    };
    return contexts[profession] || contexts.teacher;
  };

  const context = getProfessionContext();
  const percentage = ((value - 5) / (40 - 5)) * 100;

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
          onClick={() => setShowTooltip(!showTooltip)}
          className="p-2 rounded-full hover:bg-primary-50 transition-colors duration-150"
          aria-label="Show help information"
        >
          <Icon name="HelpCircle" size={20} className="text-primary" />
        </button>
      </div>

      {/* Help Tooltip */}
      {showTooltip && (
        <div className="mb-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h4 className="font-medium text-primary mb-2">What to Include:</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            {context.examples.map((example, index) => (
              <li key={index} className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Slider Section */}
      <div className={`${mobile ? 'flex-1 flex flex-col justify-center' : ''}`}>
        {/* Current Value Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-lg mb-2">
            <span className="text-2xl font-bold text-white">{value}</span>
          </div>
          <p className="text-lg font-medium text-text-primary">
            {value === 1 ? 'Year' : 'Years'} of Service
          </p>
        </div>

        {/* Slider */}
        <div className="relative mb-6">
          <input
            type="range"
            min="5"
            max="40"
            value={value}
            onChange={handleSliderChange}
            className="w-full h-3 bg-primary-100 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-primary-100) ${percentage}%, var(--color-primary-100) 100%)`
            }}
          />
          
          {/* Slider Labels */}
          <div className="flex justify-between text-sm text-text-secondary mt-2">
            <span className="flex flex-col items-center">
              <span className="font-medium">5</span>
              <span className="text-xs">Min</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="font-medium">22</span>
              <span className="text-xs">Average</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="font-medium">40</span>
              <span className="text-xs">Max</span>
            </span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[10, 20, 30].map((years) => (
            <button
              key={years}
              onClick={() => onChange(years)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors duration-150 ${
                value === years
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-border hover:border-primary-200 hover:bg-primary-50 text-text-secondary'
              }`}
            >
              {years} Years
            </button>
          ))}
        </div>

        {/* Retirement Eligibility Indicator */}
        <div className="p-4 bg-success-50 rounded-lg border border-success-200">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Award" size={18} className="text-success" />
            <span className="font-medium text-success-600">Retirement Eligibility</span>
          </div>
          <p className="text-sm text-text-secondary">
            {value >= 25 
              ? `With ${value} years of service, you may be eligible for full retirement benefits.`
              : `You'll need ${25 - value} more years for typical full retirement eligibility.`
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

      <style jsx="true">{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default YearsOfServiceSlider;