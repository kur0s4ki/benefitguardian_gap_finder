import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useVersion } from 'contexts/VersionContext';

const PublicVersionCTA = ({ 
  title = "Want to See Your Complete Analysis?",
  showStatistic = true,
  className = ""
}) => {
  const navigate = useNavigate();
  const { ctaMessage } = useVersion();

  const handleGetFullAnalysis = () => {
    navigate('/login');
  };

  return (
    <motion.div 
      className={`p-6 lg:p-8 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="TrendingUp" size={32} className="text-white" />
      </div>

      {/* Title */}
      <h3 className="text-xl lg:text-2xl font-bold text-primary mb-4">
        {title}
      </h3>

      {/* Statistic Message */}
      {showStatistic && (
        <div className="mb-6">
          <p className="text-lg text-primary-700 font-medium mb-2">
            {ctaMessage}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-primary-600">
            <Icon name="Shield" size={16} />
            <span>Secure agent access provides complete analysis</span>
          </div>
        </div>
      )}

      {/* Benefits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
        <div className="flex items-start gap-3">
          <Icon name="Check" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-1">Complete Gap Analysis</h4>
            <p className="text-sm text-primary-600">Detailed pension and survivor benefit calculations</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Check" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-1">Interactive Calculator</h4>
            <p className="text-sm text-primary-600">Scenario planning and projection tools</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Check" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-1">Personalized Action Plan</h4>
            <p className="text-sm text-primary-600">Step-by-step recommendations for your situation</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Check" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-1">Professional Report</h4>
            <p className="text-sm text-primary-600">Comprehensive analysis you can download and share</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleGetFullAnalysis}
        className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <Icon name="ArrowRight" size={20} />
          <span>Get Full Analysis</span>
        </div>
      </motion.button>

      {/* Trust Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-600">
        <Icon name="Lock" size={16} />
        <span>Secure • Professional • Confidential</span>
      </div>
    </motion.div>
  );
};

export default PublicVersionCTA;
