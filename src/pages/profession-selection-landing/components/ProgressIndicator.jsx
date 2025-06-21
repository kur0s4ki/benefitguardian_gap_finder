import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 3, 
  percentage = 33,
  isTransitioning = false 
}) => {
  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${percentage}%`,
      transition: {
        duration: 1,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Step Counter */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {percentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-indicator h-2 mb-4">
        <motion.div
          className="progress-bar"
          variants={progressVariants}
          initial="hidden"
          animate="visible"
        />
      </div>

      {/* Step Description */}
      <div className="text-center">
        <p className={`
          text-sm font-medium transition-colors duration-300
          ${isTransitioning ? 'text-primary' : 'text-text-secondary'}
        `}>
          {isTransitioning 
            ? 'Preparing your personalized journey...' :'Choose your profession to get started'
          }
        </p>
      </div>

      {/* Step Dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-colors duration-300
              ${index < currentStep ? 'bg-primary' : 'bg-primary-200'}
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.9 + (index * 0.1) 
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressIndicator;