// PublicServ Wealth Group™ Gap Finder - Calculation Engine
// Implements the client's specified calculation logic

/**
 * Default pension values when user selects "I don't know"
 */
const DEFAULT_PENSION_VALUES = {
  'teacher': 3200,
  'nurse': 2800,
  'first-responder': 4100,
  'state-local-hero': 3500
};

/**
 * Profession multipliers for calculations
 */
const PROFESSION_FACTORS = {
  'teacher': 1.0,
  'nurse': 1.15,
  'first-responder': 1.25,
  'state-local-hero': 1.05
};

/**
 * State multipliers for cost of living adjustments
 */
const STATE_FACTORS = {
  'CA': 1.2, 'NY': 1.2, 'TX': 1.2,
  'FL': 1.1, 'PA': 1.1, 'IL': 1.1,
  'WA': 1.1, 'MA': 1.1, 'NJ': 1.1,
  'VA': 1.1, 'NC': 1.0, 'GA': 1.0,
  'OH': 1.0, 'MI': 1.0, 'AZ': 1.0,
  'TN': 1.0, 'IN': 1.0, 'MO': 1.0,
  'MD': 1.1, 'WI': 1.0, 'CO': 1.1,
  'MN': 1.0, 'SC': 1.0, 'AL': 1.0,
  'LA': 1.0, 'KY': 1.0, 'OR': 1.1,
  'OK': 1.0, 'CT': 1.1, 'UT': 1.0,
  'IA': 1.0, 'NV': 1.0, 'AR': 1.0,
  'MS': 1.0, 'KS': 1.0, 'NM': 1.0,
  'NE': 1.0, 'WV': 1.0, 'ID': 1.0,
  'HI': 1.2, 'NH': 1.0, 'ME': 1.0,
  'MT': 1.0, 'RI': 1.0, 'DE': 1.0,
  'SD': 1.0, 'ND': 1.0, 'AK': 1.2,
  'VT': 1.0, 'WY': 1.0
};

/**
 * Coverage level mapping for survivor benefits
 */
const COVERAGE_LEVELS = {
  'yes': 0.3,
  'no': 1.0,
  true: 0.3,
  false: 1.0
};

/**
 * COLA (Cost of Living Adjustment) values
 */
const COLA_VALUES = {
  'yes': 1,
  'no': 0,
  'unsure': 0,
  true: 1,
  false: 0
};

/**
 * Years until retirement conversion from bands to numeric values
 */
const YEARS_UNTIL_RETIREMENT_CONVERSION = {
  '5-10': 8,
  '11-15': 13,
  '16-20': 18,
  '21-25': 23,
  '26+': 28
};

/**
 * Convert retirement age to band
 */
const getRetirementAgeBand = (age) => {
  if (age >= 55 && age <= 62) return '55-62';
  if (age >= 63 && age <= 67) return '63-67';
  if (age >= 68) return '68+';
  return '63-67'; // default
};

/**
 * Convert years until retirement to band
 */
const getYearsUntilRetirementBand = (years) => {
  if (years >= 5 && years <= 10) return '5-10';
  if (years >= 11 && years <= 15) return '11-15';
  if (years >= 16 && years <= 20) return '16-20';
  if (years >= 21 && years <= 25) return '21-25';
  if (years >= 26) return '26+';
  return '16-20'; // default
};

/**
 * Main calculation engine
 * @param {Object} userData - User input data
 * @returns {Object} Calculated results
 */
