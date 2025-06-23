import React from 'react';
import Icon from '../AppIcon';

const ConversionFooter = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  const complianceItems = [
    {
      icon: 'Shield',
      text: 'Trusted by Public Servants Nationwide',
      tooltip: 'Securities and Exchange Commission registered investment advisor'
    },
    {
      icon: 'Lock',
      text: 'SOC 2-Compliant Data Protection',
      tooltip: '256-bit SSL encryption and secure data handling'
    },
    {
      icon: 'Award',
      text: 'Advanced Pension Analytics',
      tooltip: 'Legally bound to act in your best interest'
    }
  ];

  const footerLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclosures', href: '/disclosures' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <footer className={`bg-secondary-50 border-t border-border mt-auto ${className}`}>
      {/* Compliance Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          {complianceItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-text-secondary group"
              title={item.tooltip}
            >
              <Icon 
                name={item.icon} 
                size={16} 
                className="text-success group-hover:text-success-600 transition-colors duration-150" 
              />
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-4">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-sm text-text-secondary hover:text-primary transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-text-muted max-w-4xl mx-auto leading-relaxed">
            Investment advisory services offered through PublicServ Wealth Group, a registered investment advisor.
            This analysis is for educational purposes and does not constitute personalized investment advice.
            Past performance does not guarantee future results. All investments involve risk of loss.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-text-muted">
            <span>© {currentYear} PublicServ Wealth Group</span>
            <span className="hidden sm:inline">•</span>
            <span>All rights reserved</span>
            <span className="hidden sm:inline">•</span>
            <span>Member FINRA/SIPC</span>
          </div>
        </div>
      </div>

      {/* Bottom Brand Strip */}
      <div className="bg-secondary py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/images/logo.png"
                alt="PublicServ Wealth Group Logo"
                className="w-6 h-6 object-contain"
              />
              <div className="text-white">
                <div className="font-semibold text-sm">PublicServ Wealth Group</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ConversionFooter;