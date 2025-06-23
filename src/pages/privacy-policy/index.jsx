import React from 'react';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';

const PrivacyPolicy = () => {
  const policyPoints = [
    {
      text: 'We collect only essential information to provide customized pension benefit analyses',
      icon: null
    },
    {
      text: 'All data is encrypted using 256-bit military-grade technology',
      icon: 'Lock'
    },
    {
      text: 'Zero third-party data sharing for marketing purposes',
      icon: 'Lock'
    },
    {
      text: 'Public servants may request data deletion via email',
      icon: null
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Icon name="Lock" size={32} className="text-white" />
            <h1 className="text-3xl lg:text-4xl font-bold">Your Data Security Matters</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Learn how PublicServ Wealth Group safeguards your personal information.
          </p>
        </div>
      </section>

      {/* Policy points */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="card p-6 lg:p-8 space-y-6">
            {policyPoints.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                {item.icon ? (
                  <div className="flex-shrink-0">
                    <Icon name={item.icon} size={24} className="text-primary mt-1" />
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    <Icon name="CheckCircle" size={24} className="text-success mt-1" />
                  </div>
                )}
                <p className="text-text-primary text-lg leading-relaxed max-w-prose">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA */}
      <section className="bg-accent-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-accent-900 mb-4">Need More Information?</h2>
          <p className="text-text-secondary mb-6">Email us at <a href="mailto:privacy@publicservwealth.com" className="text-primary font-medium underline">privacy@publicservwealth.com</a> and we'll respond within one business day.</p>
          <a href="/contact" className="btn-primary px-6 py-3 rounded-lg text-lg font-semibold inline-flex items-center gap-2 hover:bg-primary-700 transition-colors duration-200">
            <Icon name="Mail" size={20} />
            Contact Support
          </a>
        </div>
      </section>

      <ConversionFooter className="mt-auto" />
    </div>
  );
};

export default PrivacyPolicy; 