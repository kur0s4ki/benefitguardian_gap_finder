import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import { useVersion } from "contexts/VersionContext";
import ContactPopup from "./ContactPopup";

const PublicVersionCTA = ({
  title = "Want to See Your Complete Analysis?",
  showStatistic = true,
  className = "",
}) => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const { ctaMessage } = useVersion();

  const handleGetFullAnalysis = () => {
    setIsContactPopupOpen(true);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-primary-50 rounded-xl opacity-80"></div>

        {/* Main Container */}
        <motion.div
          className="relative bg-white rounded-xl border-2 border-primary-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-primary-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Decorative Top Badge */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <Icon name="Star" size={12} className="text-accent-300" />
              TAKE ACTION NOW
              <Icon name="Star" size={12} className="text-accent-300" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-10 text-center">
            {/* Title */}
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {title}
            </h3>

            {/* Statistic Message */}
            {showStatistic && (
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                {ctaMessage}
              </p>
            )}

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <Icon
                  name="Check"
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-primary mb-1">
                    Complete Gap Analysis
                  </h4>
                  <p className="text-sm text-primary-600">
                    Detailed pension and survivor benefit calculations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon
                  name="Check"
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-primary mb-1">
                    Interactive Calculator
                  </h4>
                  <p className="text-sm text-primary-600">
                    Scenario planning and projection tools
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon
                  name="Check"
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-primary mb-1">
                    Personalized Action Plan
                  </h4>
                  <p className="text-sm text-primary-600">
                    Step-by-step recommendations for your situation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon
                  name="Check"
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-primary mb-1">
                    Professional Report
                  </h4>
                  <p className="text-sm text-primary-600">
                    Comprehensive analysis you can download and share
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative">
              {/* Subtle Button Highlight */}
              <div className="absolute inset-0 bg-primary-100 rounded-lg blur-sm opacity-30"></div>

              {/* Actual Button */}
              <div className="relative transform transition-transform duration-200 hover:scale-105">
                <motion.button
                  onClick={handleGetFullAnalysis}
                  className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="Calculator" size={20} />
                    <span>Get Full Analysis</span>
                    <Icon name="ArrowRight" size={20} />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-4 flex justify-center items-center gap-2 text-xs text-text-secondary">
              <Icon name="Shield" size={12} className="text-primary" />
              <span>Secure & Confidential</span>
              <span>•</span>
              <Icon name="Clock" size={12} className="text-primary" />
              <span>Takes 2 minutes</span>
            </div>
          </div>

          {/* Subtle Corner Accents */}
          <div className="absolute top-3 left-3 text-primary-200 opacity-60">
            <Icon
              name="Sparkles"
              size={14}
              className="animate-pulse"
              style={{ animationDelay: "0s" }}
            />
          </div>
          <div className="absolute top-3 right-3 text-primary-200 opacity-60">
            <Icon
              name="Sparkles"
              size={14}
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <div className="absolute bottom-3 left-3 text-primary-200 opacity-60">
            <Icon
              name="Sparkles"
              size={14}
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
          <div className="absolute bottom-3 right-3 text-primary-200 opacity-60">
            <Icon
              name="Sparkles"
              size={14}
              className="animate-pulse"
              style={{ animationDelay: "3s" }}
            />
          </div>
        </motion.div>

        {/* Subtle Bottom Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-primary-50 to-transparent rounded-b-xl transform translate-y-1 opacity-40"></div>
      </div>

      {/* Contact Popup */}
      <ContactPopup
        isOpen={isContactPopupOpen}
        onClose={() => setIsContactPopupOpen(false)}
      />
    </>
  );
};

export default PublicVersionCTA;
