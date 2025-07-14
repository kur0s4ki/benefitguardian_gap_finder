import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import MobileHeaderMenu from 'components/ui/MobileHeaderMenu';
import { useVersion } from 'contexts/VersionContext';

const EntryLanding = () => {
  const navigate = useNavigate();
  const { getVersionLabel } = useVersion();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleVersionSelect = async (version) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      if (version === 'full') {
        navigate('/login');
      } else {
        navigate('/public/assessment');
      }
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/images/logo.png"
                alt="GapGuardian Gold Standard™️ Analysis Logo"
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
              />
              {/* Desktop Title */}
              <div className="hidden md:block">
                <div className="font-semibold text-lg text-primary">
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
              {/* Mobile Title */}
              <div className="block md:hidden">
                <div className="font-semibold text-base text-primary">
                  GapGuardian Gold Standard™️
                </div>
                <div className="text-xs text-text-secondary -mt-1">
                  Analysis
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <MobileHeaderMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        className="px-4 py-8 lg:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Secure Your
              <span className="text-primary block lg:inline lg:ml-3">
                Retirement Future
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed mb-8">
              Discover hidden retirement gaps, uncover missed benefits, and get personalized 
              recommendations designed specifically for public service professionals.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg text-text-secondary">
              <Icon name="Shield" size={24} className="text-primary" />
              <span>Trusted by thousands of public service heroes</span>
            </div>
          </motion.div>

          {/* Version Selection Cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
            variants={itemVariants}
          >
            {/* Limited Version Card */}
            <motion.button
              className="relative w-full p-8 lg:p-10 rounded-xl border-2 border-border bg-surface hover:border-primary-200 hover:shadow-card text-left transition-all duration-300"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleVersionSelect('limited')}
              disabled={isTransitioning}
            >
              {/* Quick Access Badge */}
              <div className="absolute -top-3 left-6">
                <div className="bg-accent text-text-primary px-3 py-1 rounded-full text-sm font-medium border border-accent-200">
                  Quick Access
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center text-3xl">
                  ⚡
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                    Limited Version
                  </h2>
                  <p className="text-lg text-text-secondary">
                    Quick assessment with key insights
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-success flex-shrink-0" />
                  <span className="text-text-secondary">Tax Torpedo risk analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-success flex-shrink-0" />
                  <span className="text-text-secondary">Basic retirement gap overview</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-success flex-shrink-0" />
                  <span className="text-text-secondary">No registration required</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={20} className="text-primary flex-shrink-0" />
                  <span className="text-text-secondary">5-minute assessment</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">Start Now</span>
                <Icon name="ArrowRight" size={24} className="text-primary" />
              </div>
            </motion.button>

            {/* Full Version Card */}
            <motion.button
              className="relative w-full p-8 lg:p-10 rounded-xl border-2 border-primary bg-primary-50 hover:border-primary hover:shadow-modal text-left transition-all duration-300"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleVersionSelect('full')}
              disabled={isTransitioning}
            >
              {/* Recommended Badge */}
              <div className="absolute -top-3 left-6">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-3xl">
                  🎯
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                    Full Version
                  </h2>
                  <p className="text-lg text-primary-700">
                    Complete analysis with detailed recommendations
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span className="text-primary-700">Complete retirement gap calculations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span className="text-primary-700">Detailed pension & survivor benefit analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span className="text-primary-700">Interactive gap calculator & projections</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span className="text-primary-700">Personalized action plan & recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Shield" size={20} className="text-primary flex-shrink-0" />
                  <span className="text-primary-700">Secure agent access required</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">Access Full Analysis</span>
                <Icon name="ArrowRight" size={24} className="text-primary" />
              </div>
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Users" size={24} className="text-success" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">Trusted by Thousands</h3>
                <p className="text-sm text-text-secondary">Public service professionals nationwide</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">Secure & Private</h3>
                <p className="text-sm text-text-secondary">Your data is protected and confidential</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Award" size={24} className="text-accent-600" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">Gold Standard™️</h3>
                <p className="text-sm text-text-secondary">Industry-leading analysis methodology</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default EntryLanding;
