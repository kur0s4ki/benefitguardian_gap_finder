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

  // Handle pension estimate
  let currentPension;
  if (userData.pensionUnknown || userData.pensionEstimate === "I don't know" || !userData.pensionEstimate) {
    currentPension = DEFAULT_PENSION_VALUES[profession] || DEFAULT_PENSION_VALUES.teacher;
  } else {
    currentPension = parseFloat(userData.pensionEstimate) || DEFAULT_PENSION_VALUES[profession];
  }

  // Calculate derived values
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
  const retirementAgeBand = getRetirementAgeBand(retirementAge);
  const yearsUntilRetirementBand = getYearsUntilRetirementBand(yearsUntilRetirement);

  // Get multipliers
  const professionFactor = PROFESSION_FACTORS[profession] || 1.0;
  const stateFactor = STATE_FACTORS[state] || 1.0;
  const coverageLevel = COVERAGE_LEVELS[survivorIncome] || 1.0;
  const colaValue = COLA_VALUES[cola] || 0;
  const yearsUntilRetirementConverted = YEARS_UNTIL_RETIREMENT_CONVERSION[yearsUntilRetirementBand] || 18;

  // A. Hidden Benefit Opportunity
  const hiddenBenefitOpportunity = Math.round(
    1800 * (yearsOfService / 28) * professionFactor * stateFactor
  );

  // B. Risk Score Components
  const earlyRetireBonus = (retirementAgeBand === '55-62') ? 20 : 0;
  const taxSurprisesBonus = financialFears.includes('tax-surprises') || 
                           financialFears.includes('Tax surprises') ? 30 : 0;

  const pensionRisk = Math.min(100, Math.max(0, 80 - (colaValue * 30) + earlyRetireBonus));
  const taxRisk = Math.min(100, (otherSavings / 100000) * 25 + taxSurprisesBonus);
  const survivorRisk = Math.round(80 * (1 - coverageLevel));

  const riskScore = Math.round(
    (pensionRisk * 0.5) + (taxRisk * 0.3) + (survivorRisk * 0.2)
  );

  // C. Gap Calculations
  const pensionGap = Math.round(currentPension * 0.03 * yearsOfService);
  const taxTorpedo = Math.round(otherSavings * 0.30);
  const survivorGap = Math.round(currentPension * 0.40);

  const monthlyGap = pensionGap + survivorGap + Math.round(taxTorpedo / 240);

  // D. Monthly Contribution & Lifetime Payout
  const monthlyContribution = Math.round(
    (monthlyGap * 12) / (yearsUntilRetirementConverted * 7)
  );

  const lifetimePayout = Math.round(
    (monthlyContribution * 12 * yearsUntilRetirementConverted) * 3.0
  );

  // Risk color mapping
  let riskColor;
  if (riskScore < 40) {
    riskColor = 'green';
  } else if (riskScore >= 40 && riskScore <= 70) {
    riskColor = 'gold';
  } else {
    riskColor = 'red';
  }

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
    riskScore,
    riskColor,
    pensionGap,
    taxTorpedo,
    survivorGap,
    monthlyGap,
    monthlyContribution,
    lifetimePayout,
    
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
    }
  };
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

  // Required fields
  if (!userData.profession) {
    errors.push('Profession is required');
  }

  if (!userData.yearsOfService || userData.yearsOfService < 5 || userData.yearsOfService > 40) {
    errors.push('Years of service must be between 5 and 40');
  }

  if (!userData.state) {
    errors.push('State is required');
  }

  // Warnings for missing optional data
  if (!userData.pensionEstimate && !userData.pensionUnknown) {
    warnings.push('Pension estimate not provided - using profession default');
  }

  if (!userData.currentSavings && userData.currentSavings !== 0) {
    warnings.push('Current savings not provided - assuming $0');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export default calculateBenefitGaps;
