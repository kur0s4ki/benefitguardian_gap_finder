// Test the new calculation engine implementation
import { calculateBenefitGaps, validateUserData } from './src/utils/calculationEngine.js';

console.log("=== TESTING CALCULATION ENGINE ===\n");

// Test data matching client specification
const testCases = [
  {
    name: "Teacher - California",
    data: {
      profession: 'teacher',
      yearsOfService: 15,
      pensionEstimate: 3200,
      state: 'CA',
      currentAge: 45,
      retirementAge: 62,
      inflationProtection: false, // maps to cola: 'no'
      survivorPlanning: false, // maps to survivorIncome: 'no'
      currentSavings: 125000,
      financialFears: ['pension-cuts', 'healthcare-retirement']
    }
  },
  {
    name: "Nurse - Texas",
    data: {
      profession: 'nurse',
      yearsOfService: 20,
      pensionEstimate: 2800,
      state: 'TX',
      currentAge: 50,
      retirementAge: 65,
      inflationProtection: true, // maps to cola: 'yes'
      survivorPlanning: true, // maps to survivorIncome: 'yes'
      currentSavings: 200000,
      financialFears: ['market-crashes', 'tax-surprises']
    }
  },
  {
    name: "First Responder - Unknown Pension",
    data: {
      profession: 'first-responder',
      yearsOfService: 25,
      pensionUnknown: true, // Should use default $4,100
      state: 'FL',
      currentAge: 48,
      retirementAge: 55, // Early retirement
      inflationProtection: 'unsure',
      survivorPlanning: false,
      currentSavings: 75000,
      financialFears: ['outliving-savings', 'tax-surprises']
    }
  }
];

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`);
  console.log("Input Data:", JSON.stringify(testCase.data, null, 2));
  
  // Validate data
  const validation = validateUserData(testCase.data);
  console.log("Validation:", validation);
  
  if (validation.isValid) {
    try {
      const results = calculateBenefitGaps(testCase.data);
      
      console.log("\nCalculated Results:");
      console.log(`  Hidden Benefit Opportunity: $${results.hiddenBenefitOpportunity}/month`);
      console.log(`  Risk Score: ${results.riskScore} (${results.riskColor})`);
      console.log(`  Pension Gap: $${results.pensionGap}/month`);
      console.log(`  Tax Torpedo: $${results.taxTorpedo.toLocaleString()}`);
      console.log(`  Survivor Gap: $${results.survivorGap}/month`);
      console.log(`  Monthly Gap Total: $${results.monthlyGap}/month`);
      console.log(`  Monthly Contribution Needed: $${results.monthlyContribution}/month`);
      console.log(`  Lifetime Payout: $${results.lifetimePayout.toLocaleString()}`);
      
      console.log("\nRisk Components:");
      console.log(`  Pension Risk: ${results.riskComponents.pensionRisk}`);
      console.log(`  Tax Risk: ${results.riskComponents.taxRisk}`);
      console.log(`  Survivor Risk: ${results.riskComponents.survivorRisk}`);
      
      console.log("\nMultipliers Used:");
      console.log(`  Profession Factor: ${results.multipliers.professionFactor}`);
      console.log(`  State Factor: ${results.multipliers.stateFactor}`);
      console.log(`  Coverage Level: ${results.multipliers.coverageLevel}`);
      console.log(`  COLA Value: ${results.multipliers.colaValue}`);
      
    } catch (error) {
      console.log("Calculation Error:", error.message);
    }
  }
  
  console.log("\n" + "=".repeat(60) + "\n");
});

// Test edge cases
console.log("EDGE CASE TESTING:\n");

const edgeCases = [
  {
    name: "Missing Required Data",
    data: {
      profession: 'teacher'
      // Missing other required fields
    }
  },
  {
    name: "Invalid Years of Service",
    data: {
      profession: 'teacher',
      yearsOfService: 50, // Too high
      state: 'CA'
    }
  },
  {
    name: "Unknown State",
    data: {
      profession: 'teacher',
      yearsOfService: 15,
      state: 'ZZ', // Invalid state
      currentAge: 45,
      retirementAge: 65
    }
  }
];

edgeCases.forEach((testCase, index) => {
  console.log(`Edge Case ${index + 1}: ${testCase.name}`);
  
  const validation = validateUserData(testCase.data);
  console.log("Validation:", validation);
  
  if (validation.isValid) {
    try {
      const results = calculateBenefitGaps(testCase.data);
      console.log("Results calculated successfully");
      console.log(`Risk Score: ${results.riskScore}`);
    } catch (error) {
      console.log("Calculation Error:", error.message);
    }
  }
  
  console.log("");
});

console.log("=== CALCULATION ENGINE TESTING COMPLETE ===");
