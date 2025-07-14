import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const StatisticHighlight = ({ 
  statistic = "83%",
  message = "of all Public Hero's get ZERO guidance on their retirement options",
  callToAction = "Get your guidance today.",
  variant = "primary", // primary, warning, accent
  showIcon = true,
  className = ""
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-gradient-to-r from-warning-50 to-warning-100 border-warning-200',
          statistic: 'text-warning-700',
          message: 'text-warning-800',
          cta: 'text-warning-900',
          icon: 'text-warning-600',
          iconBg: 'bg-warning-200'
        };
      case 'accent':
        return {
          container: 'bg-gradient-to-r from-accent-50 to-accent-100 border-accent-200',
          statistic: 'text-accent-700',
          message: 'text-accent-800',
          cta: 'text-accent-900',
          icon: 'text-accent-600',
          iconBg: 'bg-accent-200'
        };
      default:
        return {
          container: 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200',
          statistic: 'text-primary-700',
          message: 'text-primary-800',
          cta: 'text-primary-900',
          icon: 'text-primary-600',
          iconBg: 'bg-primary-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div 
      className={`p-6 lg:p-8 border rounded-xl ${styles.container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-start gap-4">
        {showIcon && (
          <div className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Icon name="AlertTriangle" size={24} className={styles.icon} />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <motion.span 
              className={`text-4xl lg:text-5xl font-bold ${styles.statistic}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
            >
              {statistic}
            </motion.span>
            <span className={`text-lg font-medium ${styles.message}`}>
              {message}
            </span>
          </div>
          
          <motion.p 
            className={`text-lg font-semibold ${styles.cta}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {callToAction}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

// Preset configurations for common use cases
export const PublicHeroStatistic = (props) => (
  <StatisticHighlight
    statistic="83%"
    message="of all Public Hero's get ZERO guidance on their retirement options"
    callToAction="Get your guidance today."
    variant="warning"
    {...props}
  />
);

export const TaxTorpedoStatistic = (props) => (
  <StatisticHighlight
    statistic="$47K"
    message="average Tax Torpedo impact for public service professionals"
    callToAction="Don't let this happen to you."
    variant="primary"
    {...props}
  />
);

export const RetirementGapStatistic = (props) => (
  <StatisticHighlight
    statistic="$180K"
    message="average retirement gap for teachers and nurses"
    callToAction="Discover your gap today."
    variant="accent"
    {...props}
  />
);

export default StatisticHighlight;
