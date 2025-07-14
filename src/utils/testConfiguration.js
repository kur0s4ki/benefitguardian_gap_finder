// Test script to verify configuration system
import { configService } from '../services/configurationService';

export const testConfigurationSystem = async () => {
  console.log('🧪 Testing Configuration System...');
  
  try {
    // Test 1: Load configuration
    console.log('\n1️⃣ Testing configuration loading...');
    const config = await configService.getConfiguration();
    console.log('✅ Configuration loaded successfully');
    console.log('📊 Config keys:', Object.keys(config));
    
    // Test 2: Verify core configuration values
    console.log('\n2️⃣ Testing core configuration values...');
    console.log('Risk Weights:', config.RISK_WEIGHTS);
    console.log('Risk Thresholds:', config.RISK_THRESHOLDS);
    console.log('Gap Rates:', config.GAP_RATES);
    
    // Test 3: Verify profession configuration
    console.log('\n3️⃣ Testing profession configuration...');
    console.log('Default Pension Values:', config.DEFAULT_PENSION_VALUES);
    console.log('Profession Factors:', config.PROFESSION_FACTORS);
    
    // Test 4: Verify state configuration
    console.log('\n4️⃣ Testing state configuration...');
    console.log('Sample State Factors (CA, NY, TX):', {
      CA: config.STATE_FACTORS.CA,
      NY: config.STATE_FACTORS.NY,
      TX: config.STATE_FACTORS.TX
    });
    
    // Test 5: Verify investment scenarios
    console.log('\n5️⃣ Testing investment scenarios...');
    console.log('Investment Growth Rates:', config.INVESTMENT_GROWTH_RATES);
    console.log('Preset Scenarios:', config.PRESET_SCENARIOS?.map(s => s.name));
    
    // Test 6: Test cache functionality
    console.log('\n6️⃣ Testing cache functionality...');
    const startTime = Date.now();
    const cachedConfig = await configService.getConfiguration();
    const cacheTime = Date.now() - startTime;
    console.log(`✅ Cached config loaded in ${cacheTime}ms`);
    
    // Test 7: Test admin methods (read-only)
    console.log('\n7️⃣ Testing admin data retrieval...');
    const coreConfig = await configService.getAllCoreConfig();
    const professionConfig = await configService.getAllProfessionConfig();
    const stateConfig = await configService.getAllStateConfig();
    const investmentScenarios = await configService.getAllInvestmentScenarios();
    
    console.log(`✅ Core config records: ${coreConfig.length}`);
    console.log(`✅ Profession config records: ${professionConfig.length}`);
    console.log(`✅ State config records: ${stateConfig.length}`);
    console.log(`✅ Investment scenarios: ${investmentScenarios.length}`);
    
    console.log('\n🎉 All configuration tests passed!');
    return {
      success: true,
      config,
      stats: {
        coreConfigRecords: coreConfig.length,
        professionConfigRecords: professionConfig.length,
        stateConfigRecords: stateConfig.length,
        investmentScenarios: investmentScenarios.length
      }
    };
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test calculation engine with new configuration
export const testCalculationEngineWithConfig = async () => {
  console.log('\n🔧 Testing Calculation Engine with Database Configuration...');
  
  try {
    // Import the calculation engine
    const { calculateBenefitGaps } = await import('./calculationEngine');
    
    // Test data
    const testUserData = {
      profession: 'teacher',
      yearsOfService: 15,
      currentAge: 45,
      retirementAge: 65,
      pensionEstimate: 3500,
      state: 'CA',
      cola: 'yes',
      survivorIncome: 'no',
      otherSavings: 50000,
      financialFears: ['tax-surprises']
    };
    
    console.log('📝 Test user data:', testUserData);
    
    const startTime = Date.now();
    const results = await calculateBenefitGaps(testUserData);
    const calculationTime = Date.now() - startTime;
    
    console.log(`✅ Calculation completed in ${calculationTime}ms`);
    console.log('📊 Results summary:');
    console.log(`  - Risk Score: ${results.riskScore} (${results.riskColor})`);
    console.log(`  - Pension Gap: $${results.pensionGap}`);
    console.log(`  - Tax Torpedo: $${results.taxTorpedo}`);
    console.log(`  - Survivor Gap: $${results.survivorGap}`);
    console.log(`  - Monthly Contribution: $${results.monthlyContribution}`);
    console.log(`  - Hidden Benefit: $${results.hiddenBenefitOpportunity}`);
    
    return {
      success: true,
      results,
      calculationTime
    };
    
  } catch (error) {
    console.error('❌ Calculation engine test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run all tests
export const runAllConfigurationTests = async () => {
  console.log('🚀 Starting Configuration System Tests...');
  
  const configTest = await testConfigurationSystem();
  const calculationTest = await testCalculationEngineWithConfig();
  
  const allPassed = configTest.success && calculationTest.success;
  
  console.log('\n📋 Test Summary:');
  console.log(`Configuration Service: ${configTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Calculation Engine: ${calculationTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Overall: ${allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
  
  return {
    allPassed,
    configTest,
    calculationTest
  };
};
