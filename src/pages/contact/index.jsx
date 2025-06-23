import React from 'react';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Icon name="Phone" size={32} className="text-white" />
            <h1 className="text-3xl lg:text-4xl font-bold">Connect With Our Pension Guardians</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            We're here to help public servants maximize their retirement benefits.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Benefit Audit */}
          <div className="card p-6 lg:p-8 flex flex-col gap-4 text-center">
            <Icon name="Calendar" size={32} className="text-primary mx-auto" />
            <h2 className="text-xl font-semibold text-text-primary">Schedule Benefit Audit</h2>
            <p className="text-text-secondary">For verified public servants only.</p>
            <a href="tel:+1-800-123-4567" className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg mx-auto hover:bg-primary-700 transition-colors duration-200">
              <Icon name="Phone" size={20} />
              (800) 123-4567
            </a>
          </div>

          {/* Media / Partnerships */}
          <div className="card p-6 lg:p-8 flex flex-col gap-4 text-center">
            <Icon name="Mail" size={32} className="text-accent mx-auto" />
            <h2 className="text-xl font-semibold text-text-primary">Media & Partnerships</h2>
            <p className="text-text-secondary">Get in touch with our team.</p>
            <a href="mailto:info@publicservwealth.com" className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg mx-auto hover:bg-secondary-700 transition-colors duration-200">
              <Icon name="Mail" size={20} />
              info@publicservwealth.com
            </a>
          </div>
        </div>

        {/* Office Hours & Trust Signal */}
        <div className="max-w-4xl mx-auto mt-12 card p-6 lg:p-8 flex flex-col gap-6 text-center">
          <div className="flex items-center justify-center gap-3 text-lg text-text-primary">
            <Icon name="Clock" size={24} className="text-primary" />
            Office hours: <strong className="font-medium">M-F 8am-6pm Your Timezone</strong>
          </div>
          <div className="flex items-center justify-center gap-3 text-success-800">
            <Icon name="Shield" size={24} className="text-success" />
            All inquiries verified through state employee ID or .gov email
          </div>
        </div>
      </main>

      <ConversionFooter className="mt-auto" />
    </div>
  );
};

export default Contact; 