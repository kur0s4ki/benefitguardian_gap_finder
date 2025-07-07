import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressHeader from "components/ui/ProgressHeader";
import ConversionFooter from "components/ui/ConversionFooter";
import Icon from "components/AppIcon";
import SuccessAnimation from "./components/SuccessAnimation";
import ReportPreview from "./components/ReportPreview";
import NextStepsSection from "./components/NextStepsSection";
import FAQSection from "./components/FAQSection";
import TestimonialsSection from "./components/TestimonialsSection";
import DeliveryInfoModal from "./components/DeliveryInfoModal";
import CalculationLog from "./components/CalculationLog";
import { downloadFullReport } from "utils/reportGenerator";

const ReportDeliveryConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [profession, setProfession] = useState("teacher");
  const [reportData, setReportData] = useState(null);
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    // Automatically show the modal as soon as the component loads
    setShowModal(true);

    // Load data from navigation state
    try {
      if (location.state?.userData && location.state?.projections) {
        const userData = location.state.userData;
        const projections = location.state.projections;

        setCalculatedResults(userData);
        setProfession(userData.profession);
        // Don't set default email - user will enter it in modal

        // Create report highlights from navigation data
        const reportHighlights = {
          riskScore: userData.riskScore || 72,
          riskLevel:
            userData.riskColor === "red"
              ? "High Risk"
              : userData.riskColor === "gold"
              ? "Moderate Risk"
              : "Low Risk",
          topGaps: [
            {
              type: "Pension Gap",
              amount: userData.gaps?.pension?.amount || 0,
              icon: "TrendingDown",
              description:
                userData.gaps?.pension?.description || "Pension shortfall",
            },
            {
              type: "Tax Torpedo Risk",
              amount: userData.gaps?.tax?.amount || 0,
              icon: "Zap",
              description: userData.gaps?.tax?.description || "Tax impact",
            },
            {
              type: "Survivor Protection Gap",
              amount: userData.gaps?.survivor?.amount || 0,
              icon: "Heart",
              description:
                userData.gaps?.survivor?.description || "Survivor benefit gap",
            },
          ],
          keyRecommendations: [
            `Monthly contribution: $${
              userData.monthlyContribution || projections.monthlyNeeded || 500
            }`,
            "Maximize 403(b) contributions to reduce tax torpedo impact",
            "Consider Roth IRA conversions during lower-income years",
            `Explore ${userData.profession}-specific retirement benefits`,
          ],
        };

        setReportData(reportHighlights);
      } else {
        // If no navigation state, redirect to start
        navigate("/profession-selection-landing");
      }
    } catch (error) {
      console.error("Error loading report data:", error);
      navigate("/profession-selection-landing");
    }
  }, [location.state, navigate]);

  const handleBookAudit = () => {
    // In real app, this would integrate with Calendly
    window.open(
      "https://calendly.com/publicserv-wealth/benefit-audit",
      "_blank"
    );
  };

  const handleShareResults = () => {
    const shareText = `I just discovered significant gaps in my retirement planning! Check out this free analysis tool for ${profession}s.`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      navigator.share({
        title: "Retirement Gap Analysis Results",
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert("Share link copied to clipboard!");
    }
  };

  const handleCalculateScenarios = () => {
    navigate("/gap-calculator-tool");
  };

  const handleReferColleague = () => {
    const referralText = `Hi! I just used this free retirement gap analysis tool designed specifically for ${profession}s. It revealed some eye-opening insights about my retirement planning. You might find it helpful too: ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: "Free Retirement Analysis for Public Service Professionals",
        text: referralText,
      });
    } else {
      navigator.clipboard.writeText(referralText);
      alert("Referral message copied to clipboard!");
    }
  };

  const handleSendReport = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (email) => {
    setUserEmail(email);
    setReportSent(true);
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const getProfessionTheme = () => {
    const themes = {
      teacher: {
        emoji: "🍎",
        bg: "bg-gradient-to-br from-primary-50 to-accent-50",
      },
      nurse: {
        emoji: "⚕️",
        bg: "bg-gradient-to-br from-primary-50 to-success-50",
      },
      "first-responder": {
        emoji: "🚒",
        bg: "bg-gradient-to-br from-primary-50 to-error-50",
      },
      "government-employee": {
        emoji: "💼",
        bg: "bg-gradient-to-br from-primary-50 to-secondary-50",
      },
    };
    return themes[profession] || themes.teacher;
  };

  const theme = getProfessionTheme();

  const handleDownloadPdf = () => {
    // Get the original calculation engine results from localStorage
    try {
      const originalResults = localStorage.getItem("calculatedResults");
      if (originalResults) {
        const parsedResults = JSON.parse(originalResults);
        downloadFullReport(parsedResults, location.state?.projections || {});
      } else if (calculatedResults) {
        // Fallback to transformed data if original not available
        downloadFullReport(
          calculatedResults,
          location.state?.projections || {}
        );
      }
    } catch (error) {
      console.error("Error accessing calculation results:", error);
      // Fallback to transformed data
      if (calculatedResults) {
        downloadFullReport(
          calculatedResults,
          location.state?.projections || {}
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressHeader currentStep={6} totalSteps={6} profession={profession} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          {reportSent && (
            <div className="mt-6">
              <SuccessAnimation profession={profession} />
              <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Your Personalized Retirement Gap Report is on its way!
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg text-text-secondary mb-2">
                <Icon name="Mail" size={20} className="text-primary" />
                <span>
                  Sent to: <strong className="text-primary">{userEmail}</strong>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSendReport}
                  className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-3 hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name="Mail" size={24} />
                  <span>Email My Report</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-3 hover:bg-primary-50 transition-colors duration-200"
                >
                  <Icon name="Download" size={24} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
          {!reportSent && (
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Review Your Analysis & Send Report
            </h1>
          )}
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
                  {
                    icon: "BarChart3",
                    title: "Detailed Risk Analysis",
                    desc: "Complete breakdown of your GrowthGuard Risk Score",
                  },
                  {
                    icon: "Calculator",
                    title: "Gap Calculations",
                    desc: "Precise dollar amounts for each identified gap",
                  },
                  {
                    icon: "Target",
                    title: "Action Plan",
                    desc: "Step-by-step recommendations tailored to your situation",
                  },
                  {
                    icon: "TrendingUp",
                    title: "Projection Scenarios",
                    desc: "Multiple retirement timeline and contribution scenarios",
                  },
                  {
                    icon: "Shield",
                    title: "Benefit Optimization",
                    desc: "Strategies to maximize your existing benefits",
                  },
                  {
                    icon: "Clock",
                    title: "Timeline Guidance",
                    desc: "When to implement each recommendation",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon
                        name={item.icon}
                        size={16}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">
                        {item.title}
                      </h3>
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

            {/* Calculation Log for debugging/analysis */}
            <CalculationLog log={calculatedResults?.calculationLog} />
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
                  <h3 className="font-semibold text-primary">
                    Time-Sensitive Opportunity
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Book your priority benefit audit within 48 hours to secure
                    your spot
                  </p>
                </div>
              </div>
              <button
                onClick={handleBookAudit}
                className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Calendar" size={18} />
                Book Priority Benefits Audit
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
                  <Icon
                    name="Phone"
                    size={16}
                    className="text-text-secondary"
                  />
                  <span className="text-sm text-text-secondary">
                    844.4WEALTH
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    Support@publicservwealth.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon
                    name="MessageCircle"
                    size={16}
                    className="text-text-secondary"
                  />
                  <span className="text-sm text-text-secondary">
                    Live chat available 9-5 EST
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Testimonials */}
            <div className="hidden lg:block">
              <TestimonialsSection profession={profession} />
            </div>
          </div>

          {/* Mobile Testimonials */}
          <div className="lg:hidden mt-8">
            <TestimonialsSection profession={profession} />
          </div>

          {/* Bottom CTA - Spans all 3 columns */}
          <div
            className={`lg:col-span-3 mt-12 rounded-2xl p-8 text-center ${theme.bg}`}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-4xl mb-4">{theme.emoji}</div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Ready to Secure Your Retirement?
              </h2>
              <p className="text-text-secondary mb-6">
                Don't let retirement gaps catch you off guard. Take action now
                to protect your financial future.
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
        </div>
      </main>

      <ConversionFooter />

      {/* Delivery Info Modal */}
      <DeliveryInfoModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        profession={profession}
      />
    </div>
  );
};

export default ReportDeliveryConfirmation;
