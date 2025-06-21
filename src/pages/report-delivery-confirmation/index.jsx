import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressHeader from 'components/ui/ProgressHeader';
import ConversionFooter from 'components/ui/ConversionFooter';
import Icon from 'components/AppIcon';
import SuccessAnimation from './components/SuccessAnimation';
import ReportPreview from './components/ReportPreview';
import NextStepsSection from './components/NextStepsSection';
import FAQSection from './components/FAQSection';
import TestimonialsSection from './components/TestimonialsSection';

const ReportDeliveryConfirmation = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [profession, setProfession] = useState('teacher');
  const [reportData, setReportData] = useState(null);

  // Mock user data - in real app this would come from session/context
  const mockUserData = {
    email: "sarah.johnson@email.com",
    profession: "teacher",
    firstName: "Sarah",
    yearsOfService: 15,
    state: "California",
    riskScore: 72,
    pensionGap: 285000,
    taxTorpedoRisk: 45000,
    survivorGap: 125000,
    monthlyShortfall: 1250
  };

  const mockReportHighlights = {
    riskScore: 72,
    riskLevel: "High Risk",
    topGaps: [
      {
        type: "Pension Gap",
        amount: 285000,
        icon: "TrendingDown",
        description: "Projected retirement income shortfall"
      },
      {
        type: "Tax Torpedo Risk",
        amount: 45000,
        icon: "Zap",
        description: "Potential tax liability on retirement withdrawals"
      },
      {
        type: "Survivor Protection Gap",
        amount: 125000,
        icon: "Heart",
        description: "Income protection for surviving spouse"
      }
    ],
    keyRecommendations: [
      "Maximize 403(b) contributions to reduce tax torpedo impact",
      "Consider Roth IRA conversions during lower-income years",
      "Evaluate supplemental life insurance for survivor protection",
      "Explore state-specific teacher retirement benefits"
    ]
  };

  useEffect(() => {
    // Simulate loading user data from session storage or context
    setUserEmail(mockUserData.email);
    setProfession(mockUserData.profession);
    setReportData(mockReportHighlights);
  }, []);

  const handleBookAudit = () => {
    // In real app, this would integrate with Calendly
    window.open('https://calendly.com/publicserv-wealth/benefit-audit', '_blank');
  };

  const handleShareResults = () => {
    const shareText = `I just discovered significant gaps in my retirement planning! Check out this free analysis tool for ${profession}s.`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Retirement Gap Analysis Results',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Share link copied to clipboard!');
    }
  };

  const handleCalculateScenarios = () => {
    navigate('/gap-calculator-tool');
  };

  const handleReferColleague = () => {
    const referralText = `Hi! I just used this free retirement gap analysis tool designed specifically for ${profession}s. It revealed some eye-opening insights about my retirement planning. You might find it helpful too: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Free Retirement Analysis for Public Service Professionals',
        text: referralText
      });
    } else {
      navigator.clipboard.writeText(referralText);
      alert('Referral message copied to clipboard!');
    }
  };

  const getProfessionTheme = () => {
    const themes = {
      teacher: { emoji: '🍎', bg: 'bg-gradient-to-br from-primary-50 to-accent-50' },
      nurse: { emoji: '⚕️', bg: 'bg-gradient-to-br from-primary-50 to-success-50' },
      'first-responder': { emoji: '🚒', bg: 'bg-gradient-to-br from-primary-50 to-error-50' },
      'government-employee': { emoji: '🏛️', bg: 'bg-gradient-to-br from-primary-50 to-secondary-50' }
    };
    return themes[profession] || themes.teacher;
  };

  const theme = getProfessionTheme();

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader currentStep={6} totalSteps={6} profession={profession} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Animation Section */}
        <div className="text-center mb-8">
          <SuccessAnimation profession={profession} />
          
          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Your Personalized Retirement Gap Report is on its way!
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg text-text-secondary mb-2">
              <Icon name="Mail" size={20} className="text-primary" />
              <span>Sent to: <strong className="text-primary">{userEmail}</strong></span>
            </div>
            <p className="text-text-secondary">
              Check your inbox (and spam folder) in the next few minutes
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Report Preview */}
            <ReportPreview reportData={reportData} profession={profession} />

            {/* What's Included */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Icon name="FileText" size={24} />
                What's Included in Your Full Report
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: 'BarChart3', title: 'Detailed Risk Analysis', desc: 'Complete breakdown of your GrowthGuard Risk Score' },
                  { icon: 'Calculator', title: 'Gap Calculations', desc: 'Precise dollar amounts for each identified gap' },
                  { icon: 'Target', title: 'Action Plan', desc: 'Step-by-step recommendations tailored to your situation' },
                  { icon: 'TrendingUp', title: 'Projection Scenarios', desc: 'Multiple retirement timeline and contribution scenarios' },
                  { icon: 'Shield', title: 'Benefit Optimization', desc: 'Strategies to maximize your existing benefits' },
                  { icon: 'Clock', title: 'Timeline Guidance', desc: 'When to implement each recommendation' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name={item.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">{item.title}</h3>
                      <p className="text-sm text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <NextStepsSection 
              onBookAudit={handleBookAudit}
              onShareResults={handleShareResults}
              onCalculateScenarios={handleCalculateScenarios}
              onReferColleague={handleReferColleague}
              profession={profession}
            />

            {/* FAQ Section */}
            <FAQSection profession={profession} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgency Card */}
            <div className="card p-6 border-l-4 border-l-accent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Time-Sensitive Opportunity</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Book your priority benefit audit within 48 hours to secure your spot
                  </p>
                </div>
              </div>
              <button
                onClick={handleBookAudit}
                className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Calendar" size={18} />
                Book Priority Audit
              </button>
            </div>

            {/* Contact Card */}
            <div className="card p-6">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Icon name="Headphones" size={20} />
                Need Help?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">support@publicservwealth.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MessageCircle" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">Live chat available 9-5 EST</span>
                </div>
              </div>
            </div>

            {/* Desktop Testimonials */}
            <div className="hidden lg:block">
              <TestimonialsSection profession={profession} />
            </div>
          </div>
        </div>

        {/* Mobile Testimonials */}
        <div className="lg:hidden mt-8">
          <TestimonialsSection profession={profession} />
        </div>

        {/* Bottom CTA */}
        <div className={`mt-12 rounded-2xl p-8 text-center ${theme.bg}`}>
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4">{theme.emoji}</div>
            <h2 className="text-2xl font-bold text-primary mb-4">
              Ready to Secure Your Retirement?
            </h2>
            <p className="text-text-secondary mb-6">
              Don't let retirement gaps catch you off guard. Take action now to protect your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBookAudit}
                className="btn-primary px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Calendar" size={18} />
                Schedule Your Audit
              </button>
              <button
                onClick={handleShareResults}
                className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors duration-200"
              >
                <Icon name="Share2" size={18} />
                Share Results
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConversionFooter />
    </div>
  );
};

export default ReportDeliveryConfirmation;