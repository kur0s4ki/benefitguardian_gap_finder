// Calculator Logic Analysis and Testing
// This file analyzes the gap calculator logic for inconsistencies

// Mock user data from the calculator
const userData = {
  profession: 'teacher',
  yearsOfService: 15,
  currentAge: 45,
  state: 'California',
  monthlyPension: 2800,
  gaps: {
    pension: {
      amount: 125000,
      risk: 'high',
      description: 'Projected pension shortfall based on inflation and longevity'
    },
    tax: {
      amount: 85000,
      risk: 'medium',
      description: 'Tax torpedo impact on retirement withdrawals'
    },
    survivor: {
      amount: 95000,
      risk: 'high',
      description: 'Survivor benefit protection gap for spouse'
    }
  },
  totalGap: 305000,
  riskScore: 78
};

// Preset scenarios from the calculator
const presetScenarios = [
  {
    name: 'Conservative',
    monthlyContribution: 300,
    targetRetirementAge: 67,
    riskTolerance: 'conservative',
    description: 'Lower risk, steady growth approach'
  },
  {
    name: 'Moderate',
    monthlyContribution: 500,
    targetRetirementAge: 65,
    riskTolerance: 'moderate',
    description: 'Balanced risk and growth strategy'
  },
  {
    name: 'Aggressive',
    monthlyContribution: 750,
    targetRetirementAge: 62,
    riskTolerance: 'aggressive',
    description: 'Higher risk, accelerated growth plan'
  }
];

// Original calculation function from the calculator
const calculateProjections = (scenario) => {
  const yearsToRetirement = scenario.targetRetirementAge - userData.currentAge;
  const totalContributions = scenario.monthlyContribution * 12 * yearsToRetirement;
  
  const growthMultipliers = {
    conservative: 1.06,
    moderate: 1.08,
    aggressive: 1.10
  };
  
  const multiplier = growthMultipliers[scenario.riskTolerance];
  const projectedValue = totalContributions * Math.pow(multiplier, yearsToRetirement);
  
  const gapClosure = Math.min((projectedValue / userData.totalGap) * 100, 100);
  
  return {
    totalContributions,
    projectedValue,
    gapClosure,
    yearsToRetirement,
    monthlyNeeded: Math.ceil(userData.totalGap / (12 * yearsToRetirement * multiplier))
  };
};

