import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RetirementAgeSection = ({ value, onChange, profession }) => {
  const [isDragging, setIsDragging] = useState(false);

  const professionData = {
    teacher: {
      context: "Teachers often have specific retirement eligibility rules (Rule of 80/85)",
      earlyAge: 55,
      normalAge: 65,
      lateAge: 70
    },
    nurse: {
      context: "Healthcare workers may retire earlier due to physical demands",
      earlyAge: 55,
      normalAge: 62,
      lateAge: 67
    },
    'first-responder': {
      context: "First responders often have earlier retirement eligibility",
      earlyAge: 50,
      normalAge: 55,
      lateAge: 62
    },
    'government-employee': {
      context: "Government employees have various retirement systems (FERS, CSRS)",
      earlyAge: 57,
      normalAge: 62,
      lateAge: 67
    }
  };

  const currentData = professionData[profession] || professionData.teacher;

  const getAgeCategory = (age) => {
    if (age <= currentData.earlyAge) return 'early';
    if (age <= currentData.normalAge) return 'normal';
    return 'late';
  };

  const getAgeColor = (age) => {
    const category = getAgeCategory(age);
    switch (category) {
      case 'early': return 'text-warning';
      case 'normal': return 'text-success';
      case 'late': return 'text-primary';
      default: return 'text-text-primary';
    }
  };

  const getAgeBackground = (age) => {
    const category = getAgeCategory(age);
    switch (category) {
      case 'early': return 'bg-warning';
      case 'normal': return 'bg-success';
      case 'late': return 'bg-primary';
      default: return 'bg-gray-400';
    }
  };

  const getAgeLabel = (age) => {
    const category = getAgeCategory(age);
    switch (category) {
      case 'early': return 'Early Retirement';
      case 'normal': return 'Normal Retirement';
      case 'late': return 'Delayed Retirement';
      default: return 'Retirement Age';
    }
  };

  const getAgeAdvice = (age) => {
    const category = getAgeCategory(age);
    switch (category) {
      case 'early': 
        return 'Early retirement may result in reduced benefits but more years to enjoy retirement.';
      case 'normal': 
        return 'Normal retirement age typically provides full pension benefits.';
      case 'late': 
        return 'Delayed retirement often increases pension benefits and reduces the gap.';
      default: 
        return '';
    }
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="Calendar" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-2">
            Retirement Timeline
          </h2>
          <p className="text-text-secondary">
            When do you plan to retire? This affects your benefit calculations.
          </p>
        </div>
      </div>

      {/* Context Information */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-primary-700">{currentData.context}</p>
          </div>
        </div>
      </div>

      {/* Age Slider */}
      <div className="space-y-6">
        {/* Current Selection Display */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getAgeBackground(value)} text-white font-semibold text-lg`}>
            <Icon name="Calendar" size={20} />
            <span>Age {value}</span>
          </div>
          <p className={`mt-2 font-medium ${getAgeColor(value)}`}>
            {getAgeLabel(value)}
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="50"
            max="75"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all duration-200 ${
              isDragging ? 'scale-105' : ''
            }`}
            style={{
              background: `linear-gradient(to right, 
                #F59E0B 0%, #F59E0B ${((currentData.earlyAge - 50) / 25) * 100}%, 
                #2A9D8F ${((currentData.earlyAge - 50) / 25) * 100}%, #2A9D8F ${((currentData.normalAge - 50) / 25) * 100}%, 
                #0F5E9C ${((currentData.normalAge - 50) / 25) * 100}%, #0F5E9C 100%)`
            }}
          />
          
          {/* Age Markers */}
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>50</span>
            <span>55</span>
            <span>60</span>
            <span>65</span>
            <span>70</span>
            <span>75</span>
          </div>
        </div>

        {/* Quick Selection Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onChange(currentData.earlyAge)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              value === currentData.earlyAge
                ? 'border-warning bg-warning-50 shadow-md'
                : 'border-border hover:border-warning-200 hover:bg-warning-50'
            }`}
          >
            <div className="text-center">
              <Icon name="Zap" size={20} className="text-warning mx-auto mb-1" />
              <div className="font-semibold text-text-primary">{currentData.earlyAge}</div>
              <div className="text-xs text-text-secondary">Early</div>
            </div>
          </button>

          <button
            onClick={() => onChange(currentData.normalAge)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              value === currentData.normalAge
                ? 'border-success bg-success-50 shadow-md'
                : 'border-border hover:border-success-200 hover:bg-success-50'
            }`}
          >
            <div className="text-center">
              <Icon name="Target" size={20} className="text-success mx-auto mb-1" />
              <div className="font-semibold text-text-primary">{currentData.normalAge}</div>
              <div className="text-xs text-text-secondary">Normal</div>
            </div>
          </button>

          <button
            onClick={() => onChange(currentData.lateAge)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              value === currentData.lateAge
                ? 'border-primary bg-primary-50 shadow-md'
                : 'border-border hover:border-primary-200 hover:bg-primary-50'
            }`}
          >
            <div className="text-center">
              <Icon name="TrendingUp" size={20} className="text-primary mx-auto mb-1" />
              <div className="font-semibold text-text-primary">{currentData.lateAge}</div>
              <div className="text-xs text-text-secondary">Delayed</div>
            </div>
          </button>
        </div>

        {/* Age Impact Information */}
        <div className={`p-4 rounded-lg border ${
          getAgeCategory(value) === 'early' ? 'bg-warning-50 border-warning-200' :
          getAgeCategory(value) === 'normal'? 'bg-success-50 border-success-200' : 'bg-primary-50 border-primary-200'
        }`}>
          <div className="flex items-start gap-3">
            <Icon 
              name={
                getAgeCategory(value) === 'early' ? 'AlertTriangle' :
                getAgeCategory(value) === 'normal' ? 'CheckCircle' : 'TrendingUp'
              } 
              size={18} 
              className={`flex-shrink-0 mt-0.5 ${
                getAgeCategory(value) === 'early' ? 'text-warning' :
                getAgeCategory(value) === 'normal' ? 'text-success' : 'text-primary'
              }`} 
            />
            <div className="text-sm">
              <h4 className={`font-semibold mb-1 ${
                getAgeCategory(value) === 'early' ? 'text-warning-600' :
                getAgeCategory(value) === 'normal' ? 'text-success-600' : 'text-primary-600'
              }`}>
                {getAgeLabel(value)} Impact
              </h4>
              <p className={`${
                getAgeCategory(value) === 'early' ? 'text-warning-700' :
                getAgeCategory(value) === 'normal' ? 'text-success-700' : 'text-primary-700'
              }`}>
                {getAgeAdvice(value)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementAgeSection;