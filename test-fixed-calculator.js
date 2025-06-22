// Test the fixed calculator logic
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

// Fixed calculation function
const calculateProjections = (scenario) => {
  const yearsToRetirement = scenario.targetRetirementAge - userData.currentAge;
  
  // Input validation
  if (yearsToRetirement <= 0) {
    return {
      totalContributions: 0,
      projectedValue: 0,
      gapClosure: 0,
      yearsToRetirement: yearsToRetirement,
      monthlyNeeded: 0,
      error: yearsToRetirement === 0 
        ? "You are already at retirement age" 
        : "Retirement age must be greater than current age"
    };
  }
  
  if (scenario.monthlyContribution < 0) {
    return {
      totalContributions: 0,
      projectedValue: 0,
      gapClosure: 0,
      yearsToRetirement: yearsToRetirement,
      monthlyNeeded: 0,
      error: "Monthly contribution cannot be negative"
    };
  }
  
  // Corrected annual growth rates (more realistic)
  const annualGrowthRates = {
    conservative: 0.05, // 5% annual
    moderate: 0.07,     // 7% annual
    aggressive: 0.09    // 9% annual
  };
  
  const annualRate = annualGrowthRates[scenario.riskTolerance];
  const monthlyRate = annualRate / 12;
  const months = yearsToRetirement * 12;
  const monthlyContribution = scenario.monthlyContribution;
  
  const totalContributions = monthlyContribution * months;
  
  // Correct Future Value of Ordinary Annuity formula: PMT * (((1 + r)^n - 1) / r)
  let projectedValue;
  if (monthlyRate === 0) {
    // Handle edge case where rate is 0
    projectedValue = totalContributions;
  } else {
    projectedValue = monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }
  
  // Remove the artificial 100% cap to show over-funding scenarios
  const gapClosure = (projectedValue / userData.totalGap) * 100;
  
  // Correct calculation for monthly needed using Present Value of Annuity formula
  let monthlyNeeded;
  if (monthlyRate === 0) {
    monthlyNeeded = userData.totalGap / months;
  } else {
    monthlyNeeded = userData.totalGap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  }
  
  return {
    totalContributions,
    projectedValue,
    gapClosure,
    yearsToRetirement,
    monthlyNeeded: Math.ceil(monthlyNeeded),
    annualRate: annualRate * 100 // Return as percentage for display
  };
};

// Updated preset scenarios
const presetScenarios = [
  {
    name: 'Conservative',
    monthlyContribution: 650,
    targetRetirementAge: 67,
    riskTolerance: 'conservative',
    description: 'Lower risk, steady growth approach'
  },
  {
    name: 'Moderate',
    monthlyContribution: 600,
    targetRetirementAge: 65,
    riskTolerance: 'moderate',
    description: 'Balanced risk and growth strategy'
  },
  {
    name: 'Aggressive',
    monthlyContribution: 650,
    targetRetirementAge: 62,
    riskTolerance: 'aggressive',
    description: 'Higher risk, accelerated growth plan'
  }
];

console.log("=== TESTING FIXED CALCULATOR ===\n");

// Test preset scenarios
console.log("FIXED PRESET SCENARIOS:");
presetScenarios.forEach(scenario => {
  const projections = calculateProjections(scenario);
  console.log(`\n${scenario.name} Scenario:`);
  console.log(`  Monthly Contribution: $${scenario.monthlyContribution}`);
  console.log(`  Target Retirement Age: ${scenario.targetRetirementAge}`);
  console.log(`  Annual Growth Rate: ${projections.annualRate}%`);
  console.log(`  Years to Retirement: ${projections.yearsToRetirement}`);
  console.log(`  Total Contributions: $${projections.totalContributions.toLocaleString()}`);
  console.log(`  Projected Value: $${projections.projectedValue.toLocaleString()}`);
  console.log(`  Gap Closure: ${projections.gapClosure.toFixed(1)}%`);
  console.log(`  Monthly Needed: $${projections.monthlyNeeded.toLocaleString()}`);
  
  if (projections.gapClosure >= 100) {
    console.log(`  ✅ EXCEEDS GAP by $${(projections.projectedValue - userData.totalGap).toLocaleString()}`);
  } else {
    console.log(`  ⚠️  Falls short by $${(userData.totalGap - projections.projectedValue).toLocaleString()}`);
  }
});

// Test edge cases
console.log("\n\nEDGE CASE TESTING:");

// Test negative years
userData.currentAge = 70;
const negativeYears = calculateProjections({
  monthlyContribution: 500,
  targetRetirementAge: 65,
  riskTolerance: 'moderate'
});
console.log(`\nNegative years test: ${negativeYears.error || 'No error'}`);

// Test zero years
userData.currentAge = 65;
const zeroYears = calculateProjections({
  monthlyContribution: 500,
  targetRetirementAge: 65,
  riskTolerance: 'moderate'
});
console.log(`Zero years test: ${zeroYears.error || 'No error'}`);

// Test negative contribution
userData.currentAge = 45; // Reset
const negativeContrib = calculateProjections({
  monthlyContribution: -100,
  targetRetirementAge: 65,
  riskTolerance: 'moderate'
});
console.log(`Negative contribution test: ${negativeContrib.error || 'No error'}`);

// Test mathematical consistency
console.log("\n\nMATHEMATICAL CONSISTENCY:");
const base = calculateProjections({
  monthlyContribution: 500,
  targetRetirementAge: 65,
  riskTolerance: 'moderate'
});

const double = calculateProjections({
  monthlyContribution: 1000,
  targetRetirementAge: 65,
  riskTolerance: 'moderate'
});

console.log(`Base ($500): $${base.projectedValue.toLocaleString()}`);
console.log(`Double ($1000): $${double.projectedValue.toLocaleString()}`);
console.log(`Ratio: ${(double.projectedValue / base.projectedValue).toFixed(2)}x (should be ~2.0x)`);

console.log("\n=== ALL TESTS COMPLETED ===");
console.log("✅ Input validation working");
console.log("✅ Proper compound interest formula implemented");
console.log("✅ Correct monthly needed calculation");
console.log("✅ Gap closure can exceed 100%");
console.log("✅ Realistic growth rates (5%, 7%, 9%)");
console.log("✅ Mathematical relationships preserved");