// Analysis functions
function analyzeCalculatorLogic() {
  console.log("=== CALCULATOR LOGIC ANALYSIS ===\n");
  
  // Test 1: Basic calculations for preset scenarios
  console.log("1. PRESET SCENARIOS ANALYSIS:");
  presetScenarios.forEach(scenario => {
    const projections = calculateProjections(scenario);
    console.log(`\n${scenario.name} Scenario:`);
    console.log(`  Monthly Contribution: $${scenario.monthlyContribution}`);
    console.log(`  Target Retirement Age: ${scenario.targetRetirementAge}`);
    console.log(`  Years to Retirement: ${projections.yearsToRetirement}`);
    console.log(`  Total Contributions: $${projections.totalContributions.toLocaleString()}`);
    console.log(`  Projected Value: $${projections.projectedValue.toLocaleString()}`);
    console.log(`  Gap Closure: ${projections.gapClosure.toFixed(1)}%`);
    console.log(`  Monthly Needed: $${projections.monthlyNeeded.toLocaleString()}`);
  });
  
  // Test 2: Edge cases
  console.log("\n\n2. EDGE CASE ANALYSIS:");
  
  // Edge case: Very young person
  const youngPersonScenario = {
    monthlyContribution: 500,
    targetRetirementAge: 65,
    riskTolerance: 'moderate'
  };
  
  const originalAge = userData.currentAge;
  userData.currentAge = 25; // Very young
  const youngProjections = calculateProjections(youngPersonScenario);
  console.log(`\nVery Young Person (age 25):`);
  console.log(`  Years to Retirement: ${youngProjections.yearsToRetirement}`);
  console.log(`  Projected Value: $${youngProjections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${youngProjections.gapClosure.toFixed(1)}%`);
  
  // Edge case: Near retirement
  userData.currentAge = 60; // Near retirement
  const nearRetirementProjections = calculateProjections(youngPersonScenario);
  console.log(`\nNear Retirement (age 60):`);
  console.log(`  Years to Retirement: ${nearRetirementProjections.yearsToRetirement}`);
  console.log(`  Projected Value: $${nearRetirementProjections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${nearRetirementProjections.gapClosure.toFixed(1)}%`);
  
  // Edge case: Already at retirement age
  userData.currentAge = 65; // At retirement age
  const atRetirementProjections = calculateProjections(youngPersonScenario);
  console.log(`\nAt Retirement Age (age 65):`);
  console.log(`  Years to Retirement: ${atRetirementProjections.yearsToRetirement}`);
  console.log(`  Projected Value: $${atRetirementProjections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${atRetirementProjections.gapClosure.toFixed(1)}%`);
  
  // Edge case: Past retirement age
  userData.currentAge = 70; // Past retirement age
  const pastRetirementProjections = calculateProjections(youngPersonScenario);
  console.log(`\nPast Retirement Age (age 70):`);
  console.log(`  Years to Retirement: ${pastRetirementProjections.yearsToRetirement}`);
  console.log(`  Projected Value: $${pastRetirementProjections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${pastRetirementProjections.gapClosure.toFixed(1)}%`);
  
  // Reset age
  userData.currentAge = originalAge;
  
  // Test 3: Zero and negative values
  console.log("\n\n3. ZERO AND NEGATIVE VALUE ANALYSIS:");
  
  const zeroContributionScenario = {
    monthlyContribution: 0,
    targetRetirementAge: 65,
    riskTolerance: 'moderate'
  };
  const zeroProjections = calculateProjections(zeroContributionScenario);
  console.log(`\nZero Monthly Contribution:`);
  console.log(`  Projected Value: $${zeroProjections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${zeroProjections.gapClosure.toFixed(1)}%`);
  
  // Test 4: Extreme values
  console.log("\n\n4. EXTREME VALUE ANALYSIS:");
  
  const extremeScenario = {
    monthlyContribution: 10000, // Very high contribution
    targetRetirementAge: 65,
    riskTolerance: 'aggressive'
  };
  const extremeProjections = calculateProjections(extremeScenario);
  console.log(`\nExtreme High Contribution ($10,000/month):`);
  console.log(`  Projected Value: $${extremeProjections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${extremeProjections.gapClosure.toFixed(1)}%`);
  
  return {
    presetResults: presetScenarios.map(s => ({ scenario: s, projections: calculateProjections(s) })),
    edgeCases: {
      young: youngProjections,
      nearRetirement: nearRetirementProjections,
      atRetirement: atRetirementProjections,
      pastRetirement: pastRetirementProjections,
      zeroContribution: zeroProjections,
      extreme: extremeProjections
    }
  };
}

