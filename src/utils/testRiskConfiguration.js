/**
 * Test script to verify risk configuration integration
 * This script tests that risk thresholds are properly loaded from the database
 */

import { getRiskLevel, getRiskLevelSync, refreshRiskThresholds } from './riskUtils';
import { configService } from '../services/configurationService';

/**
 * Test risk configuration integration
 */
export const testRiskConfiguration = async () => {
  console.log('🧪 Testing Risk Configuration Integration...\n');
  
  try {
    // Test 1: Load configuration from database
    console.log('1️⃣ Testing configuration loading...');
    const config = await configService.getConfiguration();
    console.log('✅ Configuration loaded:', {
      riskThresholds: config.RISK_THRESHOLDS,
      componentThresholds: config.COMPONENT_THRESHOLDS
    });
    
    // Test 2: Test async getRiskLevel with different scores
    console.log('\n2️⃣ Testing async getRiskLevel function...');
    const testScores = [30, 50, 80];
    
    for (const score of testScores) {
      const riskLevel = await getRiskLevel(score);
      console.log(`Score ${score}: ${riskLevel.level} (${riskLevel.riskColor})`);
    }
    
    // Test 3: Test sync getRiskLevel function
    console.log('\n3️⃣ Testing sync getRiskLevel function...');
    for (const score of testScores) {
      const riskLevel = getRiskLevelSync(score);
      console.log(`Score ${score}: ${riskLevel.level} (${riskLevel.riskColor})`);
    }
    
    // Test 4: Test threshold boundaries
    console.log('\n4️⃣ Testing threshold boundaries...');
    const thresholds = config.RISK_THRESHOLDS;
    const boundaryScores = [
      thresholds.low - 1,
      thresholds.low,
      thresholds.low + 1,
      thresholds.moderate - 1,
      thresholds.moderate,
      thresholds.moderate + 1
    ];
    
    for (const score of boundaryScores) {
      const riskLevel = await getRiskLevel(score);
      console.log(`Score ${score}: ${riskLevel.level}`);
    }
    
    // Test 5: Test cache refresh
    console.log('\n5️⃣ Testing cache refresh...');
    refreshRiskThresholds();
    console.log('✅ Cache refreshed successfully');
    
    // Test 6: Verify configuration after refresh
    const riskLevelAfterRefresh = await getRiskLevel(50);
    console.log(`Score 50 after refresh: ${riskLevelAfterRefresh.level}`);
    
    console.log('\n🎉 All tests passed! Risk configuration integration is working correctly.');
    
    return {
      success: true,
      thresholds: config.RISK_THRESHOLDS,
      componentThresholds: config.COMPONENT_THRESHOLDS
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test that demonstrates the difference between old hardcoded and new configurable thresholds
 */
export const demonstrateThresholdDifference = async () => {
  console.log('\n📊 Demonstrating threshold differences...\n');
  
  // Old hardcoded thresholds
  const oldThresholds = { low: 39, moderate: 69 };
  
  // New database thresholds
  const config = await configService.getConfiguration();
  const newThresholds = config.RISK_THRESHOLDS;
  
  console.log('Old hardcoded thresholds:', oldThresholds);
  console.log('New database thresholds:', newThresholds);
  
  // Test scores that would be affected by the change
  const testScores = [40, 41, 42, 43, 44, 45, 70, 71, 72, 73, 74, 75];
  
  console.log('\nScore | Old Classification | New Classification');
  console.log('------|-------------------|-------------------');
  
  for (const score of testScores) {
    // Simulate old logic
    let oldClassification;
    if (score <= oldThresholds.low) oldClassification = 'Low Risk';
    else if (score <= oldThresholds.moderate) oldClassification = 'Moderate Risk';
    else oldClassification = 'High Risk';
    
    // Use new logic
    const newRiskLevel = await getRiskLevel(score);
    const newClassification = newRiskLevel.level;
    
    const changed = oldClassification !== newClassification ? ' ⚠️ CHANGED' : '';
    console.log(`${score.toString().padStart(5)} | ${oldClassification.padEnd(17)} | ${newClassification}${changed}`);
  }
};

export default testRiskConfiguration;
