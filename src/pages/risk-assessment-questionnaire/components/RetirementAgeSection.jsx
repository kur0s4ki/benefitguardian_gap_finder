import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RetirementAgeSection = ({
  value,
  onChange,
  currentAge,
  onCurrentAgeChange,
  profession
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const professionData = {
    teacher: { earlyAge: 58, normalAge: 62, lateAge: 67, context: "Teachers often have specific pension milestones. Retiring early might reduce your pension, while delaying could increase it." },
    nurse: { earlyAge: 57, normalAge: 63, lateAge: 68, context: "Nurses' physically demanding roles can make early retirement appealing, but ensure your benefits are secured." },
    'first-responder': { earlyAge: 55, normalAge: 60, lateAge: 65, context: "First responders may have early retirement options due to the high-stress nature of their jobs." },
    'government-employee': { earlyAge: 60, normalAge: 65, lateAge: 70, context: "Government employees' pension plans are often tied to specific age and service year combinations." }
  };

  const currentData = professionData[profession] || professionData.teacher;

  const getAgeCategory = (age) => {
    if (age <= currentData.earlyAge) return 'early';
    if (age <= currentData.normalAge) return 'normal';
    return 'late';
  };
  
  const getAgeLabel = (age) => {
    const category = getAgeCategory(age);
    if (category === 'early') return `Early (${currentData.earlyAge} or below)`;
    if (category === 'normal') return `Normal (${currentData.earlyAge + 1}-${currentData.normalAge})`;
    return `Delayed (${currentData.normalAge + 1} or above)`;
  };
  
  const getAgeAdvice = (age) => {
    const category = getAgeCategory(age);
    if (category === 'early') return "Retiring early may provide more leisure time but could significantly reduce your monthly pension and increase healthcare costs before Medicare eligibility.";
    if (category === 'normal') return "This is a common retirement age range that balances pension benefits with personal time. It often aligns with standard social security and pension plan rules.";
    return "Delaying retirement can substantially boost your final pension amount and social security benefits, providing greater financial security in your later years.";
  };

  const getAgeColor = (age) => {
    const category = getAgeCategory(age);
    if (category === 'early') return 'text-warning';
    if (category === 'normal') return 'text-success';
    return 'text-primary';
  };
  
  const getAgeBackground = (age) => {
    const category = getAgeCategory(age);
    if (category === 'early') return 'bg-warning';
    if (category === 'normal') return 'bg-success';
    return 'bg-primary';
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
            Your age and planned retirement are key factors in your financial strategy.
          </p>
        </div>
      </div>
      
      {/* Current Age Section */}
      <div className="mb-6 space-y-4">
        <div className="text-center">
          <label className="block text-sm font-medium text-text-primary mb-2">
            What is your current age?
          </label>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-white font-semibold text-lg">
            <Icon name="User" size={20} />
            <span>Age {currentAge || 25}</span>
          </div>
        </div>

        <div className="relative">
          <input
            type="range"
            min="25"
            max="70"
            value={currentAge || 25}
            onChange={(e) => onCurrentAgeChange(parseInt(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all duration-200"
            style={{
              background: `linear-gradient(to right, #6B7280 0%, #6B7280 100%)`
            }}
          />
          
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>25</span>
            <span>35</span>
            <span>45</span>
            <span>55</span>
            <span>65</span>
            <span>70</span>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-primary-700">{currentData.context}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
            <label className="block text-sm font-medium text-text-primary mb-2">
                At what age do you plan to retire?
            </label>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getAgeBackground(value)} text-white font-semibold text-lg`}>
            <Icon name="Calendar" size={20} />
            <span>Age {value}</span>
          </div>
          <p className={`mt-2 font-medium ${getAgeColor(value)}`}>
            {getAgeLabel(value)}
          </p>
        </div>

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
          
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>50</span>
            <span>55</span>
            <span>60</span>
            <span>65</span>
            <span>70</span>
            <span>75</span>
          </div>
        </div>

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
        
        {currentAge && value && value <= currentAge && (
          <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-lg text-sm flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} />
            <div>
              <div className="font-semibold">Invalid Retirement Timeline</div>
              <div>You cannot retire at age {value} if you are currently {currentAge}. Please adjust your retirement age to be greater than your current age.</div>
            </div>
          </div>
        )}

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