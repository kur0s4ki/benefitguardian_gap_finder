import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const DetailedBreakdown = ({ userData, onNavigateToCalculator }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const breakdownData = [
    {
      id: 'pension',
      title: 'Pension Gap Analysis',
      icon: 'TrendingDown',
      emoji: '📉',
      gap: userData.pensionGap * 240, // Convert monthly to 20-year total for display
      monthlyContribution: Math.round((userData.pensionGap * 12) / (userData.yearsUntilRetirement * 7)),
      description: `Based on your current pension of $${userData.currentPension?.toLocaleString() || 'N/A'}/month and ${userData.yearsOfService} years of service, you may face a significant shortfall in retirement income.`,
      methodology: `Our analysis considers your current pension benefits, projected inflation rates, and typical retirement expenses for ${userData.profession}s in ${userData.state}. The calculation uses a 3% annual pension gap factor multiplied by years of service.`,
      actionItems: [
        'Consider additional retirement savings vehicles',
        'Explore pension maximization strategies',
        'Review state-specific pension benefits',
        'Calculate optimal retirement timing'
      ]
    },
    {
      id: 'tax',
      title: 'Tax Torpedo Risk',
      icon: 'Zap',
      emoji: '💥',
      gap: userData.taxTorpedo,
      monthlyContribution: Math.round((userData.taxTorpedo / 240) * 12 / (userData.yearsUntilRetirement * 7)),
      description: `The "Tax Torpedo" occurs when your retirement income pushes you into higher tax brackets, potentially costing you thousands in unexpected taxes.`,
      methodology: `This calculation analyzes 30% of your current savings ($${userData.otherSavings?.toLocaleString() || '0'}) as potential tax impact. We model various tax scenarios to identify potential tax bracket jumps and their financial impact.`,
      actionItems: [
        'Implement tax-diversification strategies',
        'Consider Roth conversion opportunities',
        'Plan withdrawal sequencing',
        'Explore tax-efficient investment vehicles'
      ]
    },
    {
      id: 'survivor',
      title: 'Survivor Protection Gap',
      icon: 'Heart',
      emoji: '❤️‍🩹',
      gap: userData.survivorGap * 240, // Convert monthly to 20-year total for display
      monthlyContribution: Math.round((userData.survivorGap * 12) / (userData.yearsUntilRetirement * 7)),
      description: `This gap represents the income shortfall your loved ones would face if you were no longer able to provide for them.`,
      methodology: `Our survivor analysis calculates 40% of your monthly pension ($${userData.currentPension?.toLocaleString() || 'N/A'}) as the potential survivor benefit gap. This considers your family's ongoing financial needs and existing coverage.`,
      actionItems: [
        'Review existing life insurance coverage',
        'Understand pension survivor benefits',
        'Consider supplemental income protection',
        'Create emergency fund strategies'
      ]
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          Detailed Gap Breakdown
        </h3>
        <button
          onClick={onNavigateToCalculator}
          className="btn-primary px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2"
        >
          <Icon name="Calculator" size={16} />
          Gap Calculator
        </button>
      </div>

      <div className="space-y-4">
        {breakdownData.map((item) => (
          <div key={item.id} className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <button
              onClick={() => toggleSection(item.id)}
              className="w-full px-6 py-4 bg-secondary-50 hover:bg-secondary-100 transition-colors duration-150 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <Icon name={item.icon} size={20} className="text-primary" />
                  <span className="font-semibold text-text-primary">
                    {item.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-error">
                      {formatCurrency(item.gap)}
                    </div>
                    <div className="text-xs text-text-secondary">
                      Total Gap
                    </div>
                  </div>
                  
                  <Icon 
                    name={expandedSection === item.id ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-text-secondary" 
                  />
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {expandedSection === item.id && (
              <div className="px-6 py-4 bg-surface border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">
                      Gap Analysis
                    </h4>
                    <p className="text-text-secondary mb-4">
                      {item.description}
                    </p>
                    
                    <div className="bg-primary-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-secondary">
                          Monthly Contribution to Close Gap:
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(item.monthlyContribution)}/month
                      </div>
                    </div>

                    <div className="text-xs text-text-muted">
                      <Icon name="Info" size={14} className="inline mr-1" />
                      Based on moderate growth assumptions over remaining working years
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">
                      Recommended Actions
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {item.actionItems.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-text-secondary">
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button className="text-sm text-primary hover:text-primary-700 font-medium inline-flex items-center gap-1">
                      <Icon name="ExternalLink" size={14} />
                      Learn More About This Gap
                    </button>
                  </div>
                </div>

                {/* Methodology */}
                <div className="mt-6 pt-4 border-t border-border">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-secondary">
                      <Icon name="Info" size={16} className="text-text-muted" />
                      Methodology
                      <Icon name="ChevronRight" size={16} className="text-text-muted transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2 text-sm text-text-muted pl-6">
                      {item.methodology}
                    </p>
                  </details>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedBreakdown;