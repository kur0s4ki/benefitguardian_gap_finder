// GapGuardian Gold Standard™️ Analysis - Calculation Engine
// Implements the client's specified calculation logic

import { configService } from '../services/configurationService';

// Fallback constants (kept for safety)
const FALLBACK_DEFAULT_PENSION_VALUES = {
  teacher: 3200,
  nurse: 2800,
  "first-responder": 4100,
  "state-local-hero": 3500,
};

// Fallback constants (kept for safety)
const FALLBACK_PROFESSION_FACTORS = {
  teacher: 1.0,
  nurse: 1.15,
  "first-responder": 1.25,
  "state-local-hero": 1.05,
};

const FALLBACK_STATE_FACTORS = {
  CA: 1.2, NY: 1.2, TX: 1.2, FL: 1.1, PA: 1.1, IL: 1.1, WA: 1.1, MA: 1.1,
  NJ: 1.1, VA: 1.1, NC: 1.0, GA: 1.0, OH: 1.0, MI: 1.0, AZ: 1.0, TN: 1.0,
  IN: 1.0, MO: 1.0, MD: 1.1, WI: 1.0, CO: 1.1, MN: 1.0, SC: 1.0, AL: 1.0,
  LA: 1.0, KY: 1.0, OR: 1.1, OK: 1.0, CT: 1.1, UT: 1.0, IA: 1.0, NV: 1.0,
  AR: 1.0, MS: 1.0, KS: 1.0, NM: 1.0, NE: 1.0, WV: 1.0, ID: 1.0, HI: 1.2,
  NH: 1.0, ME: 1.0, MT: 1.0, RI: 1.0, DE: 1.0, SD: 1.0, ND: 1.0, AK: 1.2,
  VT: 1.0, WY: 1.0,
};

// Fallback constants (kept for safety)
const FALLBACK_COVERAGE_LEVELS = {
  yes: 0.3,
  no: 1.0,
  true: 0.3,
  false: 1.0,
};

const FALLBACK_COLA_VALUES = {
  yes: 1,
  no: 0,
  unsure: 0,
  true: 1,
  false: 0,
};

const FALLBACK_YEARS_UNTIL_RETIREMENT_CONVERSION = {
  "5-10": 8,
  "11-15": 13,
  "16-20": 18,
  "21-25": 23,
  "26+": 28,
};

// Configuration cache
let cachedConfig = null;

/**
 * Convert retirement age to band
 */
const getRetirementAgeBand = (age) => {
  if (age >= 55 && age <= 62) return "55-62";
  if (age >= 63 && age <= 67) return "63-67";
  if (age >= 68) return "68+";
  return "63-67"; // default
};

/**
 * Convert years until retirement to band
 */
const getYearsUntilRetirementBand = (years) => {
  if (years >= 5 && years <= 10) return "5-10";
  if (years >= 11 && years <= 15) return "11-15";
  if (years >= 16 && years <= 20) return "16-20";
  if (years >= 21 && years <= 25) return "21-25";
  if (years >= 26) return "26+";
  return "16-20"; // default
};

/**
 * Convert technical error messages to user-friendly ones
 * @param {string} technicalError - The original error message
 * @param {Object} context - Additional context for the error
 * @returns {string} User-friendly error message
 */
const createUserFriendlyError = (technicalError, context = {}) => {
  const errorMap = {
    "User data is required":
      "Please complete the assessment form before viewing results.",
    "Input validation failed":
      "Please check your information and ensure all required fields are completed correctly.",
    "Invalid years of service":
      "Please enter a valid number of years of service (between 5 and 40 years).",
    "Invalid current age":
      "Please enter a valid current age (between 21 and 80 years).",
    "Invalid retirement age":
      "Please enter a valid retirement age (between 50 and 80 years).",
    "Retirement age must be greater than current age":
      "Your retirement age must be later than your current age. Please adjust your retirement timeline.",
    "Unable to parse":
      "Please check that all numbers are entered correctly without special characters.",
    "Invalid pension estimate":
      'Please enter a valid pension estimate or select "I don\'t know".',
    "Division by zero":
      "Unable to calculate results with the provided information. Please review your inputs.",
    "Calculation overflow":
      "The calculated values are too large. Please check your inputs for accuracy.",
  };

  // Find matching error pattern
  for (const [pattern, friendlyMessage] of Object.entries(errorMap)) {
    if (technicalError.includes(pattern)) {
      return friendlyMessage;
    }
  }

  // Default fallback for unknown errors
  return "We encountered an issue calculating your results. Please review your information and try again, or contact support if the problem persists.";
};

/**
 * Enhanced error result with both technical and user-friendly messages
 * @param {Error} error - The original error
 * @param {Object} userData - User input data
 * @param {Array} calculationLog - Calculation log entries
 * @returns {Object} Enhanced error result
 */
const createErrorResult = (error, userData, calculationLog) => {
  const userFriendlyMessage = createUserFriendlyError(error.message);

  return {
    error: error.message, // Technical error for debugging
    userFriendlyError: userFriendlyMessage, // User-facing error
    calculationLog,
    isError: true,
    errorDetails: {
      type: "calculation_error",
      timestamp: new Date().toISOString(),
      inputData: userData
        ? {
            profession: userData.profession,
            yearsOfService: userData.yearsOfService,
            currentAge: userData.currentAge,
            retirementAge: userData.retirementAge,
          }
        : null,
    },
    // Provide safe defaults so the UI doesn't break
    profession: userData?.profession || "unknown",
    riskScore: 50,
    riskColor: "gold",
    totalGap: 0,
    pensionGap: 0,
    taxTorpedo: 0,
    survivorGap: 0,
    monthlyGap: 0,
    monthlyContribution: 0,
    lifetimePayout: 0,
    hiddenBenefitOpportunity: 0,
    yearsOfService: userData?.yearsOfService || 0,
    currentAge: userData?.currentAge || 0,
    retirementAge: userData?.retirementAge || 0,
    yearsUntilRetirement: 0,
    riskComponents: {
      pensionRisk: 0,
      taxRisk: 0,
      survivorRisk: 0,
      earlyRetireBonus: 0,
      taxSurprisesBonus: 0,
    },
    multipliers: {
      professionFactor: 1.0,
      stateFactor: 1.0,
      coverageLevel: 1.0,
      colaValue: 0,
      yearsUntilRetirementConverted: 18,
    },
    gaps: {
      pension: {
        amount: 0,
        monthly: 0,
        risk: "low",
        description: "Unable to calculate - please check your inputs",
      },
      tax: {
        amount: 0,
        risk: "low",
        description: "Unable to calculate - please check your inputs",
      },
      survivor: {
        amount: 0,
        monthly: 0,
        risk: "low",
        description: "Unable to calculate - please check your inputs",
      },
    },
  };
};

/**
 * Get calculation configuration from database with fallback
 */
async function getCalculationConfig() {
  if (!cachedConfig) {
    try {
      cachedConfig = await configService.getConfiguration();
      console.log('[Config] Loaded configuration from database');
    } catch (error) {
      console.error('Failed to load configuration, using fallback:', error);
      cachedConfig = {
        DEFAULT_PENSION_VALUES: FALLBACK_DEFAULT_PENSION_VALUES,
        PROFESSION_FACTORS: FALLBACK_PROFESSION_FACTORS,
        STATE_FACTORS: FALLBACK_STATE_FACTORS,
        COVERAGE_LEVELS: FALLBACK_COVERAGE_LEVELS,
        COLA_VALUES: FALLBACK_COLA_VALUES,
        YEARS_UNTIL_RETIREMENT_CONVERSION: FALLBACK_YEARS_UNTIL_RETIREMENT_CONVERSION,
        RISK_WEIGHTS: { pension: 0.5, tax: 0.3, survivor: 0.2 },
        RISK_THRESHOLDS: { low: 39, moderate: 69 },
        GAP_RATES: { pension: 0.03, tax: 0.3, survivor: 0.4 },
        RISK_BONUSES: { early_retirement: 20, tax_surprises: 30 },
        CALCULATION_CONSTANTS: {
          hidden_benefit_base: 1800,
          max_service_years: 28,
          lifetime_multiplier: 3.0,
          monthly_to_20year: 240,
        },
      };
    }
  }
  return cachedConfig;
}

/**
 * Main calculation engine
 * @param {Object} userData - User input data
 * @returns {Object} Calculated results
 */