// Identify potential issues
function identifyIssues() {
  console.log("\n\n=== IDENTIFIED ISSUES AND INCONSISTENCIES ===\n");
  
  const issues = [];
  
  // Issue 1: Compound interest calculation is incorrect
  issues.push({
    severity: "CRITICAL",
    issue: "Incorrect Compound Interest Formula",
    description: "The calculator uses simple multiplication instead of proper compound interest formula",
    currentFormula: "totalContributions * Math.pow(multiplier, yearsToRetirement)",
    correctFormula: "PMT * (((1 + r)^n - 1) / r) * (1 + r) for annuity due",
    impact: "Significantly overestimates projected values, especially for longer time periods"
  });
  
  // Issue 2: Growth multipliers don't match stated percentages
  issues.push({
    severity: "HIGH",
    issue: "Growth Rate Inconsistency",
    description: "UI shows 4-6%, 6-8%, 8-10% but multipliers are 6%, 8%, 10%",
    currentValues: "conservative: 1.06 (6%), moderate: 1.08 (8%), aggressive: 1.10 (10%)",
    expectedValues: "Should use ranges or clarify if these are guaranteed rates",
    impact: "User confusion about actual expected returns"
  });
  
  // Issue 3: No input validation
  issues.push({
    severity: "MEDIUM",
    issue: "Missing Input Validation",
    description: "No validation for negative years to retirement or invalid scenarios",
    examples: "Age 70 with retirement age 65 gives negative years",
    impact: "Can produce nonsensical results and break calculations"
  });
  
  // Issue 4: monthlyNeeded calculation is flawed
  issues.push({
    severity: "HIGH",
    issue: "Incorrect Monthly Needed Calculation",
    description: "Uses wrong formula for calculating required monthly contribution",
    currentFormula: "Math.ceil(userData.totalGap / (12 * yearsToRetirement * multiplier))",
    correctFormula: "Should use present value of annuity formula",
    impact: "Provides incorrect guidance on required contributions"
  });
  
  // Issue 5: No consideration of inflation
  issues.push({
    severity: "MEDIUM",
    issue: "No Inflation Adjustment",
    description: "Gap amounts and contributions not adjusted for inflation",
    impact: "Real purchasing power not accurately represented"
  });
  
  // Issue 6: Gap closure calculation caps at 100%
  issues.push({
    severity: "LOW",
    issue: "Gap Closure Capped at 100%",
    description: "Math.min caps gap closure at 100%, hiding over-funding scenarios",
    impact: "Users can't see when they're saving more than needed"
  });
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.severity}] ${issue.issue}`);
    console.log(`   Description: ${issue.description}`);
    if (issue.currentFormula) console.log(`   Current: ${issue.currentFormula}`);
    if (issue.correctFormula) console.log(`   Correct: ${issue.correctFormula}`);
    if (issue.currentValues) console.log(`   Current: ${issue.currentValues}`);
    if (issue.expectedValues) console.log(`   Expected: ${issue.expectedValues}`);
    if (issue.examples) console.log(`   Examples: ${issue.examples}`);
    console.log(`   Impact: ${issue.impact}\n`);
  });
  
  return issues;
}

// Corrected calculation function
function calculateProjectionsCorrect(scenario) {
  const yearsToRetirement = scenario.targetRetirementAge - userData.currentAge;
  
  // Input validation
  if (yearsToRetirement <= 0) {
    return {
      totalContributions: 0,
      projectedValue: 0,
      gapClosure: 0,
      yearsToRetirement: yearsToRetirement,
      monthlyNeeded: 0,
      error: "Invalid: Already at or past retirement age"
    };
  }
  
  const monthlyRate = {
    conservative: 0.05 / 12, // 5% annual = ~0.42% monthly
    moderate: 0.07 / 12,     // 7% annual = ~0.58% monthly  
    aggressive: 0.09 / 12    // 9% annual = ~0.75% monthly
  };
  
  const rate = monthlyRate[scenario.riskTolerance];
  const months = yearsToRetirement * 12;
  const monthlyContribution = scenario.monthlyContribution;
  
  // Future Value of Ordinary Annuity formula: PMT * (((1 + r)^n - 1) / r)
  const projectedValue = monthlyContribution * (Math.pow(1 + rate, months) - 1) / rate;
  const totalContributions = monthlyContribution * months;
  
  const gapClosure = (projectedValue / userData.totalGap) * 100;
  
  // Calculate required monthly payment to reach gap
  const monthlyNeeded = userData.totalGap * rate / (Math.pow(1 + rate, months) - 1);
  
  return {
    totalContributions,
    projectedValue,
    gapClosure,
    yearsToRetirement,
    monthlyNeeded: Math.ceil(monthlyNeeded)
  };
}

// Compare original vs corrected calculations
function compareCalculations() {
  console.log("\n\n=== ORIGINAL VS CORRECTED CALCULATIONS ===\n");
  
  presetScenarios.forEach(scenario => {
    const original = calculateProjections(scenario);
    const corrected = calculateProjectionsCorrect(scenario);
    
    console.log(`${scenario.name} Scenario Comparison:`);
    console.log(`  Original Projected Value: $${original.projectedValue.toLocaleString()}`);
    console.log(`  Corrected Projected Value: $${corrected.projectedValue.toLocaleString()}`);
    console.log(`  Difference: $${(original.projectedValue - corrected.projectedValue).toLocaleString()}`);
    console.log(`  Original Gap Closure: ${original.gapClosure.toFixed(1)}%`);
    console.log(`  Corrected Gap Closure: ${corrected.gapClosure.toFixed(1)}%`);
    console.log(`  Original Monthly Needed: $${original.monthlyNeeded.toLocaleString()}`);
    console.log(`  Corrected Monthly Needed: $${corrected.monthlyNeeded.toLocaleString()}\n`);
  });
}

// Additional test cases
function additionalTestCases() {
  console.log("\n\n=== ADDITIONAL TEST CASES ===\n");

  // Test boundary conditions
  console.log("BOUNDARY CONDITIONS:");

  // Test minimum retirement age
  const minRetirementScenario = {
    monthlyContribution: 500,
    targetRetirementAge: 55, // UI minimum
    riskTolerance: 'moderate'
  };
  userData.currentAge = 45;
  const minRetirement = calculateProjections(minRetirementScenario);
  console.log(`Minimum Retirement Age (55): Gap Closure ${minRetirement.gapClosure.toFixed(1)}%`);

  // Test maximum retirement age
  const maxRetirementScenario = {
    monthlyContribution: 500,
    targetRetirementAge: 70, // UI maximum
    riskTolerance: 'moderate'
  };
  const maxRetirement = calculateProjections(maxRetirementScenario);
  console.log(`Maximum Retirement Age (70): Gap Closure ${maxRetirement.gapClosure.toFixed(1)}%`);

  // Test consistency across risk tolerances with same parameters
  console.log("\nRISK TOLERANCE CONSISTENCY:");
  const baseScenario = {
    monthlyContribution: 500,
    targetRetirementAge: 65
  };

  ['conservative', 'moderate', 'aggressive'].forEach(risk => {
    const scenario = { ...baseScenario, riskTolerance: risk };
    const result = calculateProjections(scenario);
    console.log(`${risk}: $${result.projectedValue.toLocaleString()} (${result.gapClosure.toFixed(1)}%)`);
  });

  // Test mathematical relationships
  console.log("\nMATHEMATICAL RELATIONSHIPS:");

  // Double contribution should roughly double projected value (it doesn't due to wrong formula)
  const singleContrib = calculateProjections({
    monthlyContribution: 500,
    targetRetirementAge: 65,
    riskTolerance: 'moderate'
  });

  const doubleContrib = calculateProjections({
    monthlyContribution: 1000,
    targetRetirementAge: 65,
    riskTolerance: 'moderate'
  });

  console.log(`Single contribution ($500): $${singleContrib.projectedValue.toLocaleString()}`);
  console.log(`Double contribution ($1000): $${doubleContrib.projectedValue.toLocaleString()}`);
  console.log(`Ratio: ${(doubleContrib.projectedValue / singleContrib.projectedValue).toFixed(2)}x (should be ~2x)`);
}

// Performance and precision tests
function performancePrecisionTests() {
  console.log("\n\nPERFORMACE & PRECISION TESTS:");

  // Test floating point precision
  const precisionScenario = {
    monthlyContribution: 333.33, // Repeating decimal
    targetRetirementAge: 65,
    riskTolerance: 'moderate'
  };

  const precisionResult = calculateProjections(precisionScenario);
  console.log(`Precision test (333.33): $${precisionResult.projectedValue.toFixed(2)}`);

  // Test very large numbers
  const largeScenario = {
    monthlyContribution: 50000,
    targetRetirementAge: 65,
    riskTolerance: 'aggressive'
  };

  userData.currentAge = 25; // Long time horizon
  const largeResult = calculateProjections(largeScenario);
  console.log(`Large numbers test: $${largeResult.projectedValue.toLocaleString()}`);
  userData.currentAge = 45; // Reset
}

// Generate recommendations
function generateRecommendations() {
  console.log("\n\n=== RECOMMENDATIONS FOR FIXES ===\n");

  const recommendations = [
    {
      priority: 1,
      title: "Fix Compound Interest Formula",
      description: "Replace the current formula with proper future value of annuity calculation",
      implementation: `
