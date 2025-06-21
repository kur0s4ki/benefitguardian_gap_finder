import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const ProfessionCard = ({ 
  profession, 
  isSelected, 
  isTransitioning, 
  onSelect, 
  delay = 0 
}) => {
  const handleClick = () => {
    if (!isTransitioning) {
      onSelect(profession);
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
        delay: delay,
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
    },
    selected: {
      scale: 1.05,
      boxShadow: "0 8px 32px rgba(15, 94, 156, 0.3)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.button
      className={`
        relative w-full p-6 lg:p-8 rounded-xl border-2 text-left transition-all duration-300
        ${isSelected 
          ? 'border-primary bg-primary-50 shadow-modal' 
          : 'border-border bg-surface hover:border-primary-200 hover:shadow-card'
        }
        ${isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary
        min-h-[140px] lg:min-h-[160px]
      `}
      variants={cardVariants}
      initial="hidden"
      animate={isSelected ? "selected" : "visible"}
      whileHover={!isTransitioning && !isSelected ? "hover" : {}}
      whileTap={!isTransitioning ? "tap" : {}}
      onClick={handleClick}
      disabled={isTransitioning}
      aria-label={`Select ${profession.name} profession`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Icon name="Check" size={14} className="text-white" />
        </motion.div>
      )}

      {/* Profession Icon/Emoji */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`
          w-12 h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center text-2xl lg:text-3xl
          ${isSelected ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}
          transition-colors duration-300
        `}>
          {profession.emoji}
        </div>
        
        <div className="flex-1">
          <h3 className={`
            text-xl lg:text-2xl font-bold mb-1
            ${isSelected ? 'text-primary' : 'text-text-primary'}
            transition-colors duration-300
          `}>
            {profession.name}
          </h3>
          <p className={`
            text-sm font-medium
            ${isSelected ? 'text-primary-700' : 'text-text-secondary'}
            transition-colors duration-300
          `}>
            {profession.descriptor}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className={`
        text-sm leading-relaxed
        ${isSelected ? 'text-primary-800' : 'text-text-secondary'}
        transition-colors duration-300
      `}>
        {profession.description}
      </p>

      {/* Hover Arrow */}
      <motion.div
        className={`
          absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
          ${isSelected ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}
          transition-all duration-300
        `}
        initial={{ opacity: 0, x: 10 }}
        animate={{ 
          opacity: isSelected ? 1 : 0, 
          x: isSelected ? 0 : 10 
        }}
        whileHover={{ scale: 1.1 }}
      >
        <Icon name="ArrowRight" size={16} />
      </motion.div>

      {/* Loading State */}
      {isTransitioning && isSelected && (
        <motion.div
          className="absolute inset-0 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default ProfessionCard;