export const calculateBenefitGaps = async (userData) => {
  const calculationLog = ["[Log] Calculation engine started."];

  try {
    // Load configuration from database with fallback
    const config = await getCalculationConfig();
    calculationLog.push("[Config] Configuration loaded successfully");

    // Enhanced input validation with specific error messages
    if (!userData) {
      throw new Error("User data is required");
    }

    // Use the validation function to check input quality
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      throw new Error(
        `Input validation failed: ${validation.errors.join(", ")}`
      );
    }

    // Log any warnings for debugging
    if (validation.warnings.length > 0) {
      calculationLog.push(
        `[Warning] Input warnings: ${validation.warnings.join(", ")}`
      );
    }

    // Extract and normalize data with enhanced validation
    const profession = userData.profession?.toLowerCase() || "teacher";

    // Enhanced numeric input validation with meaningful error messages
    let yearsOfService, currentAge, retirementAge, otherSavings;

    try {
      yearsOfService = parseInt(userData.yearsOfService);
      if (isNaN(yearsOfService) || yearsOfService < 0 || yearsOfService > 50) {
        throw new Error(
          `Invalid years of service: ${userData.yearsOfService}. Must be between 0 and 50.`
        );
      }
      yearsOfService = Math.max(0, Math.min(50, yearsOfService));
    } catch (parseError) {
      throw new Error(
        `Unable to parse years of service: ${userData.yearsOfService}`
      );
    }

    try {
      currentAge = parseInt(userData.currentAge);
      if (isNaN(currentAge) || currentAge < 18 || currentAge > 100) {
        throw new Error(
          `Invalid current age: ${userData.currentAge}. Must be between 18 and 100.`
        );
      }
      currentAge = Math.max(18, Math.min(100, currentAge));
    } catch (parseError) {
      throw new Error(`Unable to parse current age: ${userData.currentAge}`);
    }

    try {
      retirementAge = parseInt(userData.retirementAge);
      if (isNaN(retirementAge) || retirementAge < 50 || retirementAge > 100) {
        throw new Error(
          `Invalid retirement age: ${userData.retirementAge}. Must be between 50 and 100.`
        );
      }
      if (retirementAge <= currentAge) {
        throw new Error(
          `Retirement age (${retirementAge}) must be greater than current age (${currentAge}).`
        );
      }
      retirementAge = Math.max(currentAge + 1, Math.min(100, retirementAge));
    } catch (parseError) {
      throw new Error(
        `Unable to parse retirement age: ${userData.retirementAge}`
      );
    }

    try {
      otherSavings = parseFloat(
        userData.otherSavings || userData.currentSavings || 0
      );
      if (isNaN(otherSavings) || otherSavings < 0) {
        calculationLog.push(
          "[Warning] Invalid savings amount, defaulting to 0"
        );
        otherSavings = 0;
      }
      otherSavings = Math.max(0, otherSavings);
    } catch (parseError) {
      calculationLog.push(
        "[Warning] Unable to parse savings amount, defaulting to 0"
      );
      otherSavings = 0;
    }

    // Validate state input
    const state = userData.state || "CA";
    if (!config.STATE_FACTORS.hasOwnProperty(state)) {
      calculationLog.push(
        `[Warning] Unknown state '${state}', using default factor`
      );
    }

    // Normalize boolean/string inputs with validation
    const cola = String(
      userData.cola || userData.inflationProtection || "no"
    ).toLowerCase();
    const survivorIncome = String(
      userData.survivorIncome || userData.survivorPlanning || "no"
    ).toLowerCase();
    const financialFears = Array.isArray(userData.financialFears)
      ? userData.financialFears
      : [];

    calculationLog.push(
      `[Input] Validated inputs: profession=${profession}, yos=${yearsOfService}, state=${state}, cola=${cola}, survivor=${survivorIncome}, savings=${otherSavings}, age=${currentAge}, retireAge=${retirementAge}`
    );

    // Handle pension estimate with validation
    let currentPension;
    if (
      userData.pensionUnknown ||
      userData.pensionEstimate === "I don't know" ||
      !userData.pensionEstimate
    ) {
      currentPension =
        config.DEFAULT_PENSION_VALUES[profession] || config.DEFAULT_PENSION_VALUES.teacher;
      calculationLog.push(
        `[Pension] User pension unknown. Using default for ${profession}: $${currentPension}`
      );
    } else {
      const parsedPension = parseFloat(userData.pensionEstimate);
      if (isNaN(parsedPension) || parsedPension < 0) {
        currentPension =
          config.DEFAULT_PENSION_VALUES[profession] || config.DEFAULT_PENSION_VALUES.teacher;
        calculationLog.push(
          `[Pension] Invalid pension value provided. Using default for ${profession}: $${currentPension}`
        );
      } else {
        currentPension = Math.min(50000, parsedPension); // Cap at reasonable maximum
        calculationLog.push(
          `[Pension] User provided pension: $${currentPension}`
        );
      }
    }

    // Calculate derived values
    const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

    calculationLog.push(
      `[Derived] Years until retirement: ${yearsUntilRetirement}`
    );

    if (yearsUntilRetirement <= 0) {
      throw new Error("Retirement age must be greater than current age");
    }

    const retirementAgeBand = getRetirementAgeBand(retirementAge);
    const yearsUntilRetirementBand =
      getYearsUntilRetirementBand(yearsUntilRetirement);

    calculationLog.push(
      `[Derived] Retirement bands: age=${retirementAgeBand}, years=${yearsUntilRetirementBand}`
    );

    // Get multipliers from configuration
    const professionFactor = config.PROFESSION_FACTORS[profession] || 1.0;
    const stateFactor = config.STATE_FACTORS[state] || 1.0;
    const coverageLevel = config.COVERAGE_LEVELS[survivorIncome] || 1.0;
    const colaValue = config.COLA_VALUES[cola] || 0;
    const yearsUntilRetirementConverted =
      config.YEARS_UNTIL_RETIREMENT_CONVERSION[yearsUntilRetirementBand] || 18;

    calculationLog.push(
      `[Factors] Multipliers: profession=${professionFactor}, state=${stateFactor}, coverage=${coverageLevel}, cola=${colaValue}, yearsBand=${yearsUntilRetirementConverted}`
    );

    // A. Hidden Benefit Opportunity
    const hiddenBenefitBase = config.CALCULATION_CONSTANTS?.hidden_benefit_base || 1800;
    const maxServiceYears = config.CALCULATION_CONSTANTS?.max_service_years || 28;
    const hiddenBenefitOpportunity = Math.round(
      hiddenBenefitBase * (yearsOfService / maxServiceYears) * professionFactor * stateFactor
    );

    calculationLog.push(
      `[Calc] Hidden Benefit Opportunity: $${hiddenBenefitOpportunity} = ${hiddenBenefitBase} * (${yearsOfService}/${maxServiceYears}) * ${professionFactor} * ${stateFactor}`
    );

    // B. Risk Score Components
    const earlyRetireBonus = retirementAgeBand === "55-62" ? (config.RISK_BONUSES?.early_retirement || 20) : 0;
    const taxSurprisesBonus =
      financialFears.includes("tax-surprises") ||
      financialFears.includes("Tax surprises")
        ? (config.RISK_BONUSES?.tax_surprises || 30)
        : 0;

    calculationLog.push(
      `[Risk] Bonuses: earlyRetire=${earlyRetireBonus}, taxSurprise=${taxSurprisesBonus}`
    );

    const pensionRisk = Math.min(
      100,
      Math.max(0, 80 - colaValue * 30 + earlyRetireBonus)
    );
    const taxRisk = Math.min(
      100,
      (otherSavings / 100000) * 25 + taxSurprisesBonus
    );
    const survivorRisk = Math.round(80 * coverageLevel);

    calculationLog.push(
      `[Risk] Risk components: pensionRisk=${pensionRisk}, taxRisk=${taxRisk}, survivorRisk=${survivorRisk}`
    );

    // Risk score calculation using configurable weights
    const riskWeights = config.RISK_WEIGHTS || { pension: 0.5, tax: 0.3, survivor: 0.2 };
    const riskScore = Math.round(
      pensionRisk * riskWeights.pension + taxRisk * riskWeights.tax + survivorRisk * riskWeights.survivor
    );

    calculationLog.push(`[Risk] Raw risk score: ${riskScore} (weights: ${JSON.stringify(riskWeights)})`);

    // Ensure riskScore stays within 0-100 bounds even as weightings evolve
    const clampedRiskScore = Math.min(100, Math.max(0, riskScore));

    if (clampedRiskScore !== riskScore)
      calculationLog.push(`[Risk] Clamped risk score: ${clampedRiskScore}`);

    // C. Gap Calculations using configurable rates
    const gapRates = config.GAP_RATES || { pension: 0.03, tax: 0.3, survivor: 0.4 };
    const pensionGap = Math.round(currentPension * gapRates.pension * yearsOfService);
    const taxTorpedo = Math.round(otherSavings * gapRates.tax);
    const survivorGap = Math.round(currentPension * gapRates.survivor);

    calculationLog.push(
      `[Gaps] Calculated gaps: pension=$${pensionGap}, taxTorpedo=$${taxTorpedo}, survivor=$${survivorGap} (rates: ${JSON.stringify(gapRates)})`
    );

    const monthlyTo20Year = config.CALCULATION_CONSTANTS?.monthly_to_20year || 240;
    const monthlyGap = pensionGap + survivorGap + Math.round(taxTorpedo / monthlyTo20Year);

    calculationLog.push(`[Gaps] Total monthly gap: $${monthlyGap}`);

    // D. Monthly Contribution & Lifetime Payout
    // Protect against division by zero
    const contributionDivisor = yearsUntilRetirementConverted * 7;
    const monthlyContribution =
      contributionDivisor > 0
        ? Math.round((monthlyGap * 12) / contributionDivisor)
        : 0;

    calculationLog.push(
      `[Calc] Required monthly contribution: $${monthlyContribution}`
    );

    const lifetimeMultiplier = config.CALCULATION_CONSTANTS?.lifetime_multiplier || 3.0;
    const lifetimePayout = Math.round(
      monthlyContribution * 12 * yearsUntilRetirementConverted * lifetimeMultiplier
    );

    calculationLog.push(`[Calc] Estimated lifetime payout: $${lifetimePayout}`);

    // Risk color mapping using configurable thresholds
    const riskThresholds = config.RISK_THRESHOLDS || { low: 39, moderate: 69 };
    let riskColor;
    if (clampedRiskScore <= riskThresholds.low) {
      riskColor = "green";
    } else if (clampedRiskScore <= riskThresholds.moderate) {
      riskColor = "gold";
    } else {
      riskColor = "red";
    }

    // Calculate total gap for downstream components
    const totalGap = pensionGap * monthlyTo20Year + survivorGap * monthlyTo20Year + taxTorpedo;

    calculationLog.push(
      `[Total] Total gap calculated: $${totalGap} = (${pensionGap} * ${monthlyTo20Year}) + (${survivorGap} * ${monthlyTo20Year}) + ${taxTorpedo}`
    );

    // Return calculated results
    return {
      // Input data (normalized)
      profession,
      yearsOfService,
      currentPension,
      state,
      cola,
      survivorIncome,
      otherSavings,
      currentAge,
      retirementAge,
      yearsUntilRetirement,
      retirementAgeBand,
      yearsUntilRetirementBand,

      // Calculated outputs
      hiddenBenefitOpportunity,
      riskScore: clampedRiskScore,
      riskColor,
      pensionGap,
      taxTorpedo,
      survivorGap,
      monthlyGap,
      monthlyContribution,
      lifetimePayout,
      totalGap, // Add totalGap to standardize data structure
      calculationLog,

      // Risk components (for debugging/display)
      riskComponents: {
        pensionRisk,
        taxRisk,
        survivorRisk,
        earlyRetireBonus,
        taxSurprisesBonus,
      },

      // Multipliers used (for debugging/display)
      multipliers: {
        professionFactor,
        stateFactor,
        coverageLevel,
        colaValue,
        yearsUntilRetirementConverted,
      },

      // Structured gap data for downstream components
      gaps: {
        pension: {
          amount: pensionGap * 240, // Convert monthly to 20-year total
          monthly: pensionGap,
          risk: pensionRisk > 60 ? "high" : pensionRisk > 30 ? "medium" : "low",
          description: `Monthly pension gap: $${pensionGap}/month`,
        },
        tax: {
          amount: taxTorpedo,
          risk: taxRisk > 60 ? "high" : taxRisk > 30 ? "medium" : "low",
          description: `Tax torpedo impact: $${taxTorpedo}`,
        },
        survivor: {
          amount: survivorGap * 240, // Convert monthly to 20-year total
          monthly: survivorGap,
          risk:
            survivorRisk > 60 ? "high" : survivorRisk > 30 ? "medium" : "low",
          description: `Monthly survivor benefit gap: $${survivorGap}/month`,
        },
      },
    };
  } catch (error) {
    calculationLog.push(`[Error] Calculation failed: ${error.message}`);

    // Enhanced error logging with more details
    console.error("Calculation Engine Error:", {
      error: error.message,
      stack: error.stack,
      userData: userData,
      timestamp: new Date().toISOString(),
    });

    // Return a safe fallback result with error information
    return createErrorResult(error, userData, calculationLog);
  }
};

