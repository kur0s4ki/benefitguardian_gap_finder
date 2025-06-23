import React from 'react';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';

const TermsOfService = () => {
  const terms = [
    'Services designed exclusively for teachers, nurses, and first responders',
    'All strategies comply with state public employee benefit regulations',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Icon name="ClipboardList" size={32} className="text-white" />
            <h1 className="text-3xl lg:text-4xl font-bold">Transparent Partnership</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Please review the terms governing use of our services tailored for public servants.
          </p>
        </div>
      </section>

      {/* Terms content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="card p-6 lg:p-8 space-y-6">
            {terms.map((point, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <Icon name="CheckCircle" size={24} className="text-success flex-shrink-0 mt-1" />
                <p className="text-text-primary text-lg leading-relaxed max-w-prose">{point}</p>
              </div>
            ))}

            {/* Protected optimization structures tooltip line */}
            <div className="flex items-start gap-4">
              <Icon name="Info" size={24} className="text-accent flex-shrink-0 mt-1" />
              <p className="text-text-primary text-lg leading-relaxed max-w-prose">
                Consultations may involve analysis of pension provisions and{' '}
                <span
                  className="underline decoration-dotted cursor-help"
                  title="Includes state-approved benefit enhancement methods"
                >
                  protected optimization structures
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* SEO note */}
      <section className="bg-primary-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-text-secondary">
            Looking for more details? Explore our{' '}
            <a href="/how-it-works" className="text-primary underline">
              institutional frameworks
            </a>{' '}
            and discover resources for <strong>teacher pension optimization terms</strong>.
          </p>
        </div>
      </section>

      <ConversionFooter className="mt-auto" />
    </div>
  );
};

export default TermsOfService; 