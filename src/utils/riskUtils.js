/**
 * Centralized risk level utilities to ensure consistent risk scoring across all components
 */

/**
 * Get standardized risk level data based on score
 * @param {number} score - Risk score (0-100)
 * @returns {Object} Risk level information
 */
export const getRiskLevel = (score) => {
  // Ensure score is a valid number
  const validScore = Math.max(0, Math.min(100, Number(score) || 0));
  
  if (validScore < 40) {
    return {
      level: 'Low Risk',
      shortLevel: 'Low',
      color: 'text-success',
      bgColor: 'bg-success',
      bgColorLight: 'bg-success-50',
      borderColor: 'border-success-200',
      ringColor: 'stroke-success',
      description: 'Your retirement plan shows strong fundamentals with minimal gaps.',
      icon: 'Shield',
      shieldClass: 'text-success',
      riskColor: 'green'
    };
  }
  
  if (validScore < 70) {
    return {
      level: 'Moderate Risk',
      shortLevel: 'Moderate',
      color: 'text-warning',
      bgColor: 'bg-warning',
      bgColorLight: 'bg-warning-50',
      borderColor: 'border-warning-200',
      ringColor: 'stroke-warning',
      description: 'Some gaps identified that could impact your retirement security.',
      icon: 'ShieldAlert',
      shieldClass: 'text-warning',
      riskColor: 'gold'
    };
  }
  
  return {
    level: 'High Risk',
    shortLevel: 'High',
    color: 'text-error',
    bgColor: 'bg-error',
    bgColorLight: 'bg-error-50',
    borderColor: 'border-error-200',
    ringColor: 'stroke-error',
    description: 'Critical gaps detected that require immediate attention.',
    icon: 'ShieldX',
    shieldClass: 'text-error animate-pulse',
    riskColor: 'red'
  };
};

/**
 * Get risk color for calculation engine compatibility
 * @param {number} score - Risk score (0-100)
 * @returns {string} Risk color (green, gold, red)
 */
export const getRiskColor = (score) => {
  return getRiskLevel(score).riskColor;
};

/**
 * Format risk score for display
 * @param {number} score - Risk score (0-100)
 * @returns {string} Formatted score
 */
export const formatRiskScore = (score) => {
  const validScore = Math.max(0, Math.min(100, Number(score) || 0));
  return Math.round(validScore).toString();
};

/**
 * Get risk component severity
 * @param {number} componentScore - Component risk score (0-100)
 * @returns {string} Severity level (low, medium, high)
 */
export const getComponentSeverity = (componentScore) => {
  const validScore = Math.max(0, Math.min(100, Number(componentScore) || 0));
  
  if (validScore < 30) return 'low';
  if (validScore < 60) return 'medium';
  return 'high';
};

export default getRiskLevel; 