export const calculateBenefitGaps = (userData) => {
  const calculationLog = ['[Log] Calculation engine started.'];

  try {
    // Input validation
    if (!userData) {
      throw new Error('User data is required');
    }

  // Extract and normalize data
  const profession = userData.profession?.toLowerCase() || 'teacher';
  const yearsOfService = parseInt(userData.yearsOfService) || 15;
  const state = userData.state || 'CA';
  const cola = userData.cola || userData.inflationProtection || 'no';
  const survivorIncome = userData.survivorIncome || userData.survivorPlanning || 'no';
  const otherSavings = parseFloat(userData.otherSavings || userData.currentSavings) || 0;
  const financialFears = userData.financialFears || [];
  const currentAge = parseInt(userData.currentAge) || 45;
  const retirementAge = parseInt(userData.retirementAge) || 65;

  calculationLog.push(`[Input] Normalized inputs: profession=${profession}, yos=${yearsOfService}, state=${state}, cola=${cola}, survivor=${survivorIncome}, savings=${otherSavings}, age=${currentAge}, retireAge=${retirementAge}`);

  // Handle pension estimate
  let currentPension;
  if (userData.pensionUnknown || userData.pensionEstimate === "I don't know" || !userData.pensionEstimate) {
    currentPension = DEFAULT_PENSION_VALUES[profession] || DEFAULT_PENSION_VALUES.teacher;
    calculationLog.push(`[Pension] User pension unknown. Using default for ${profession}: $${currentPension}`);
  } else {
    currentPension = parseFloat(userData.pensionEstimate) || DEFAULT_PENSION_VALUES[profession];
    calculationLog.push(`[Pension] User provided pension: $${currentPension}`);
  }

  // Calculate derived values
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

  calculationLog.push(`[Derived] Years until retirement: ${yearsUntilRetirement}`);

  if (yearsUntilRetirement <= 0) {
    throw new Error('Retirement age must be greater than current age');
  }

  const retirementAgeBand = getRetirementAgeBand(retirementAge);
  const yearsUntilRetirementBand = getYearsUntilRetirementBand(yearsUntilRetirement);

  calculationLog.push(`[Derived] Retirement bands: age=${retirementAgeBand}, years=${yearsUntilRetirementBand}`);

  // Get multipliers
  const professionFactor = PROFESSION_FACTORS[profession] || 1.0;
  const stateFactor = STATE_FACTORS[state] || 1.0;
  const coverageLevel = COVERAGE_LEVELS[survivorIncome] || 1.0;
  const colaValue = COLA_VALUES[cola] || 0;
  const yearsUntilRetirementConverted = YEARS_UNTIL_RETIREMENT_CONVERSION[yearsUntilRetirementBand] || 18;

  calculationLog.push(`[Factors] Multipliers: profession=${professionFactor}, state=${stateFactor}, coverage=${coverageLevel}, cola=${colaValue}, yearsBand=${yearsUntilRetirementConverted}`);

  // A. Hidden Benefit Opportunity
  const hiddenBenefitOpportunity = Math.round(
    1800 * (yearsOfService / 28) * professionFactor * stateFactor
  );

  calculationLog.push(`[Calc] Hidden Benefit Opportunity: $${hiddenBenefitOpportunity} = 1800 * (${yearsOfService}/28) * ${professionFactor} * ${stateFactor}`);

  // B. Risk Score Components
  const earlyRetireBonus = (retirementAgeBand === '55-62') ? 20 : 0;
  const taxSurprisesBonus = financialFears.includes('tax-surprises') || 
                           financialFears.includes('Tax surprises') ? 30 : 0;

  calculationLog.push(`[Risk] Bonuses: earlyRetire=${earlyRetireBonus}, taxSurprise=${taxSurprisesBonus}`);

  const pensionRisk = Math.min(100, Math.max(0, 80 - (colaValue * 30) + earlyRetireBonus));
  const taxRisk = Math.min(100, (otherSavings / 100000) * 25 + taxSurprisesBonus);
  const survivorRisk = Math.round(80 * coverageLevel);

  calculationLog.push(`[Risk] Risk components: pensionRisk=${pensionRisk}, taxRisk=${taxRisk}, survivorRisk=${survivorRisk}`);

  const riskScore = Math.round(
    (pensionRisk * 0.5) + (taxRisk * 0.3) + (survivorRisk * 0.2)
  );

  calculationLog.push(`[Risk] Raw risk score: ${riskScore}`);

  // Ensure riskScore stays within 0-100 bounds even as weightings evolve
  const clampedRiskScore = Math.min(100, Math.max(0, riskScore));

  if (clampedRiskScore !== riskScore) calculationLog.push(`[Risk] Clamped risk score: ${clampedRiskScore}`);

  // C. Gap Calculations
  const pensionGap = Math.round(currentPension * 0.03 * yearsOfService);
  const taxTorpedo = Math.round(otherSavings * 0.30);
  const survivorGap = Math.round(currentPension * 0.40);

  calculationLog.push(`[Gaps] Calculated gaps: pension=$${pensionGap}, taxTorpedo=$${taxTorpedo}, survivor=$${survivorGap}`);

  const monthlyGap = pensionGap + survivorGap + Math.round(taxTorpedo / 240);

  calculationLog.push(`[Gaps] Total monthly gap: $${monthlyGap}`);

  // D. Monthly Contribution & Lifetime Payout
  const monthlyContribution = Math.round(
    (monthlyGap * 12) / (yearsUntilRetirementConverted * 7)
  );

  calculationLog.push(`[Calc] Required monthly contribution: $${monthlyContribution}`);

  const lifetimePayout = Math.round(
    (monthlyContribution * 12 * yearsUntilRetirementConverted) * 3.0
  );

  calculationLog.push(`[Calc] Estimated lifetime payout: $${lifetimePayout}`);

  // Risk color mapping
  let riskColor;
  if (clampedRiskScore < 40) {
    riskColor = 'green';
  } else if (clampedRiskScore >= 40 && clampedRiskScore <= 70) {
    riskColor = 'gold';
  } else {
    riskColor = 'red';
  }

  // Calculate total gap for downstream components
  const totalGap = (pensionGap + survivorGap) * 240 + taxTorpedo;

  calculationLog.push(`[Total] Total gap calculated: $${totalGap} = (${pensionGap} + ${survivorGap}) * 240 + ${taxTorpedo}`);

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
      taxSurprisesBonus
    },
    
    // Multipliers used (for debugging/display)
    multipliers: {
      professionFactor,
      stateFactor,
      coverageLevel,
      colaValue,
      yearsUntilRetirementConverted
    },

    // Structured gap data for downstream components
    gaps: {
      pension: {
        amount: pensionGap * 240, // Convert monthly to 20-year total
        monthly: pensionGap,
        risk: pensionRisk > 60 ? 'high' : pensionRisk > 30 ? 'medium' : 'low',
        description: `Monthly pension gap: $${pensionGap}/month`
      },
      tax: {
        amount: taxTorpedo,
        risk: taxRisk > 60 ? 'high' : taxRisk > 30 ? 'medium' : 'low',
        description: `Tax torpedo impact: $${taxTorpedo}`
      },
      survivor: {
        amount: survivorGap * 240, // Convert monthly to 20-year total
        monthly: survivorGap,
        risk: survivorRisk > 60 ? 'high' : survivorRisk > 30 ? 'medium' : 'low',
        description: `Monthly survivor benefit gap: $${survivorGap}/month`
      }
    }
  };

  } catch (error) {
    calculationLog.push(`[Error] Calculation failed: ${error.message}`);
    
    // Return a safe fallback result with error information
    return {
      error: error.message,
      calculationLog,
      // Provide safe defaults
      profession: userData?.profession || 'unknown',
      riskScore: 50,
      riskColor: 'gold',
      totalGap: 0,
      pensionGap: 0,
      taxTorpedo: 0,
      survivorGap: 0,
      monthlyGap: 0,
      monthlyContribution: 0,
      lifetimePayout: 0,
      hiddenBenefitOpportunity: 0,
      riskComponents: {
        pensionRisk: 0,
        taxRisk: 0,
        survivorRisk: 0,
        earlyRetireBonus: 0,
        taxSurprisesBonus: 0
      },
      gaps: {
        pension: { amount: 0, monthly: 0, risk: 'low', description: 'Error in calculation' },
        tax: { amount: 0, risk: 'low', description: 'Error in calculation' },
        survivor: { amount: 0, monthly: 0, risk: 'low', description: 'Error in calculation' }
      }
    };
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
    errors.push('User data is required');
    return { isValid: false, errors, warnings };
  }

  // Required fields validation
  if (!userData.profession) {
    errors.push('Profession is required');
  }

  if (!userData.yearsOfService || userData.yearsOfService < 5 || userData.yearsOfService > 40) {
    errors.push('Years of service must be between 5 and 40');
  }

  if (!userData.state) {
    errors.push('State is required');
  }

  // Age validation with comprehensive checks
  const currentAge = parseInt(userData.currentAge);
  const retirementAge = parseInt(userData.retirementAge);

  if (!currentAge || currentAge < 21 || currentAge > 80) {
    errors.push('Current age must be between 21 and 80');
  }

  if (!retirementAge || retirementAge < 50 || retirementAge > 80) {
    errors.push('Retirement age must be between 50 and 80');
  }

  // Cross-field validation for ages
  if (currentAge && retirementAge) {
    if (retirementAge <= currentAge) {
      errors.push('Retirement age must be greater than current age');
    }
    
    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement > 50) {
      warnings.push('Very long time until retirement - consider reviewing your timeline');
    }
    
    if (yearsToRetirement < 5) {
      warnings.push('Short time until retirement - consider aggressive savings strategies');
    }
  }

  // Pension validation
  if (userData.pensionEstimate && (isNaN(parseFloat(userData.pensionEstimate)) || parseFloat(userData.pensionEstimate) < 0)) {
    errors.push('Pension estimate must be a valid positive number');
  }

  if (userData.pensionEstimate && parseFloat(userData.pensionEstimate) > 20000) {
    warnings.push('Very high pension estimate - please verify this amount');
  }

  // Savings validation
  if (userData.currentSavings && (isNaN(parseFloat(userData.currentSavings)) || parseFloat(userData.currentSavings) < 0)) {
    errors.push('Current savings must be a valid positive number');
  }

  // Warnings for missing optional data
  if (!userData.pensionEstimate && !userData.pensionUnknown) {
    warnings.push('Pension estimate not provided - using profession default');
  }

  if (!userData.currentSavings && userData.currentSavings !== 0 && !userData.preferNotToSay) {
    warnings.push('Current savings not provided - assuming $0');
  }

  if (!userData.inflationProtection && userData.inflationProtection !== false) {
    warnings.push('Inflation protection preference not specified - this affects risk calculations');
  }

  if (!userData.survivorPlanning && userData.survivorPlanning !== false) {
    warnings.push('Survivor planning preference not specified - this affects risk calculations');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
export default calculateBenefitGaps;

