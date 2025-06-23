import React from 'react';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';

const Disclosures = () => {
  const disclosurePoints = [
    'PublicServ Wealth Group specializes in public sector retirement optimization',
    'Illustrations utilize actuarial models approved for government employee benefit planning',
    'Guarantees subject to institutional claims-paying capacity',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Icon name="BadgeCheck" size={32} className="text-white" />
            <h1 className="text-3xl lg:text-4xl font-bold">Professional Standards</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            We follow strict regulatory guidelines to protect your interests.
          </p>
        </div>
      </section>

      {/* Disclosures */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="max-w-4xl mx-auto card p-6 lg:p-8 space-y-6">
          {disclosurePoints.map((text, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <Icon name="CheckCircle" size={24} className="text-success flex-shrink-0 mt-1" />
              <p className="text-text-primary text-lg leading-relaxed max-w-prose">{text}</p>
            </div>
          ))}
        </div>

        {/* Regulatory Safeguard */}
        <div className="max-w-4xl mx-auto p-6 lg:p-8 card border-l-4 border-warning bg-warning-50 text-warning-800 flex items-start gap-4">
          <Icon name="AlertTriangle" size={28} className="flex-shrink-0 mt-1" />
          <p className="text-lg leading-relaxed">
            This is not an offer to sell securities or insurance products — all solutions require a confidential audit.
          </p>
        </div>
      </main>

      <ConversionFooter className="mt-auto" />
    </div>
  );
};

export default Disclosures; 