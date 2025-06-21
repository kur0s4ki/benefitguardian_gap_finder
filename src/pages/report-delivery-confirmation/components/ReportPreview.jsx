import React from 'react';
import Icon from 'components/AppIcon';

const ReportPreview = ({ reportData, profession = 'teacher' }) => {
  if (!reportData) return null;

  const getRiskColor = (score) => {
    if (score < 40) return 'text-success';
    if (score < 70) return 'text-warning';
    return 'text-error';
  };

  const getRiskBgColor = (score) => {
    if (score < 40) return 'bg-success-50 border-success-200';
    if (score < 70) return 'bg-warning-50 border-warning-200';
    return 'bg-error-50 border-error-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProfessionTitle = () => {
    const titles = {
      teacher: 'Educator',
      nurse: 'Healthcare Professional',
      'first-responder': 'First Responder',
      'government-employee': 'Public Service Professional'
    };
    return titles[profession] || titles.teacher;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary">Report Preview</h2>
          <p className="text-sm text-text-secondary">Key highlights from your analysis</p>
        </div>
      </div>

      {/* Risk Score Display */}
      <div className={`rounded-lg border-2 p-4 mb-6 ${getRiskBgColor(reportData.riskScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">GrowthGuard Risk Score</h3>
            <p className="text-sm text-text-secondary">
              Your overall retirement security assessment
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getRiskColor(reportData.riskScore)}`}>
              {reportData.riskScore}
            </div>
            <div className={`text-sm font-medium ${getRiskColor(reportData.riskScore)}`}>
              {reportData.riskLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Top Gaps */}
      <div className="mb-6">
        <h3 className="font-semibold text-text-primary mb-4">Top Identified Gaps</h3>
        <div className="space-y-3">
          {reportData.topGaps.map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                  <Icon name={gap.icon} size={16} className="text-error" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">{gap.type}</div>
                  <div className="text-sm text-text-secondary">{gap.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-error">
                  {formatCurrency(gap.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Recommendations Preview */}
      <div>
        <h3 className="font-semibold text-text-primary mb-4">Key Recommendations</h3>
        <div className="space-y-2">
          {reportData.keyRecommendations.slice(0, 3).map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Check" size={12} className="text-primary" />
              </div>
              <p className="text-sm text-text-secondary">{recommendation}</p>
            </div>
          ))}
          {reportData.keyRecommendations.length > 3 && (
            <div className="flex items-center gap-3 pt-2">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Plus" size={12} className="text-primary" />
              </div>
              <p className="text-sm text-primary font-medium">
                +{reportData.keyRecommendations.length - 3} more recommendations in your full report
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Personalized for {getProfessionTitle()}s</span>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} />
            <span>Generated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;