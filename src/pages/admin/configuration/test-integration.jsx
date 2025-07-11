import React, { useState } from 'react';
import { testRiskConfiguration, demonstrateThresholdDifference } from '../../../utils/testRiskConfiguration';
import Icon from '../../../components/AppIcon';

const ConfigurationIntegrationTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);
  const [demonstrationResults, setDemonstrationResults] = useState(null);

  const runTests = async () => {
    setTesting(true);
    setTestResults(null);
    
    try {
      console.log('Starting configuration integration tests...');
      const results = await testRiskConfiguration();
      setTestResults(results);
      
      // Also run the demonstration
      await demonstrateThresholdDifference();
      setDemonstrationResults(true);
      
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="TestTube" size={24} className="text-primary" />
            <h1 className="text-2xl font-bold text-text-primary">Configuration Integration Test</h1>
          </div>
          <p className="text-text-secondary mb-6">
            Test that risk thresholds are properly loaded from the database and that admin changes 
            immediately reflect in the risk calculation and display components.
          </p>
          
          <button
            onClick={runTests}
            disabled={testing}
            className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Icon name="Play" size={20} />
                <span>Run Integration Tests</span>
              </>
            )}
          </button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon 
                name={testResults.success ? "CheckCircle" : "XCircle"} 
                size={20} 
                className={testResults.success ? "text-success" : "text-error"} 
              />
              <h2 className="text-lg font-semibold text-text-primary">
                Test Results
              </h2>
            </div>
            
            {testResults.success ? (
              <div className="space-y-4">
                <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                  <p className="text-success-800 font-medium">
                    ✅ All tests passed! Configuration integration is working correctly.
                  </p>
                </div>
                
                {testResults.thresholds && (
                  <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
                    <h3 className="font-medium text-info-800 mb-2">Current Database Configuration:</h3>
                    <div className="text-sm text-info-700">
                      <p><strong>Risk Thresholds:</strong></p>
                      <ul className="ml-4 list-disc">
                        <li>Low Risk: 0-{testResults.thresholds.low}</li>
                        <li>Moderate Risk: {testResults.thresholds.low + 1}-{testResults.thresholds.moderate}</li>
                        <li>High Risk: {testResults.thresholds.moderate + 1}-100</li>
                      </ul>
                      
                      {testResults.componentThresholds && (
                        <>
                          <p className="mt-2"><strong>Component Thresholds:</strong></p>
                          <ul className="ml-4 list-disc">
                            <li>Low Severity: 0-{testResults.componentThresholds.low}</li>
                            <li>Medium Severity: {testResults.componentThresholds.low + 1}-{testResults.componentThresholds.medium}</li>
                            <li>High Severity: {testResults.componentThresholds.medium + 1}-100</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-error-800 font-medium">
                  ❌ Tests failed: {testResults.error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Info" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Testing Instructions</h2>
          </div>
          
          <div className="space-y-4 text-text-secondary">
            <div>
              <h3 className="font-medium text-text-primary mb-2">Manual Testing Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Run the integration tests above to verify current configuration</li>
                <li>Go to the Risk Scoring configuration tab</li>
                <li>Change the risk thresholds (e.g., Low: 39→45, Moderate: 69→75)</li>
                <li>Navigate to any page with risk displays (Results Dashboard, Gap Calculator)</li>
                <li>Verify that risk colors and labels reflect the new thresholds</li>
                <li>Check browser console for configuration loading logs</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-text-primary mb-2">Expected Behavior:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Risk thresholds should load from database, not hardcoded values</li>
                <li>Admin changes should immediately affect risk classifications</li>
                <li>Fallback values should be used if database is unavailable</li>
                <li>Cache should refresh when configuration changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationIntegrationTest;