/**
 * Validate user data before calculation
 * @param {Object} userData - User input data
 * @returns {Object} Validation result
 */
export const validateUserData = (userData) => {
  const errors = [];
  const warnings = [];

  if (!userData) {
    errors.push("User data is required");
    return { isValid: false, errors, warnings };
  }

  // Required fields validation
  if (!userData.profession) {
    errors.push("Profession is required");
  }

  if (
    !userData.yearsOfService ||
    userData.yearsOfService < 5 ||
    userData.yearsOfService > 40
  ) {
    errors.push("Years of service must be between 5 and 40");
  }

  if (!userData.state) {
    errors.push("State is required");
  }

  // Age validation with comprehensive checks
  const currentAge = parseInt(userData.currentAge);
  const retirementAge = parseInt(userData.retirementAge);

  if (!currentAge || currentAge < 21 || currentAge > 80) {
    errors.push("Current age must be between 21 and 80");
  }

  if (!retirementAge || retirementAge < 50 || retirementAge > 80) {
    errors.push("Retirement age must be between 50 and 80");
  }

  // Cross-field validation for ages
  if (currentAge && retirementAge) {
    if (retirementAge <= currentAge) {
      errors.push("Retirement age must be greater than current age");
    }

    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement > 50) {
      warnings.push(
        "Very long time until retirement - consider reviewing your timeline"
      );
    }

    if (yearsToRetirement < 5) {
      warnings.push(
        "Short time until retirement - consider aggressive savings strategies"
      );
    }
  }

  // Pension validation - skip validation if pension is unknown or set to "I don't know"
  if (
    userData.pensionEstimate &&
    !userData.pensionUnknown &&
    userData.pensionEstimate !== "I don't know" &&
    (isNaN(parseFloat(userData.pensionEstimate)) ||
      parseFloat(userData.pensionEstimate) < 0)
  ) {
    errors.push("Pension estimate must be a valid positive number");
  }

  if (
    userData.pensionEstimate &&
    !userData.pensionUnknown &&
    userData.pensionEstimate !== "I don't know" &&
    parseFloat(userData.pensionEstimate) > 20000
  ) {
    warnings.push("Very high pension estimate - please verify this amount");
  }

  // Savings validation
  if (
    userData.currentSavings &&
    (isNaN(parseFloat(userData.currentSavings)) ||
      parseFloat(userData.currentSavings) < 0)
  ) {
    errors.push("Current savings must be a valid positive number");
  }

  // Warnings for missing optional data
  if (!userData.pensionEstimate && !userData.pensionUnknown) {
    warnings.push("Pension estimate not provided - using profession default");
  }

  if (
    !userData.currentSavings &&
    userData.currentSavings !== 0 &&
    !userData.preferNotToSay
  ) {
    warnings.push("Current savings not provided - assuming $0");
  }

  if (!userData.inflationProtection && userData.inflationProtection !== false) {
    warnings.push(
      "Inflation protection preference not specified - this affects risk calculations"
    );
  }

  if (!userData.survivorPlanning && userData.survivorPlanning !== false) {
    warnings.push(
      "Survivor planning preference not specified - this affects risk calculations"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Refresh configuration cache - call this when admin updates settings
 */
export const refreshCalculationConfig = async () => {
  cachedConfig = null;
  return configService.refreshCache();
};

export default calculateBenefitGaps;
