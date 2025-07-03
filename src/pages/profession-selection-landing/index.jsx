import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "components/AppIcon";
import ProfessionCard from "./components/ProfessionCard";
import ProgressIndicator from "./components/ProgressIndicator";

const ProfessionSelectionLanding = () => {
  const navigate = useNavigate();
  const { setPublicAccess, isAuthenticated } = useAuth();
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAccessOptions, setShowAccessOptions] = useState(false);

  const professions = [
    {
      id: "teacher",
      name: "Teacher",
      emoji: "🍎",
      icon: "GraduationCap",
      descriptor: "K-12 & Higher Education",
      bgTheme: "bg-gradient-to-br from-primary-50 to-accent-50",
      hoverColor: "hover:bg-primary-100",
      description:
        "Educators shaping the future through knowledge and dedication",
    },
    {
      id: "nurse",
      name: "Nurse",
      emoji: "⚕️",
      icon: "Heart",
      descriptor: "Healthcare Professionals",
      bgTheme: "bg-gradient-to-br from-success-50 to-primary-50",
      hoverColor: "hover:bg-success-100",
      description: "Healthcare heroes providing compassionate care and healing",
    },
    {
      id: "first-responder",
      name: "First Responder",
      emoji: "🚒",
      icon: "Shield",
      descriptor: "Police, Fire, EMS",
      bgTheme: "bg-gradient-to-br from-error-50 to-warning-50",
      hoverColor: "hover:bg-error-100",
      description: "Brave professionals protecting and serving our communities",
    },
    {
      id: "government-employee",
      name: "State/Local Hero",
      emoji: "💼",
      icon: "Building2",
      descriptor: "Government Service",
      bgTheme: "bg-gradient-to-br from-secondary-50 to-primary-50",
      hoverColor: "hover:bg-secondary-100",
      description: "Dedicated public servants building stronger communities",
    },
  ];

  const handleProfessionSelect = (profession) => {
    if (isTransitioning) return;

    setSelectedProfession(profession);

    // If user is already authenticated, proceed directly
    if (isAuthenticated) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate("/service-profile-collection", {
          state: {
            profession: profession.id,
          },
        });
      }, 800);
    } else {
      // Show access options for non-authenticated users
      setShowAccessOptions(true);
    }
  };

  const handlePublicAccess = () => {
    if (!selectedProfession) return;

    setPublicAccess();
    setIsTransitioning(true);

    setTimeout(() => {
      navigate("/service-profile-collection", {
        state: {
          profession: selectedProfession.id,
          accessLevel: "public",
        },
      });
    }, 800);
  };

  const handleAuthenticatedAccess = () => {
    navigate("/login", {
      state: {
        from: { pathname: "/service-profile-collection" },
        profession: selectedProfession?.id,
      },
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <motion.header
        className="pt-8 pb-6 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-2 flex justify-center">
            <img
              src="assets/images/logo.png"
              alt="Company Logo"
              className="h-36 w-auto mx-auto"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="px-4 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 leading-tight">
              Uncover Your Hidden
              <span className="text-primary block lg:inline lg:ml-2">
                Retirement Benefits
              </span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Discover unclaimed benefits, identify income gaps, and secure your
              financial future. Start by selecting your profession below.
            </p>
          </motion.div>

          {/* Profession Selection Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-12"
            variants={itemVariants}
          >
            {professions.map((profession, index) => (
              <ProfessionCard
                key={profession.id}
                profession={profession}
                isSelected={selectedProfession?.id === profession.id}
                isTransitioning={isTransitioning}
                onSelect={handleProfessionSelect}
                delay={index * 0.1}
              />
            ))}
          </motion.div>

          {/* Progress Indicator */}
          <motion.div variants={itemVariants}>
            <ProgressIndicator
              currentStep={1}
              totalSteps={3}
              percentage={33}
              isTransitioning={isTransitioning}
            />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 pt-8 border-t border-border"
            variants={itemVariants}
          >
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Trusted by Public Servants Nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Lock" size={16} className="text-success" />
                <span>SOC 2-Compliant Data Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="NotepadText" size={16} className="text-success" />
                <span>Advanced Pension Analytics</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Access Options Modal */}
      {showAccessOptions && selectedProfession && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-surface rounded-xl shadow-modal max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon
                  name={selectedProfession.icon}
                  size={32}
                  className="text-primary"
                />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Choose Your Access Level
              </h3>
              <p className="text-text-secondary">
                How would you like to proceed with your{" "}
                {selectedProfession.name.toLowerCase()} retirement analysis?
              </p>
            </div>

            {/* Access Options */}
            <div className="space-y-4 mb-6">
              {/* Full Analysis Option */}
              <button
                onClick={handleAuthenticatedAccess}
                className="w-full p-4 border-2 border-primary bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Shield" size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">
                      Sign In for Full Analysis
                    </h4>
                    <p className="text-sm text-primary-700">
                      Complete retirement gap analysis, personalized
                      recommendations, and access to all tools
                    </p>
                  </div>
                </div>
              </button>

              {/* Public Calculator Option */}
              <button
                onClick={handlePublicAccess}
                className="w-full p-4 border-2 border-border bg-surface rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon
                      name="Calculator"
                      size={16}
                      className="text-gray-600"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      Try Public Calculator
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Basic analysis with limited results - no account required
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowAccessOptions(false);
                setSelectedProfession(null);
              }}
              className="w-full py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Transition Overlay */}
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 bg-primary z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Icon name="ArrowRight" size={24} className="text-white" />
            </div>
            <p className="text-lg font-medium">
              Preparing your personalized analysis...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfessionSelectionLanding;
