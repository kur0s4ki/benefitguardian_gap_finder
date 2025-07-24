import React from 'react';
import Icon from '../AppIcon';

const EnhancedCTAWrapper = ({ 
  children, 
  title, 
  subtitle, 
  urgencyText,
  className = "",
  variant = "default" // "default", "compact"
}) => {
  const isCompact = variant === "compact";

  return (
    <div className={`relative ${className}`}>
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-primary-50 rounded-xl opacity-80"></div>

      {/* Main Container */}
      <div className="relative bg-white rounded-xl border-2 border-primary-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-primary-400">
        {/* Decorative Top Badge */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <Icon name="Star" size={12} className="text-accent-300" />
            {urgencyText || "RECOMMENDED NEXT STEP"}
            <Icon name="Star" size={12} className="text-accent-300" />
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${isCompact ? 'pt-8' : 'pt-10'} text-center`}>
          {!isCompact && (
            <>
              {/* Title */}
              {title && (
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {title}
                </h3>
              )}

              {/* Subtitle */}
              {subtitle && (
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  {subtitle}
                </p>
              )}
            </>
          )}

          {/* CTA Button */}
          <div className="relative">
            {/* Subtle Button Highlight */}
            <div className="absolute inset-0 bg-primary-100 rounded-lg blur-sm opacity-30"></div>

            {/* Actual Button */}
            <div className="relative transform transition-transform duration-200 hover:scale-105">
              {children}
            </div>
          </div>

          {/* Decorative Elements */}
          {!isCompact && (
            <div className="mt-4 flex justify-center items-center gap-2 text-xs text-text-secondary">
              <Icon name="Shield" size={12} className="text-primary" />
              <span>Secure & Confidential</span>
              <span>•</span>
              <Icon name="Clock" size={12} className="text-primary" />
              <span>Takes 2 minutes</span>
            </div>
          )}
        </div>

        {/* Subtle Corner Accents */}
        <div className="absolute top-3 left-3 text-primary-200 opacity-60">
          <Icon name="Sparkles" size={14} className="animate-pulse" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-3 right-3 text-primary-200 opacity-60">
          <Icon name="Sparkles" size={14} className="animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-3 left-3 text-primary-200 opacity-60">
          <Icon name="Sparkles" size={14} className="animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-3 right-3 text-primary-200 opacity-60">
          <Icon name="Sparkles" size={14} className="animate-pulse" style={{ animationDelay: '3s' }} />
        </div>
      </div>

      {/* Subtle Bottom Shadow */}
      <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-primary-50 to-transparent rounded-b-xl transform translate-y-1 opacity-40"></div>
    </div>
  );
};

export default EnhancedCTAWrapper;
