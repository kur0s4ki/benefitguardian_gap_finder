import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";
import { getRiskLevel } from "utils/riskUtils";
import { configService } from "../../../services/configurationService";

const RiskGauge = ({ score, profession, riskComponents, showResults }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedComponents, setAnimatedComponents] = useState({
    pensionRisk: 0,
    taxRisk: 0,
    survivorRisk: 0
  });
  const [riskData, setRiskData] = useState({
    level: 'Moderate Risk',
    description: 'Loading risk assessment...',
    icon: 'ShieldAlert',
    shieldClass: 'text-warning'
  });
  const [riskThresholds, setRiskThresholds] = useState({ low: 39, moderate: 69 });
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Load risk thresholds and risk data when component mounts or score changes
  useEffect(() => {
    const loadRiskData = async () => {
      try {
        // Load risk thresholds from configuration
        const config = await configService.getConfiguration();
        const thresholds = config.RISK_THRESHOLDS || { low: 39, moderate: 69 };
        setRiskThresholds(thresholds);

        // Get risk level data using the thresholds
        const riskLevelData = await getRiskLevel(score, thresholds);
        setRiskData(riskLevelData);

        console.log('[RiskGauge] Loaded risk thresholds:', thresholds);
      } catch (error) {
        console.warn('[RiskGauge] Failed to load risk configuration, using fallback:', error);
        // Keep default fallback values
        const fallbackThresholds = { low: 39, moderate: 69 };
        setRiskThresholds(fallbackThresholds);

        const fallbackRiskData = await getRiskLevel(score, fallbackThresholds);
        setRiskData(fallbackRiskData);
      }
    };

    loadRiskData();
  }, [score]);

  // Helper function to get risk color based on score and thresholds
  const getRiskColor = (currentScore) => {
    if (currentScore <= riskThresholds.low) return '#2A9D8F'; // Green
    if (currentScore <= riskThresholds.moderate) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  // Helper function to get risk level text based on score and thresholds
  const getRiskLevelText = (currentScore) => {
    if (currentScore <= riskThresholds.low) return 'Low Risk';
    if (currentScore <= riskThresholds.moderate) return 'Medium Risk';
    return 'High Risk';
  };

  // Animate the score value and components when showResults changes
  useEffect(() => {
    if (showResults) {
      // Animate main score
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = score / steps;
      let currentStep = 0;

      const scoreInterval = setInterval(() => {
        currentStep++;
        const newScore = Math.min(increment * currentStep, score);
        setAnimatedScore(Math.round(newScore));

        if (currentStep >= steps) {
          clearInterval(scoreInterval);
          setAnimatedScore(score); // Ensure final value is exact
        }
      }, duration / steps);

      // Animate risk components if they exist
      if (riskComponents) {
        const componentIncrement = {
          pensionRisk: (riskComponents.pensionRisk || 0) / steps,
          taxRisk: (riskComponents.taxRisk || 0) / steps,
          survivorRisk: (riskComponents.survivorRisk || 0) / steps
        };
        let componentStep = 0;

        const componentInterval = setInterval(() => {
          componentStep++;
          setAnimatedComponents({
            pensionRisk: Math.min(componentIncrement.pensionRisk * componentStep, riskComponents.pensionRisk || 0),
            taxRisk: Math.min(componentIncrement.taxRisk * componentStep, riskComponents.taxRisk || 0),
            survivorRisk: Math.min(componentIncrement.survivorRisk * componentStep, riskComponents.survivorRisk || 0)
          });

          if (componentStep >= steps) {
            clearInterval(componentInterval);
            setAnimatedComponents({
              pensionRisk: riskComponents.pensionRisk || 0,
              taxRisk: riskComponents.taxRisk || 0,
              survivorRisk: riskComponents.survivorRisk || 0
            });
          }
        }, duration / steps);

        return () => {
          clearInterval(scoreInterval);
          clearInterval(componentInterval);
        };
      }

      return () => clearInterval(scoreInterval);
    } else {
      // Reset animations when hiding
      setAnimatedScore(0);
      setAnimatedComponents({
        pensionRisk: 0,
        taxRisk: 0,
        survivorRisk: 0
      });
    }
  }, [showResults, score, riskComponents]);

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
            {/* Progress Arc - now animated based on animatedScore */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getRiskColor(animatedScore)}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-out"
              style={{
                transition: showResults ? 'stroke-dashoffset 0.1s ease-out, stroke 0.3s ease-out' : 'none'
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Icon and Risk Level */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300`}
              style={{
                backgroundColor: getRiskColor(animatedScore)
              }}
            >
              <Icon 
                name="shield-alert" 
                size={28} 
                className="text-white"
                style={{ stroke: 'white' }}
              />
            </div>
            <div className="text-4xl font-bold text-text-primary mb-1 tabular-nums">
              {animatedScore}
            </div>
            <div className="text-sm text-text-secondary">out of 100</div>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300`}
            style={{
              backgroundColor: `${getRiskColor(animatedScore)}1A`, // 10% opacity
              borderColor: getRiskColor(animatedScore)
            }}
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300`}
              style={{
                backgroundColor: getRiskColor(animatedScore)
              }}
            ></div>
            <span
              className={`font-semibold transition-colors duration-300`}
              style={{
                color: getRiskColor(animatedScore)
              }}
            >
              {getRiskLevelText(animatedScore)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-text-secondary max-w-md mx-auto">
            {riskData.description}
          </p>
        </div>

        {/* Risk Components - now animated */}
        {riskComponents && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-error-50 rounded-lg border border-error-200">
              <div className="text-2xl font-bold text-error mb-1 tabular-nums">
                {Math.round(animatedComponents.pensionRisk)}
              </div>
              <div className="text-sm font-medium text-error">Pension Risk</div>
            </div>

            <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
              <div className="text-2xl font-bold text-warning mb-1 tabular-nums">
                {Math.round(animatedComponents.taxRisk)}
              </div>
              <div className="text-sm font-medium text-warning">Tax Risk</div>
            </div>

            <div className="text-center p-4 bg-error-50 rounded-lg border border-error-200">
              <div className="text-2xl font-bold text-error mb-1 tabular-nums">
                {Math.round(animatedComponents.survivorRisk)}
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