// Current (WRONG):
const projectedValue = totalContributions * Math.pow(multiplier, yearsToRetirement);

// Correct:
const monthlyRate = annualRate / 12;
const months = yearsToRetirement * 12;
const projectedValue = monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      `,
      impact: "Critical - fixes massive overestimation of returns"
    },
    {
      priority: 2,
      title: "Add Input Validation",
      description: "Validate all inputs before calculations",
      implementation: `
if (scenario.targetRetirementAge <= userData.currentAge) {
  return { error: "Retirement age must be greater than current age" };
}
if (scenario.monthlyContribution < 0) {
  return { error: "Monthly contribution cannot be negative" };
}
      `,
      impact: "High - prevents nonsensical results"
    },
    {
      priority: 3,
      title: "Fix Monthly Needed Calculation",
      description: "Use proper present value of annuity formula",
      implementation: `
// Current (WRONG):
monthlyNeeded: Math.ceil(userData.totalGap / (12 * yearsToRetirement * multiplier))

// Correct:
const monthlyNeeded = userData.totalGap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
      `,
      impact: "High - provides accurate contribution guidance"
    },
    {
      priority: 4,
      title: "Clarify Growth Rates",
      description: "Either use rate ranges or clarify that displayed rates are point estimates",
      implementation: "Update UI to show 'Target: 7% annually' instead of '6-8% growth'",
      impact: "Medium - reduces user confusion"
    },
    {
      priority: 5,
      title: "Add Inflation Adjustment",
      description: "Adjust future values for inflation",
      implementation: `
