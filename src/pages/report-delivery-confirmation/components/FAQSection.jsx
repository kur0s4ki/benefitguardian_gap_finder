import React, { useState } from "react";
import Icon from "components/AppIcon";

const FAQSection = ({ profession = "teacher" }) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const getProfessionSpecificFAQs = () => {
    const baseFAQs = [
      {
        question: "When will I receive my full report?",
        answer:
          "Your personalized PDF report will be delivered to your email within 5-10 minutes. If you don't see it in your inbox, please check your spam or promotions folder.",
      },
      {
        question: "Is this analysis really free?",
        answer:
          "Yes, absolutely! This comprehensive retirement gap analysis is completely free with no hidden fees or obligations. We provide this service to help public service professionals understand their retirement planning needs.",
      },
      {
        question: "How accurate are these projections?",
        answer:
          "Our calculations use current pension data, inflation rates, and tax regulations. While projections are estimates based on current conditions, they provide valuable insights into potential retirement gaps you should address.",
      },

      {
        question: "Do I need to purchase anything?",
        answer:
          "There's no obligation to purchase anything. This analysis is designed to help you understand your retirement planning options and identify potential gaps in your current strategy.",
      },
    ];

    const professionSpecific = {
      teacher: {
        question: "Does this account for teacher-specific benefits?",
        answer:
          "Yes! Our analysis includes teacher pension systems, 403(b) plans, and state-specific educator benefits. We understand the unique retirement landscape for educators.",
      },
      nurse: {
        question: "Are healthcare worker benefits included?",
        answer:
          "Absolutely! We factor in healthcare worker pensions, shift differentials, and medical professional retirement benefits specific to your state and employer type.",
      },
      "first-responder": {
        question: "Does this include first responder benefits?",
        answer:
          "Yes! Our analysis accounts for public safety pensions, hazard pay considerations, and early retirement options available to first responders.",
      },
      "government-employee": {
        question: "Are government employee benefits covered?",
        answer:
          "Definitely! We include federal and state employee retirement systems, TSP contributions, and government-specific benefit programs.",
      },
    };

    return [
      ...baseFAQs,
      professionSpecific[profession] || professionSpecific.teacher,
    ];
  };

  const faqs = getProfessionSpecificFAQs();

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
        <Icon name="HelpCircle" size={24} />
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-primary-50 transition-colors duration-150"
            >
              <span className="font-medium text-text-primary pr-4">
                {faq.question}
              </span>
              <Icon
                name={openFAQ === index ? "ChevronUp" : "ChevronDown"}
                size={20}
                className="text-primary flex-shrink-0 transition-transform duration-200"
              />
            </button>

            {openFAQ === index && (
              <div className="px-4 pb-4 border-t border-border bg-background">
                <p className="text-text-secondary leading-relaxed pt-3">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Help */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-text-secondary mb-3">
          Still have questions? We're here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:Support@publicservwealth.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-700 transition-colors duration-150"
          >
            <Icon name="Mail" size={16} />
            <span className="text-sm font-medium">Email Support</span>
          </a>
          <a
            href="tel:+18444932584"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-700 transition-colors duration-150"
          >
            <Icon name="Phone" size={16} />
            <span className="text-sm font-medium">Call 844.4WEALTH</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
