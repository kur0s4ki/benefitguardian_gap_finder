import React from 'react';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';
import StaticPageHeader from 'components/ui/StaticPageHeader';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StaticPageHeader />

      {/* Page Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Icon name="Phone" size={32} className="text-primary" />
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">Connect With Our Pension Guardians</h1>
          </div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            We're here to help public servants maximize their retirement benefits.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefit Audit */}
          <div className="card p-6 lg:p-8 flex flex-col gap-4 text-center items-center">
            <Icon name="Calendar" size={32} className="text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">Schedule Benefit Audit</h2>
            <p className="text-text-secondary flex-1">For verified public servants only.</p>
            <a href="tel:+1-800-123-4567" className="btn-primary w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200">
              <Icon name="Phone" size={20} />
              <span>(800) 123-4567</span>
            </a>
          </div>

          {/* Media / Partnerships */}
          <div className="card p-6 lg:p-8 flex flex-col gap-4 text-center items-center">
            <Icon name="Mail" size={32} className="text-accent" />
            <h2 className="text-xl font-semibold text-text-primary">Media & Partnerships</h2>
            <p className="text-text-secondary flex-1">Get in touch with our team.</p>
            <a href="mailto:info@publicservwealth.com" className="btn-secondary w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
              <Icon name="Mail" size={20} />
              <span>info@publicservwealth.com</span>
            </a>
          </div>
        </div>

        {/* Office Hours & Trust Signal */}
        <div className="mt-10 card p-6 lg:p-8 flex flex-col gap-6 items-center">
          <div className="flex items-center justify-center gap-3 text-lg text-text-primary">
            <Icon name="Clock" size={24} className="text-primary" />
            <span>Office hours: <strong className="font-medium">M-F 8am-6pm Your Timezone</strong></span>
          </div>
          <div className="flex items-center justify-center gap-3 text-success-800 px-4 py-2 bg-success-50 rounded-full">
            <Icon name="Shield" size={24} className="text-success" />
            <span className="font-medium">All inquiries verified through state employee ID or .gov email</span>
          </div>
        </div>
      </main>

      <ConversionFooter className="mt-auto" />
    </div>
  );
};

export default Contact; 