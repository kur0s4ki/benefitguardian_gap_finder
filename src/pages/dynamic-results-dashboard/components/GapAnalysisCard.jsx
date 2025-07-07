import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from 'components/AppIcon';

const GapAnalysisCard = ({ 
  title, 
  amount, 
  icon, 
  emoji, 
  description, 
  riskLevel = 'moderate',
  delay = 0,
  showPublicMessage = true
}) => {
  const { isPublic } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showAmount, setShowAmount] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const visibilityTimerRef = useRef(null);
  const amountTimerRef = useRef(null);
  const animationTimerRef = useRef(null);

  const animateAmount = useCallback(() => {
    let current = 0;
    const increment = amount / 30;
    
    // Clear any existing animation
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    animationTimerRef.current = setInterval(() => {
      current += increment;
      if (current >= amount) {
        current = amount;
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      setAnimatedAmount(Math.round(current));
    }, 50);
  }, [amount]);

  const playChaChing = useCallback(() => {
    // Sound effect implementation would go here
    console.log('Cha-ching sound effect played');
  }, []);

  useEffect(() => {
    visibilityTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      amountTimerRef.current = setTimeout(() => {
        setShowAmount(true);
        animateAmount();
        playChaChing();
      }, 300);
    }, delay);

    // Cleanup function
    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
        visibilityTimerRef.current = null;
      }
      if (amountTimerRef.current) {
        clearTimeout(amountTimerRef.current);
        amountTimerRef.current = null;
      }
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [delay, animateAmount, playChaChing]);

  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'high':
        return {
          borderColor: 'border-error',
          bgColor: 'bg-error-50',
          textColor: 'text-error',
          iconColor: 'text-error'
        };
      case 'moderate':
        return {
          borderColor: 'border-warning',
          bgColor: 'bg-warning-50',
          textColor: 'text-warning',
          iconColor: 'text-warning'
        };
      default:
        return {
          borderColor: 'border-success',
          bgColor: 'bg-success-50',
          textColor: 'text-success',
          iconColor: 'text-success'
        };
    }
  };

  const styles = getRiskStyles();
  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div 
      className={`card p-6 border-2 ${styles.borderColor} ${styles.bgColor} transform transition-all duration-500 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <Icon name={icon} size={24} className={styles.iconColor} />
        </div>
        
        {riskLevel === 'high' && (
          <div className="flex items-center gap-1">
            <Icon name="AlertTriangle" size={16} className="text-error animate-pulse" />
            <span className="text-xs font-semibold text-error">URGENT</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Amount */}
      <div className="mb-4">
        {showAmount ? (
          isPublic ? (
            <div>
              <div className={`text-2xl font-bold ${styles.textColor} transition-all duration-300`}>
                Gap Identified
              </div>
              {showPublicMessage && (
                <div className="text-sm text-text-secondary mt-2 flex items-center gap-1">
                  <Icon name="Lock" size={14} className="text-warning" />
                  <span>Sign in to see exact amount</span>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-3xl font-bold ${styles.textColor} transition-all duration-300`}>
              {formatAmount(animatedAmount)}
            </div>
          )
        ) : (
          <div className="text-3xl font-bold text-text-muted">
            Calculating...
          </div>
        )}
        
        <div className="text-sm text-text-secondary mt-1">
          {isPublic ? 'Analysis Result' : 'Projected Gap'}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4">
        {description}
      </p>

      {/* Impact Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${styles.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`}></div>
          <span className="text-xs font-medium text-text-secondary">
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Impact
          </span>
        </div>
        
        <Icon name="TrendingUp" size={16} className={styles.iconColor} />
      </div>

      {/* Cascading Coins Animation */}
      {showAmount && (
        <div className="absolute top-2 right-2 pointer-events-none">
          <div className="animate-bounce">
            <span className="text-accent text-lg">💰</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GapAnalysisCard;