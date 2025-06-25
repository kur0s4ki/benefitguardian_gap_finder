import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from 'components/AppIcon';
import { getRiskLevel } from 'utils/riskUtils';

const RiskGauge = ({ score, profession, showResults, riskComponents }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef(null);
  const delayTimerRef = useRef(null);

  const animateScore = useCallback(() => {
    let current = 0;
    const increment = score / 50;
    
    // Clear any existing animation
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    animationTimerRef.current = setInterval(() => {
      current += increment;
      if (current >= score) {
        current = score;
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
        setIsAnimating(false);
      }
      setAnimatedScore(Math.round(current));
    }, 40);
  }, [score]);

  useEffect(() => {
    if (showResults) {
      setIsAnimating(true);
      delayTimerRef.current = setTimeout(() => {
        animateScore();
      }, 500);
    }

    // Cleanup function
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [showResults, animateScore]);

  const riskData = getRiskLevel(animatedScore);
  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="card p-8 text-center">
      <h3 className="text-xl font-semibold text-text-primary mb-6">
        GrowthGuard Risk Score
      </h3>
      
      {/* Animated Gauge */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-secondary-100"
          />
          
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${riskData.ringColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon 
            name={riskData.icon} 
            size={48} 
            className={`${riskData.shieldClass} mb-2`} 
          />
          <div className="text-4xl font-bold text-text-primary mb-1">
            {animatedScore}
          </div>
          <div className="text-sm text-text-secondary">
            out of 100
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskData.bgColor} bg-opacity-10 mb-4`}>
        <div className={`w-3 h-3 rounded-full ${riskData.bgColor}`}></div>
        <span className={`font-semibold ${riskData.color}`}>
          {riskData.level}
        </span>
      </div>

      {/* Description */}
      <p className="text-text-secondary max-w-md mx-auto mb-6">
        {riskData.description}
      </p>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-error mb-1">
            {riskComponents ? Math.round(riskComponents.pensionRisk) : Math.round(animatedScore * 0.4)}
          </div>
          <div className="text-sm text-text-secondary">
            Pension Risk
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {riskComponents ? Math.round(riskComponents.taxRisk) : Math.round(animatedScore * 0.35)}
          </div>
          <div className="text-sm text-text-secondary">
            Tax Risk
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-error mb-1">
            {riskComponents ? Math.round(riskComponents.survivorRisk) : Math.round(animatedScore * 0.25)}
          </div>
          <div className="text-sm text-text-secondary">
            Survivor Risk
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;