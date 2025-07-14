import React, { useState } from 'react';
import { runConfigurationVerification } from '../../../utils/configVerification';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const ConfigurationVerification = () => {
  const { isAdmin } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  const runVerification = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      const verificationResults = await runConfigurationVerification();
      setResults(verificationResults);
    } catch (error) {
      setResults({
        overallStatus: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="ShieldX" size={48} className="text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-text-secondary">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="CheckCircle" size={24} className="text-primary" />
            <h1 className="text-2xl font-bold text-text-primary">Configuration Verification</h1>
          </div>
          <p className="text-text-secondary mb-6">
            Verify that the calculation engine is using database configuration values instead of hardcoded fallbacks.
          </p>

          <button
            onClick={runVerification}
            disabled={testing}
            className="btn-primary px-6 py-3 rounded-md font-medium flex items-center gap-2"
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running Verification...
              </>
            ) : (
              <>
                <Icon name="Play" size={16} />
                Run Configuration Verification
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className={`border rounded-lg p-6 ${
              results.overallStatus === 'PASS' 
                ? 'bg-success-50 border-success-200' 
                : 'bg-error-50 border-error-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <Icon 
                  name={results.overallStatus === 'PASS' ? "CheckCircle" : "XCircle"} 
                  size={24} 
                  className={results.overallStatus === 'PASS' ? "text-success-600" : "text-error-600"} 
                />
                <h2 className={`text-xl font-bold ${
                  results.overallStatus === 'PASS' ? "text-success-800" : "text-error-800"
                }`}>
                  {results.overallStatus === 'PASS' ? "Configuration Verification Passed!" : "Configuration Issues Detected"}
                </h2>
              </div>
              {results.error && (
                <p className="text-error-700">{results.error}</p>
              )}
            </div>

            {/* Summary */}
            {results.summary && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Verification Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`rounded-lg p-3 ${
                    results.summary.databaseConnected ? 'bg-success-50' : 'bg-error-50'
                  }`}>
                    <div className={`text-sm font-medium ${
                      results.summary.databaseConnected ? 'text-success-600' : 'text-error-600'
                    }`}>
                      Database Connection
                    </div>
                    <div className={`text-xl font-bold ${
                      results.summary.databaseConnected ? 'text-success-800' : 'text-error-800'
                    }`}>
                      {results.summary.databaseConnected ? 'Connected' : 'Failed'}
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${
                    results.summary.usingDatabaseValues ? 'bg-success-50' : 'bg-warning-50'
                  }`}>
                    <div className={`text-sm font-medium ${
                      results.summary.usingDatabaseValues ? 'text-success-600' : 'text-warning-600'
                    }`}>
                      Database Values
                    </div>
                    <div className={`text-xl font-bold ${
                      results.summary.usingDatabaseValues ? 'text-success-800' : 'text-warning-800'
                    }`}>
                      {results.summary.usingDatabaseValues ? 'Active' : 'Fallback'}
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${
                    results.summary.readWriteWorking ? 'bg-success-50' : 'bg-error-50'
                  }`}>
                    <div className={`text-sm font-medium ${
                      results.summary.readWriteWorking ? 'text-success-600' : 'text-error-600'
                    }`}>
                      Live Database
                    </div>
                    <div className={`text-xl font-bold ${
                      results.summary.readWriteWorking ? 'text-success-800' : 'text-error-800'
                    }`}>
                      {results.summary.readWriteWorking ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${
                    results.summary.totalErrors === 0 ? 'bg-success-50' : 'bg-error-50'
                  }`}>
                    <div className={`text-sm font-medium ${
                      results.summary.totalErrors === 0 ? 'text-success-600' : 'text-error-600'
                    }`}>
                      Total Errors
                    </div>
                    <div className={`text-xl font-bold ${
                      results.summary.totalErrors === 0 ? 'text-success-800' : 'text-error-800'
                    }`}>
                      {results.summary.totalErrors}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Configuration Summary */}
            {results.sourceVerification?.configurationSummary && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Current Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Risk Weights</h4>
                    <pre className="bg-background p-3 rounded text-sm text-text-secondary">
                      {JSON.stringify(results.sourceVerification.configurationSummary.riskWeights, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Gap Rates</h4>
                    <pre className="bg-background p-3 rounded text-sm text-text-secondary">
                      {JSON.stringify(results.sourceVerification.configurationSummary.gapRates, null, 2)}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">State Factors</h4>
                      <p className="text-text-secondary">
                        {results.sourceVerification.configurationSummary.stateFactorsCount} states configured
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Investment Scenarios</h4>
                      <p className="text-text-secondary">
                        {results.sourceVerification.configurationSummary.investmentScenariosCount} scenarios available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {(results.sourceVerification?.errors?.length > 0 || results.updateVerification?.errors?.length > 0) && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-error-800 mb-4">Errors Detected</h3>
                <div className="space-y-2">
                  {results.sourceVerification?.errors?.map((error, index) => (
                    <div key={index} className="text-error-700">
                      <strong>{error.type}:</strong> {error.message}
                    </div>
                  ))}
                  {results.updateVerification?.errors?.map((error, index) => (
                    <div key={index} className="text-error-700">
                      <strong>{error.type}:</strong> {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-center text-sm text-text-secondary">
              Verification completed at: {new Date(results.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationVerification;
