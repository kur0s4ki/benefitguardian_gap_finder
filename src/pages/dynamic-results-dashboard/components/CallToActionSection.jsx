import React, { useState } from "react";
import Icon from "components/AppIcon";

const CallToActionSection = ({ onNext, profession }) => {

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

      {/* Navigation Button */}
      <div className="text-center">
        <button
          onClick={onNext}
          className="btn-primary px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-primary-700 transition-colors duration-200"
        >
          <Icon name="Calculator" size={20} />
          Gap Calculator Tool
          <Icon name="ArrowRight" size={16} />
        </button>
        <p className="text-sm text-text-secondary mt-2">
          Step 5 of 6 - Explore detailed calculations and scenarios
        </p>
      </div>
    </div>
  );
};

export default CallToActionSection;
