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
// import { downloadFullReport } from "utils/reportGenerator"; // Removed - feature under development
import { useAssessment } from "contexts/AssessmentContext";
import { getRiskLevelSync } from "utils/riskUtils";
import { useVersion } from "contexts/VersionContext";
import PublicVersionCTA from "components/ui/PublicVersionCTA";

const ReportDeliveryConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userData: contextUserData,
    calculatedResults: contextCalculatedResults,
    hasValidAssessment,
  } = useAssessment();
  const { isPublic, isAgent, enableReportDownload } = useVersion();
  const [userEmail, setUserEmail] = useState("");
  const [profession, setProfession] = useState("teacher");
  const [reportData, setReportData] = useState(null);
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);

  // Helper function to transform context data for report delivery
  const transformContextDataForReport = (
    contextUserData,
    contextCalculatedResults
  ) => {
    if (!contextCalculatedResults) return null;

    // Use the exact same data structure as the results page
    return {
      profession: contextCalculatedResults.profession,
      yearsOfService: contextCalculatedResults.yearsOfService,
      currentAge: contextCalculatedResults.currentAge || 45,
      state: contextCalculatedResults.state,
      riskScore: contextCalculatedResults.riskScore,
      riskColor: getRiskLevelSync(contextCalculatedResults.riskScore).riskColor,
      totalGap: contextCalculatedResults.totalGap,

      // Direct properties (same as results page uses)
      pensionGap: contextCalculatedResults.pensionGap || 0,
      taxTorpedo: contextCalculatedResults.taxTorpedo || 0,
      survivorGap: contextCalculatedResults.survivorGap || 0,

      // Keep gaps structure for report preview
      gaps: {
        pension: {
          amount: (contextCalculatedResults.pensionGap || 0) * 240,
          monthly: contextCalculatedResults.pensionGap || 0,
          description: `Monthly pension shortfall: $${
            contextCalculatedResults.pensionGap || 0
          }/month`,
        },
        tax: {
          amount: contextCalculatedResults.taxTorpedo || 0,
          description: `Tax torpedo impact on retirement withdrawals`,
        },
        survivor: {
          amount: (contextCalculatedResults.survivorGap || 0) * 240,
          monthly: contextCalculatedResults.survivorGap || 0,
          description: `Monthly survivor benefit gap: $${
            contextCalculatedResults.survivorGap || 0
          }/month`,
        },
      },

      calculationLog: contextCalculatedResults.calculationLog,
    };
  };

  useEffect(() => {
    // Load data from navigation state or context
    try {
      let userData, projections;

      if (location.state?.userData && location.state?.projections) {
        // Use navigation state data
        userData = location.state.userData;
        projections = location.state.projections;

        // Check if email data was provided from Gap Calculator Tool
        if (location.state?.emailData?.email) {
          setUserEmail(location.state.emailData.email);
          setReportSent(true); // Skip modal and show success state
        } else {
          setShowModal(true); // Show modal to collect email
        }
      } else if (
        hasValidAssessment() &&
        contextUserData &&
        contextCalculatedResults
      ) {
        // Fallback to context data
        userData = transformContextDataForReport(
          contextUserData,
          contextCalculatedResults
        );
        projections = {
          monthlyNeeded:
            Math.round(
              ((contextCalculatedResults.pensionGap || 0) +
                (contextCalculatedResults.survivorGap || 0)) *
                0.8
            ) || 500,
        };
        setShowModal(true); // Show modal for context data (no pre-filled email)
      } else {
        // If no data available, redirect to start
        navigate("/profession-selection-landing");
        return;
      }

      if (userData) {
        setCalculatedResults(userData);
        setProfession(userData.profession);
        // Don't set default email - user will enter it in modal

        // Create report highlights from data
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
              userData.monthlyContribution || projections?.monthlyNeeded || 500
            }`,
            "Maximize 403(b) contributions to reduce tax torpedo impact",
            "Consider Roth IRA conversions during lower-income years",
            `Explore ${userData.profession}-specific retirement benefits`,
          ],
        };

        setReportData(reportHighlights);
      }
    } catch (error) {
      console.error("Error loading report data:", error);
      navigate("/profession-selection-landing");
    }
  }, [
    location.state,
    navigate,
    hasValidAssessment,
    contextUserData,
    contextCalculatedResults,
  ]);

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
    // Pass the calculated results and userData to the gap calculator tool
    navigate("/gap-calculator-tool", {
      state: {
        userData: calculatedResults,
        calculatedResults: calculatedResults,
      },
    });
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
    // Show feature under development popup
    setShowFeaturePopup(true);
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
              <div className="flex items-center justify-center gap-2 text-lg text-text-secondary mb-6">
                <Icon name="Mail" size={20} className="text-primary" />
                <span>
                  Sent to: <strong className="text-primary">{userEmail}</strong>
                </span>
              </div>
              <p className="text-lg text-text-secondary text-center">
                Check your email for your comprehensive retirement gap analysis
                report.
              </p>
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
            {isPublic ? (
              /* Public Version - Show CTA instead of report preview */
              <PublicVersionCTA
                title="Ready for Your Complete Retirement Analysis?"
                showStatistic={true}
                className="mb-8"
              />
            ) : (
              /* Agent Version - Show report preview */
              <ReportPreview reportData={reportData} profession={profession} />
            )}

            {/* What's Included - Agent Version Only */}
            {!isPublic && (
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
                      desc: "Complete breakdown of your GapGuardian Gold Standard™️ Risk Score",
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
                        <p className="text-sm text-text-secondary">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps - Agent Version Only */}
            {!isPublic && (
              <NextStepsSection
                onShareResults={handleShareResults}
                onCalculateScenarios={handleCalculateScenarios}
                onReferColleague={handleReferColleague}
                profession={profession}
              />
            )}

            {/* Calculation Log for debugging/analysis - Hidden for users */}
            {false && (
              <CalculationLog log={calculatedResults?.calculationLog} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons - Only show before report is sent */}
            {!reportSent && (
              <div className="card p-6">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Icon name="Send" size={20} />
                  Get Your Report
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSendReport}
                    className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Icon name="Mail" size={18} />
                    Email My Report
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="w-full border border-primary text-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors duration-200"
                  >
                    <Icon name="Download" size={18} />
                    Download PDF
                  </button>
                </div>
              </div>
            )}

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
            {/* Mobile Testimonials */}
            <div className="lg:hidden mt-8">
              <TestimonialsSection profession={profession} />
            </div>
            {/* FAQ Section - Agent Version Only */}
            {!isPublic && <FAQSection profession={profession} />}
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

      {/* Feature Under Development Popup */}
      {showFeaturePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Settings" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                PDF Report Download
              </h3>
              <p className="text-lg font-medium text-text-primary mb-2">
                Feature Under Development
              </p>
              <p className="text-text-secondary mb-6">
                This feature is currently being enhanced and will be available
                soon. In the meantime, you can email your report to access it
                immediately.
              </p>
              <button
                onClick={() => setShowFeaturePopup(false)}
                className="btn-primary px-6 py-3 rounded-lg font-semibold w-full"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDeliveryConfirmation;
