// Test script to verify the pension unknown fix
import { calculateBenefitGaps, validateUserData } from './src/utils/calculationEngine.js';

console.log('Testing pension unknown functionality...\n');

// Test case 1: User selects "I don't know what my pension is"
const testDataUnknownPension = {
  profession: 'teacher',
  yearsOfService: 20,
  state: 'CA',
  currentAge: 45,
  retirementAge: 65,
  pensionEstimate: "I don't know",
  pensionUnknown: true,
  currentSavings: 50000,
  inflationProtection: 'yes',
  survivorPlanning: 'yes',
  financialFears: ['outliving-money']
};

console.log('Test 1: Pension Unknown = true, pensionEstimate = "I don\'t know"');
console.log('Input data:', JSON.stringify(testDataUnknownPension, null, 2));

// Test validation
const validation1 = validateUserData(testDataUnknownPension);
console.log('\nValidation result:');
console.log('- Is valid:', validation1.isValid);
console.log('- Errors:', validation1.errors);
console.log('- Warnings:', validation1.warnings);

if (validation1.isValid) {
  // Test calculation
  const result1 = calculateBenefitGaps(testDataUnknownPension);
  console.log('\nCalculation result:');
  console.log('- Current pension used:', result1.currentPension);
  console.log('- Pension gap:', result1.pensionGap);
  console.log('- Total gap:', result1.totalGap);
  console.log('- Risk score:', result1.riskScore);
  console.log('- Success: Calculator works with unknown pension!');
} else {
  console.log('- FAILED: Validation should pass when pension is unknown');
}

console.log('\n' + '='.repeat(60) + '\n');

// Test case 2: User provides a specific pension amount
const testDataKnownPension = {
  ...testDataUnknownPension,
  pensionEstimate: 3500,
  pensionUnknown: false
};

console.log('Test 2: Pension Unknown = false, pensionEstimate = 3500');
console.log('Input data:', JSON.stringify(testDataKnownPension, null, 2));

// Test validation
const validation2 = validateUserData(testDataKnownPension);
console.log('\nValidation result:');
console.log('- Is valid:', validation2.isValid);
console.log('- Errors:', validation2.errors);
console.log('- Warnings:', validation2.warnings);

if (validation2.isValid) {
  // Test calculation
  const result2 = calculateBenefitGaps(testDataKnownPension);
  console.log('\nCalculation result:');
  console.log('- Current pension used:', result2.currentPension);
  console.log('- Pension gap:', result2.pensionGap);
  console.log('- Total gap:', result2.totalGap);
  console.log('- Risk score:', result2.riskScore);
  console.log('- Success: Calculator works with known pension!');
} else {
  console.log('- FAILED: Validation should pass with valid pension amount');
}

console.log('\n' + '='.repeat(60) + '\n');

// Test case 3: Invalid pension amount (should fail validation)
const testDataInvalidPension = {
  ...testDataUnknownPension,
  pensionEstimate: 'invalid',
  pensionUnknown: false
};

console.log('Test 3: Pension Unknown = false, pensionEstimate = "invalid"');
console.log('Input data:', JSON.stringify(testDataInvalidPension, null, 2));

// Test validation
const validation3 = validateUserData(testDataInvalidPension);
console.log('\nValidation result:');
console.log('- Is valid:', validation3.isValid);
console.log('- Errors:', validation3.errors);
console.log('- Warnings:', validation3.warnings);

if (!validation3.isValid) {
  console.log('- Success: Validation correctly rejects invalid pension amount!');
} else {
  console.log('- FAILED: Validation should reject invalid pension amount');
}

console.log('\n' + '='.repeat(60) + '\n');
console.log('Test Summary:');
console.log('- Test 1 (Unknown pension): Should PASS validation and calculation');
console.log('- Test 2 (Known pension): Should PASS validation and calculation');
console.log('- Test 3 (Invalid pension): Should FAIL validation');
console.log('\nIf all tests behave as expected, the fix is working correctly!');
