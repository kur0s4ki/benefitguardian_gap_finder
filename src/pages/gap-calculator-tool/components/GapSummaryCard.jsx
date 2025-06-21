import React from 'react';
import Icon from 'components/AppIcon';

const GapSummaryCard = ({ userData }) => {
  const gaps = [
    {
      type: 'pension',
      title: 'Pension Gap',
      amount: userData.gaps.pension.amount,
      risk: userData.gaps.pension.risk,
      icon: 'TrendingDown',
      emoji: '📉',
      description: userData.gaps.pension.description
    },
    {
      type: 'tax',
      title: 'Tax Torpedo Risk',
      amount: userData.gaps.tax.amount,
      risk: userData.gaps.tax.risk,
      icon: 'Zap',
      emoji: '💥',
      description: userData.gaps.tax.description
    },
    {
      type: 'survivor',
      title: 'Survivor Protection',
      amount: userData.gaps.survivor.amount,
      risk: userData.gaps.survivor.risk,
      icon: 'Heart',
      emoji: '❤️‍🩹',
      description: userData.gaps.survivor.description
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-error bg-error-50 border-error-200';
      case 'medium': return 'text-warning bg-warning-50 border-warning-200';
      case 'low': return 'text-success bg-success-50 border-success-200';
      default: return 'text-text-secondary bg-secondary-50 border-border';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'CheckCircle';
      default: return 'Info';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Your Retirement Gaps Summary
          </h2>
          <p className="text-text-secondary">
            Current identified gaps from your assessment
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-error">
            ${userData.totalGap.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">Total Gap</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {gaps.map((gap, index) => (
          <div key={gap.type} className="relative">
            <div className="card p-4 hover:shadow-modal transition-shadow duration-200">
              {/* Risk Badge */}
              <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(gap.risk)}`}>
                <div className="flex items-center gap-1">
                  <Icon name={getRiskIcon(gap.risk)} size={12} />
                  <span className="capitalize">{gap.risk} Risk</span>
                </div>
              </div>

              {/* Gap Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{gap.emoji}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{gap.title}</h3>
                  <div className="text-lg font-bold text-primary">
                    ${gap.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-4">
                {gap.description}
              </p>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Impact Level</span>
                  <span className={`font-medium capitalize ${
                    gap.risk === 'high' ? 'text-error' : 
                    gap.risk === 'medium' ? 'text-warning' : 'text-success'
                  }`}>
                    {gap.risk}
                  </span>
                </div>
                <div className="w-full bg-primary-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      gap.risk === 'high' ? 'bg-error' : 
                      gap.risk === 'medium' ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ 
                      width: gap.risk === 'high' ? '85%' : 
                             gap.risk === 'medium' ? '60%' : '30%' 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Risk Score */}
      <div className="mt-6 p-4 bg-gradient-to-r from-error-50 to-warning-50 rounded-lg border border-error-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">GrowthGuard Risk Score</h3>
              <p className="text-sm text-text-secondary">
                Your overall retirement security rating
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-error">
              {userData.riskScore}
            </div>
            <div className="text-sm text-error font-medium">High Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapSummaryCard;