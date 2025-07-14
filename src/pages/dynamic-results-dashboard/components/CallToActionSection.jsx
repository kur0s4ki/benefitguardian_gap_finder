import React, { useState } from "react";
import Icon from "components/AppIcon";

const CallToActionSection = ({ onEmailReport, onBookAudit, profession }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const professionData = {
    teacher: {
      emoji: "🍎",
      title: "Educator",
      urgencyMessage:
        "Don't let pension uncertainties derail your teaching legacy",
    },
    nurse: {
      emoji: "⚕️",
      title: "Healthcare Hero",
      urgencyMessage: "Secure your financial health while caring for others",
    },
    "first-responder": {
      emoji: "🚒",
      title: "First Responder",
      urgencyMessage:
        "Protect your family's future like you protect your community",
    },
    "government-employee": {
      emoji: "💼",
      title: "Public Servant",
      urgencyMessage: "Your service deserves a secure retirement plan",
    },
  };

  const currentProfession =
    professionData[profession] || professionData.teacher;

  const handleEmailReport = async () => {
    setIsLoading(true);
    try {
      await onEmailReport();
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: "FileText",
      title: "Comprehensive Report",
      description: "Detailed 15-page analysis with actionable recommendations",
    },
    {
      icon: "Calendar",
      title: "Priority Scheduling",
      description: "Skip the wait - book your consultation within 24 hours",
    },
    {
      icon: "Shield",
      title: "Institutional-Quality Gap Assessment",
      description: "Advice that's legally required to be in your best interest",
    },
    {
      icon: "DollarSign",
      title: "No-Cost Analysis",
      description: "Complete benefit audit with no upfront fees or obligations",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Urgency Message */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-error-50 rounded-full mb-4">
          <span className="text-xl">{currentProfession.emoji}</span>
          <Icon name="Clock" size={16} className="text-error" />
          <span className="text-sm font-semibold text-error">
            TIME-SENSITIVE OPPORTUNITY
          </span>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-2">
          {currentProfession.urgencyMessage}
        </h2>

        <p className="text-text-secondary max-w-2xl mx-auto">
          The gaps we've identified could cost you hundreds of thousands in
          retirement. Take action now to secure your financial future.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-surface rounded-lg border border-border"
          >
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={benefit.icon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main CTAs */}
      <div className="card p-8 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Ready to Close Your Retirement Gaps?
          </h3>
          <p className="text-text-secondary">
            Choose how you'd like to receive your personalized action plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Report CTA */}
          <button
            onClick={handleEmailReport}
            disabled={isLoading || emailSent}
            className={`p-6 rounded-lg border-2 transition-all duration-200 ${
              emailSent
                ? "bg-success-50 border-success text-success"
                : "bg-surface border-primary hover:bg-primary-50 hover:border-primary-600"
            }`}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {emailSent ? (
                  <Icon name="CheckCircle" size={24} className="text-success" />
                ) : isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icon name="Mail" size={24} className="text-primary" />
                )}
              </div>

              <h4 className="font-semibold text-text-primary mb-2">
                {emailSent ? "Report Sent!" : "Email My Report"}
              </h4>

              <p className="text-sm text-text-secondary mb-4">
                {emailSent
                  ? "Check your inbox for your detailed analysis"
                  : "Get your comprehensive gap analysis delivered instantly"}
              </p>

              {!emailSent && (
                <div className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                  <Icon name="Zap" size={12} />
                  Instant Delivery
                </div>
              )}
            </div>
          </button>

          {/* Book Audit CTA */}
          <button
            onClick={onBookAudit}
            className="p-6 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Calendar" size={24} className="text-white" />
              </div>

              <h4 className="font-semibold mb-2">
                Book Priority Benefits Audit
              </h4>

              <p className="text-sm text-primary-100 mb-4">
                Schedule your personalized consultation with a retirement
                specialist
              </p>

              <div className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                <Icon name="Star" size={12} />
                Priority Access
              </div>
            </div>
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-primary-200 rounded-full border-2 border-white"
                ></div>
              ))}
            </div>
            <div className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">2,847</span>{" "}
              public servants
            </div>
          </div>
          <p className="text-xs text-text-muted">
            have already secured their retirement with our gap analysis
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-text-muted max-w-3xl mx-auto leading-relaxed">
        <Icon name="Info" size={12} className="inline mr-1" />
        Insights provided by PublicSery Wealth Group are for general
        informational purposes only. This material is not intended as
        personalized advice. Outcomes may vary based on individual
        circumstances. To explore strategies tailored to your goals, consult a
        PublicSery Wealth Group professional.
        <div className="mt-2 font-medium">CA-License #6016374</div>
      </div>
    </div>
  );
};

export default CallToActionSection;
