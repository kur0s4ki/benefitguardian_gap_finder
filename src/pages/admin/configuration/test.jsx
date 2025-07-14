import React, { useState } from 'react';
import { runAllConfigurationTests } from '../../../utils/testConfiguration';
import Icon from '../../../components/AppIcon';

const ConfigurationTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  const runTests = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      const testResults = await runAllConfigurationTests();
      setResults(testResults);
    } catch (error) {
      setResults({
        allPassed: false,
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
            <h1 className="text-2xl font-bold text-text-primary">Configuration System Test</h1>
          </div>
          <p className="text-text-secondary mb-6">
            Test the database-driven configuration system to ensure all components are working correctly.
          </p>
          
          <button
            onClick={runTests}
            disabled={testing}
            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {testing ? (
              <>
                <Icon name="Loader" size={20} className="animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Icon name="Play" size={20} />
                Run Configuration Tests
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className={`border rounded-lg p-6 ${
              results.allPassed 
                ? 'bg-success-50 border-success-200' 
                : 'bg-error-50 border-error-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <Icon 
                  name={results.allPassed ? "CheckCircle" : "XCircle"} 
                  size={24} 
                  className={results.allPassed ? "text-success-600" : "text-error-600"} 
                />
                <h2 className={`text-xl font-bold ${
                  results.allPassed ? "text-success-800" : "text-error-800"
                }`}>
                  {results.allPassed ? "All Tests Passed!" : "Some Tests Failed"}
                </h2>
              </div>
              {results.error && (
                <p className="text-error-700">{results.error}</p>
              )}
            </div>

            {/* Configuration Service Test */}
            {results.configTest && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon 
                    name={results.configTest.success ? "CheckCircle" : "XCircle"} 
                    size={20} 
                    className={results.configTest.success ? "text-success-600" : "text-error-600"} 
                  />
                  <h3 className="text-lg font-semibold text-text-primary">Configuration Service</h3>
                </div>
                
                {results.configTest.success ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-primary-50 rounded-lg p-3">
                        <div className="text-sm text-primary-600 font-medium">Core Config</div>
                        <div className="text-xl font-bold text-primary-800">
                          {results.configTest.stats?.coreConfigRecords || 0}
                        </div>
                      </div>
                      <div className="bg-secondary-50 rounded-lg p-3">
                        <div className="text-sm text-secondary-600 font-medium">Professions</div>
                        <div className="text-xl font-bold text-secondary-800">
                          {results.configTest.stats?.professionConfigRecords || 0}
                        </div>
                      </div>
                      <div className="bg-accent-50 rounded-lg p-3">
                        <div className="text-sm text-accent-600 font-medium">States</div>
                        <div className="text-xl font-bold text-accent-800">
                          {results.configTest.stats?.stateConfigRecords || 0}
                        </div>
                      </div>
                      <div className="bg-success-50 rounded-lg p-3">
                        <div className="text-sm text-success-600 font-medium">Scenarios</div>
                        <div className="text-xl font-bold text-success-800">
                          {results.configTest.stats?.investmentScenarios || 0}
                        </div>
                      </div>
                    </div>
                    
                    {results.configTest.config && (
                      <div className="mt-4">
                        <h4 className="font-medium text-text-primary mb-2">Sample Configuration Values:</h4>
                        <div className="bg-secondary-50 rounded-lg p-4 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>Risk Weights:</strong>
                              <ul className="ml-4 mt-1">
                                <li>Pension: {results.configTest.config.RISK_WEIGHTS?.pension}</li>
                                <li>Tax: {results.configTest.config.RISK_WEIGHTS?.tax}</li>
                                <li>Survivor: {results.configTest.config.RISK_WEIGHTS?.survivor}</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Default Pensions:</strong>
                              <ul className="ml-4 mt-1">
                                <li>Teacher: ${results.configTest.config.DEFAULT_PENSION_VALUES?.teacher}</li>
                                <li>Nurse: ${results.configTest.config.DEFAULT_PENSION_VALUES?.nurse}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-error-700">
                    {results.configTest.error}
                  </div>
                )}
              </div>
            )}

            {/* Calculation Engine Test */}
            {results.calculationTest && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon 
                    name={results.calculationTest.success ? "CheckCircle" : "XCircle"} 
                    size={20} 
                    className={results.calculationTest.success ? "text-success-600" : "text-error-600"} 
                  />
                  <h3 className="text-lg font-semibold text-text-primary">Calculation Engine</h3>
                </div>
                
                {results.calculationTest.success ? (
                  <div className="space-y-3">
                    <div className="text-sm text-text-secondary">
                      Calculation completed in {results.calculationTest.calculationTime}ms
                    </div>
                    
                    {results.calculationTest.results && (
                      <div className="bg-secondary-50 rounded-lg p-4">
                        <h4 className="font-medium text-text-primary mb-3">Sample Calculation Results:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-text-secondary">Risk Score</div>
                            <div className="font-bold text-lg">
                              {results.calculationTest.results.riskScore}
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                results.calculationTest.results.riskColor === 'green' ? 'bg-green-100 text-green-800' :
                                results.calculationTest.results.riskColor === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {results.calculationTest.results.riskColor}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-text-secondary">Pension Gap</div>
                            <div className="font-bold text-lg">${results.calculationTest.results.pensionGap}</div>
                          </div>
                          <div>
                            <div className="text-text-secondary">Monthly Contribution</div>
                            <div className="font-bold text-lg">${results.calculationTest.results.monthlyContribution}</div>
                          </div>
                          <div>
                            <div className="text-text-secondary">Tax Torpedo</div>
                            <div className="font-bold text-lg">${results.calculationTest.results.taxTorpedo}</div>
                          </div>
                          <div>
                            <div className="text-text-secondary">Survivor Gap</div>
                            <div className="font-bold text-lg">${results.calculationTest.results.survivorGap}</div>
                          </div>
                          <div>
                            <div className="text-text-secondary">Hidden Benefit</div>
                            <div className="font-bold text-lg">${results.calculationTest.results.hiddenBenefitOpportunity}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-error-700">
                    {results.calculationTest.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationTest;
