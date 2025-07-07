import React from "react";
import Icon from "components/AppIcon";
import { getRiskLevel } from "utils/riskUtils";

const RiskGauge = ({ score, profession, riskComponents, showResults }) => {
  const riskData = getRiskLevel(score);
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`transition-all duration-1000 ${
        showResults
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-text-primary text-center mb-6">
          GrowthGuard Risk Score
        </h3>

        {/* Animated Gauge */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#f1f5f9"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={
                score < 40 ? "#10b981" : score < 70 ? "#f59e0b" : "#ef4444"
              }
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={showResults ? strokeDashoffset : circumference}
              className="transition-all duration-2000 ease-out"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={`w-16 h-16 ${riskData.bgColor} rounded-full flex items-center justify-center mb-2`}
            >
              <Icon name={riskData.icon} size={28} className="text-white" />
            </div>
            <div className="text-4xl font-bold text-text-primary mb-1">
              {showResults ? score : 0}
            </div>
            <div className="text-sm text-text-secondary">out of 100</div>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskData.bgColorLight} border ${riskData.borderColor}`}
          >
            <div className={`w-2 h-2 rounded-full ${riskData.bgColor}`}></div>
            <span className={`font-semibold ${riskData.color}`}>
              {riskData.level}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-text-secondary max-w-md mx-auto">
            {riskData.description}
          </p>
        </div>

        {/* Risk Components */}
        {riskComponents && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-error-50 rounded-lg border border-error-200">
              <div className="text-2xl font-bold text-error mb-1">
                {Math.round(riskComponents.pensionRisk || 0)}
              </div>
              <div className="text-sm font-medium text-error">Pension Risk</div>
            </div>

            <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
              <div className="text-2xl font-bold text-warning mb-1">
                {Math.round(riskComponents.taxRisk || 0)}
              </div>
              <div className="text-sm font-medium text-warning">Tax Risk</div>
            </div>

            <div className="text-center p-4 bg-error-50 rounded-lg border border-error-200">
              <div className="text-2xl font-bold text-error mb-1">
                {Math.round(riskComponents.survivorRisk || 0)}
              </div>
              <div className="text-sm font-medium text-error">
                Survivor Risk
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskGauge;
