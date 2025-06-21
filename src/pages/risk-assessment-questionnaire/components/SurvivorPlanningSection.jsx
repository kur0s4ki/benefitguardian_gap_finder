import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

const SurvivorPlanningSection = ({ value, details, onChange, onDetailsChange, profession }) => {
  const [showHeartbeat, setShowHeartbeat] = useState(false);

  // Heartbeat animation for survivor risk
  useEffect(() => {
    if (value === false) {
      setShowHeartbeat(true);
      const timer = setTimeout(() => setShowHeartbeat(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const professionData = {
    teacher: {
      context: "Teacher spouses often depend on pension survivor benefits for security",
      risk: "Without planning, your spouse could lose 50-100% of pension income"
    },
    nurse: {
      context: "Healthcare workers\' families need protection against income loss",
      risk: "Survivor benefits may be reduced or eliminated without proper planning"
    },
    'first-responder': {
      context: "First responder families face unique financial vulnerabilities",
      risk: "Line-of-duty considerations make survivor planning critical"
    },
    'government-employee': {
      context: "Government employee survivor benefits vary by plan and election",
      risk: "Default options may not provide adequate family protection"
    }
  };

  const currentData = professionData[profession] || professionData.teacher;

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0 ${
          showHeartbeat ? 'animate-pulse' : ''
        }`}>
          <Icon name="Heart" size={24} className="text-error" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-2">
            Survivor Income Planning
          </h2>
          <p className="text-text-secondary">
            Have you planned for your spouse's income if something happens to you?
          </p>
        </div>
      </div>

      {/* Context Information */}
      <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-error flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-error-700 mb-2">{currentData.context}</p>
            <p className="text-error-600 font-medium">{currentData.risk}</p>
          </div>
        </div>
      </div>

      {/* Yes/No Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onChange(true)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
            value === true
              ? 'border-success bg-success-50 shadow-md'
              : 'border-border hover:border-success-200 hover:bg-success-50'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              value === true
                ? 'border-success bg-success text-white' :'border-gray-300'
            }`}>
              {value === true && <Icon name="Check" size={20} />}
            </div>
            <h3 className="font-semibold text-text-primary">Yes, I have a plan</h3>
            <p className="text-sm text-text-secondary">My spouse's income is protected</p>
          </div>
        </button>

        <button
          onClick={() => onChange(false)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
            value === false
              ? 'border-error bg-error-50 shadow-md'
              : 'border-border hover:border-error-200 hover:bg-error-50'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              value === false
                ? 'border-error bg-error text-white' :'border-gray-300'
            }`}>
              {value === false && <Icon name="Check" size={20} />}
            </div>
            <h3 className="font-semibold text-text-primary">No, I need help</h3>
            <p className="text-sm text-text-secondary">I haven't addressed this risk</p>
          </div>
        </button>
      </div>

      {/* Follow-up Question for "No" Response */}
      {value === false && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 space-y-4 animate-slide-in">
          <div className="flex items-center gap-2">
            <Icon name="Heart" size={18} className={`text-error ${showHeartbeat ? 'animate-pulse' : ''}`} />
            <h4 className="font-semibold text-error-600">What's your biggest concern about survivor planning?</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'income-loss', label: 'Loss of pension income', icon: 'DollarSign' },
              { id: 'healthcare', label: 'Healthcare coverage', icon: 'Heart' },
              { id: 'debt-obligations', label: 'Debt obligations', icon: 'CreditCard' },
              { id: 'children-education', label: "Children's education", icon: 'GraduationCap' },
              { id: 'mortgage', label: 'Mortgage payments', icon: 'Home' },
              { id: 'not-sure', label: "I'm not sure", icon: 'HelpCircle' }
            ].map((concern) => (
              <button
                key={concern.id}
                onClick={() => onDetailsChange(concern.id)}
                className={`p-3 rounded-lg border transition-all duration-150 text-left ${
                  details === concern.id
                    ? 'border-error bg-error-100 shadow-sm'
                    : 'border-error-200 hover:border-error hover:bg-error-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name={concern.icon} size={16} className="text-error" />
                  <span className="text-sm font-medium text-error-700">{concern.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Success Message for "Yes" Response */}
      {value === true && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 animate-slide-in">
          <div className="flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <h4 className="font-semibold text-success-600">Great planning ahead!</h4>
              <p className="text-sm text-success-700">
                Having survivor income protection shows excellent financial planning.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Critical Risk Warning */}
      {value === false && details && (
        <div className="mt-4 p-4 bg-error-100 border-2 border-error rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-error-600">Critical Risk Identified</h4>
              <p className="text-sm text-error-700">
                This gap could leave your family financially vulnerable. Our analysis will show specific solutions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurvivorPlanningSection;