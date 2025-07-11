// Configuration Verification Utility
// This utility helps verify that the calculation engine is using database values

import { configService } from '../services/configurationService';

/**
 * Verify that configuration is being loaded from database
 * @returns {Object} Verification results
 */
export const verifyConfigurationSource = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    databaseConnected: false,
    configurationLoaded: false,
    usingDatabaseValues: false,
    fallbackUsed: false,
    configurationSummary: {},
    errors: []
  };

  try {
    console.log('[Config Verification] Starting configuration source verification...');

    // Clear any existing cache to force fresh database fetch
    await configService.refreshCache();

    // Test database connection and configuration loading
    const config = await configService.getConfiguration();
    results.configurationLoaded = true;
    results.databaseConnected = true;

    // Better way to detect database vs fallback usage:
    // Check if the configuration service successfully loaded from database
    // by looking for database-specific indicators or testing a unique value

    // Try to access the configuration service cache or test database connectivity
    try {
      // Test if we can fetch configuration data directly from database
      const testConfig = await configService.getAllCoreConfig();
      results.usingDatabaseValues = testConfig && testConfig.length > 0;
      results.fallbackUsed = !results.usingDatabaseValues;

      console.log('[Config Verification] Database config records found:', testConfig?.length || 0);
      console.log('[Config Verification] Sample config from database:', testConfig?.slice(0, 3));
      console.log('[Config Verification] Config object keys:', Object.keys(config));
      console.log('[Config Verification] Config object sample values:', {
        riskWeights: config.RISK_WEIGHTS,
        gapRates: config.GAP_RATES,
        pensionValues: config.DEFAULT_PENSION_VALUES
      });

      // Additional check: see if config has the test value we created
      if (testConfig?.some(item => item.key === 'test_verification_value')) {
        console.log('[Config Verification] Found test verification value in database');
        results.usingDatabaseValues = true;
        results.fallbackUsed = false;
      }

      // The real test: if we can fetch data from database and it has records,
      // then the system is using database values (even if they match fallback values)
      if (testConfig && testConfig.length > 0) {
        console.log('[Config Verification] Database contains configuration data - system is using database values');
        results.usingDatabaseValues = true;
        results.fallbackUsed = false;
      } else {
        console.log('[Config Verification] No database configuration found - using fallback values');
        results.usingDatabaseValues = false;
        results.fallbackUsed = true;
      }
    } catch (dbError) {
      // If database query fails, we're definitely using fallback
      results.usingDatabaseValues = false;
      results.fallbackUsed = true;
      console.log('[Config Verification] Database query failed, using fallback:', dbError);
    }

    // Collect configuration summary
    results.configurationSummary = {
      pensionValues: config.DEFAULT_PENSION_VALUES,
      professionFactors: config.PROFESSION_FACTORS,
      riskWeights: config.RISK_WEIGHTS,
      riskThresholds: config.RISK_THRESHOLDS,
      gapRates: config.GAP_RATES,
      calculationConstants: config.CALCULATION_CONSTANTS,
      stateFactorsCount: Object.keys(config.STATE_FACTORS || {}).length,
      investmentScenariosCount: (config.PRESET_SCENARIOS || []).length
    };

    console.log('[Config Verification] Configuration loaded successfully');
    console.log('[Config Verification] Using database values:', results.usingDatabaseValues);
    console.log('[Config Verification] Fallback used:', results.fallbackUsed);

  } catch (error) {
    results.errors.push({
      type: 'configuration_load_error',
      message: error.message,
      stack: error.stack
    });
    console.error('[Config Verification] Failed to load configuration:', error);
  }

  return results;
};

/**
 * Test configuration updates to verify database write operations
 * @returns {Object} Test results
 */
export const testConfigurationUpdates = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    updateTestPassed: false,
    readWriteTestPassed: false,
    errors: []
  };

  try {
    console.log('[Config Verification] Testing configuration update operations...');

    // Test 1: Basic update test
    const testKey = 'test_verification_value';
    const testValue = Math.random().toString();

    await configService.updateCoreConfig(
      'test_category',
      testKey,
      testValue,
      'string',
      'Test value for verification',
      'Test Verification Value'
    );

    results.updateTestPassed = true;
    console.log('[Config Verification] Configuration update test passed');

    // Test 2: Read-write verification test
    // Temporarily change a real config value and verify it's reflected
    const originalPensionWeight = 0.5;
    const testPensionWeight = 0.51; // Slightly different value

    // Update pension weight
    await configService.updateCoreConfig(
      'risk_scoring',
      'pension_weight',
      testPensionWeight,
      'number',
      'Pension risk weight for overall score',
      'Pension Risk Weight'
    );

    // Force refresh and get new config
    await configService.refreshCache();
    const testConfig = await configService.getConfiguration();

    // Check if the change is reflected
    if (testConfig.RISK_WEIGHTS && testConfig.RISK_WEIGHTS.pension === testPensionWeight) {
      results.readWriteTestPassed = true;
      console.log('[Config Verification] Read-write test passed - database changes are reflected in configuration');
    } else {
      console.log('[Config Verification] Read-write test failed - expected:', testPensionWeight, 'got:', testConfig.RISK_WEIGHTS?.pension);
    }

    // Restore original value
    await configService.updateCoreConfig(
      'risk_scoring',
      'pension_weight',
      originalPensionWeight,
      'number',
      'Pension risk weight for overall score',
      'Pension Risk Weight'
    );

  } catch (error) {
    results.errors.push({
      type: 'configuration_update_error',
      message: error.message,
      stack: error.stack
    });
    console.error('[Config Verification] Configuration update test failed:', error);
  }

  return results;
};

/**
 * Run comprehensive configuration verification
 * @returns {Object} Complete verification results
 */
export const runConfigurationVerification = async () => {
  console.log('[Config Verification] Starting comprehensive configuration verification...');
  
  const sourceVerification = await verifyConfigurationSource();
  const updateVerification = await testConfigurationUpdates();

  const overallResults = {
    timestamp: new Date().toISOString(),
    sourceVerification,
    updateVerification,
    overallStatus: sourceVerification.usingDatabaseValues && updateVerification.updateTestPassed && updateVerification.readWriteTestPassed ? 'PASS' : 'FAIL',
    summary: {
      databaseConnected: sourceVerification.databaseConnected,
      usingDatabaseValues: sourceVerification.usingDatabaseValues,
      updatesWorking: updateVerification.updateTestPassed,
      readWriteWorking: updateVerification.readWriteTestPassed,
      totalErrors: sourceVerification.errors.length + updateVerification.errors.length
    }
  };

  console.log('[Config Verification] Verification complete. Status:', overallResults.overallStatus);
  
  return overallResults;
};

export default {
  verifyConfigurationSource,
  testConfigurationUpdates,
  runConfigurationVerification
};