const inflationRate = 0.03; // 3% annual inflation
const realRate = (1 + nominalRate) / (1 + inflationRate) - 1;
      `,
      impact: "Medium - provides more realistic projections"
    },
    {
      priority: 6,
      title: "Remove Gap Closure Cap",
      description: "Allow gap closure to exceed 100% to show over-funding",
      implementation: "Remove Math.min() wrapper from gap closure calculation",
      impact: "Low - better user insight into over-funding scenarios"
    }
  ];

  recommendations.forEach(rec => {
    console.log(`${rec.priority}. ${rec.title}`);
    console.log(`   Description: ${rec.description}`);
    console.log(`   Implementation: ${rec.implementation}`);
    console.log(`   Impact: ${rec.impact}\n`);
  });
}

// Run the analysis
const results = analyzeCalculatorLogic();
const issues = identifyIssues();
compareCalculations();
additionalTestCases();
performancePrecisionTests();
generateRecommendations();

console.log("\n=== FINAL SUMMARY ===");
console.log(`Found ${issues.length} issues:`);
console.log(`- ${issues.filter(i => i.severity === 'CRITICAL').length} Critical`);
console.log(`- ${issues.filter(i => i.severity === 'HIGH').length} High`);
console.log(`- ${issues.filter(i => i.severity === 'MEDIUM').length} Medium`);
console.log(`- ${issues.filter(i => i.severity === 'LOW').length} Low`);
console.log("\nThe most critical issue is the incorrect compound interest formula,");
console.log("which causes massive overestimation of projected returns.");
console.log("This could mislead users about their retirement readiness.");
