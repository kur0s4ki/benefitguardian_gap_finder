/**
 * Centralized risk level utilities to ensure consistent risk scoring across all components
 */

import { configService } from '../services/configurationService';

// Cache for risk thresholds to avoid repeated database calls
let cachedThresholds = null;
let cachedConfig = null;
let lastThresholdFetch = null;
const THRESHOLD_CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Get risk thresholds from configuration service with caching
 * @returns {Promise<Object>} Risk thresholds object
 */
const getRiskThresholds = async () => {
  // Check if we have cached thresholds that are still valid
  if (cachedThresholds && lastThresholdFetch &&
      Date.now() - lastThresholdFetch < THRESHOLD_CACHE_TIMEOUT) {
    return cachedThresholds;
  }

  try {
    const config = await configService.getConfiguration();
    cachedConfig = config; // Cache full config for component thresholds
    cachedThresholds = config.RISK_THRESHOLDS || { low: 39, moderate: 69 };
    lastThresholdFetch = Date.now();
    console.log('[RiskUtils] Loaded risk thresholds from database:', cachedThresholds);
    return cachedThresholds;
  } catch (error) {
    console.warn('[RiskUtils] Failed to load risk thresholds from database, using fallback:', error);
    // Use fallback values if database fails
    cachedThresholds = { low: 39, moderate: 69 };
    cachedConfig = null;
    lastThresholdFetch = Date.now();
    return cachedThresholds;
  }
};

/**
 * Get standardized risk level data based on score
 * @param {number} score - Risk score (0-100)
 * @param {Object} thresholds - Optional risk thresholds (if not provided, will fetch from config)
 * @returns {Promise<Object>} Risk level information
 */
export const getRiskLevel = async (score, thresholds = null) => {
  // Ensure score is a valid number
  const validScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Get thresholds from parameter or fetch from config
  const riskThresholds = thresholds || await getRiskThresholds();

  if (validScore <= riskThresholds.low) {
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

  if (validScore <= riskThresholds.moderate) {
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
 * @param {Object} thresholds - Optional risk thresholds
 * @returns {Promise<string>} Risk color (green, gold, red)
 */
export const getRiskColor = async (score, thresholds = null) => {
  const riskLevel = await getRiskLevel(score, thresholds);
  return riskLevel.riskColor;
};

/**
 * Synchronous version of getRiskLevel for backward compatibility
 * Uses cached thresholds or fallback values
 * @param {number} score - Risk score (0-100)
 * @returns {Object} Risk level information
 */
export const getRiskLevelSync = (score) => {
  const validScore = Math.max(0, Math.min(100, Number(score) || 0));
  const fallbackThresholds = cachedThresholds || { low: 39, moderate: 69 };

  if (validScore <= fallbackThresholds.low) {
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

  if (validScore <= fallbackThresholds.moderate) {
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
 * Synchronous version of getRiskColor for backward compatibility
 * Uses cached thresholds or fallback values
 * @param {number} score - Risk score (0-100)
 * @returns {string} Risk color (green, gold, red)
 */
export const getRiskColorSync = (score) => {
  const validScore = Math.max(0, Math.min(100, Number(score) || 0));
  const fallbackThresholds = cachedThresholds || { low: 39, moderate: 69 };

  if (validScore <= fallbackThresholds.low) return 'green';
  if (validScore <= fallbackThresholds.moderate) return 'gold';
  return 'red';
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
 * Get risk component severity using configurable thresholds
 * @param {number} componentScore - Component risk score (0-100)
 * @param {Object} componentThresholds - Optional component thresholds
 * @returns {Promise<string>} Severity level (low, medium, high)
 */
export const getComponentSeverity = async (componentScore, componentThresholds = null) => {
  const validScore = Math.max(0, Math.min(100, Number(componentScore) || 0));

  let thresholds = componentThresholds;
  if (!thresholds) {
    try {
      const config = await configService.getConfiguration();
      thresholds = config.COMPONENT_THRESHOLDS || { low: 30, medium: 60 };
    } catch (error) {
      console.warn('[RiskUtils] Failed to load component thresholds, using fallback:', error);
      thresholds = { low: 30, medium: 60 };
    }
  }

  if (validScore <= thresholds.low) return 'low';
  if (validScore <= thresholds.medium) return 'medium';
  return 'high';
};

/**
 * Synchronous version of getComponentSeverity for backward compatibility
 * @param {number} componentScore - Component risk score (0-100)
 * @returns {string} Severity level (low, medium, high)
 */
export const getComponentSeveritySync = (componentScore) => {
  const validScore = Math.max(0, Math.min(100, Number(componentScore) || 0));

  // Use cached component thresholds if available, otherwise fallback
  const fallbackThresholds = { low: 30, medium: 60 };
  let thresholds = fallbackThresholds;

  // Try to get from cached config if available
  if (cachedConfig && cachedConfig.COMPONENT_THRESHOLDS) {
    thresholds = cachedConfig.COMPONENT_THRESHOLDS;
  }

  if (validScore <= thresholds.low) return 'low';
  if (validScore <= thresholds.medium) return 'medium';
  return 'high';
};

/**
 * Refresh the cached risk thresholds and configuration
 * Useful when configuration changes and components need fresh data
 */
export const refreshRiskThresholds = () => {
  cachedThresholds = null;
  cachedConfig = null;
  lastThresholdFetch = null;
};

export default getRiskLevel;