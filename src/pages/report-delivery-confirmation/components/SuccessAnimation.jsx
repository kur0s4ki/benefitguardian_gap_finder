import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const SuccessAnimation = ({ profession = 'teacher' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setShowConfetti(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getProfessionIcon = () => {
    const icons = {
      teacher: '🍎',
      nurse: '⚕️',
      'first-responder': '🚒',
      'government-employee': '🏛️'
    };
    return icons[profession] || icons.teacher;
  };

  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    left: Math.random() * 100,
    color: ['#0F5E9C', '#FFD700', '#2A9D8F', '#E63946'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: piece.color,
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                top: '-10px'
              }}
            />
          ))}
        </div>
      )}

      {/* Main Success Animation */}
      <div className="relative z-10">
        {/* Success Checkmark Circle */}
        <div className={`mx-auto w-24 h-24 lg:w-32 lg:h-32 bg-success rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}>
          <Icon 
            name="Check" 
            size={48} 
            className="text-white animate-pulse" 
          />
        </div>

        {/* Profession Icon */}
        <div className={`text-6xl lg:text-8xl mb-4 transition-all duration-700 delay-300 ${
          isAnimating ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-45'
        }`}>
          {getProfessionIcon()}
        </div>

        {/* Animated Rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className={`absolute border-2 border-success rounded-full transition-all duration-1000 ${
                isAnimating ? 'opacity-30' : 'opacity-0'
              }`}
              style={{
                width: `${80 + ring * 40}px`,
                height: `${80 + ring * 40}px`,
                top: `${-40 - ring * 20}px`,
                left: `${-40 - ring * 20}px`,
                animationDelay: `${ring * 0.2}s`,
                animation: isAnimating ? `pulse 2s infinite ${ring * 0.2}s` : 'none'
              }}
            />
          ))}
        </div>

        {/* Success Message */}
        <div className={`transition-all duration-500 delay-500 ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="inline-flex items-center gap-2 bg-success-50 text-success-600 px-4 py-2 rounded-full text-sm font-medium">
            <Icon name="Mail" size={16} />
            <span>Report Successfully Generated</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation;