import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CalculationLog = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!log || log.length === 0) {
    return null;
  }

  return (
    <div className="card mt-8 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Icon name="Terminal" size={18} className="text-text-secondary" />
          <h3 className="font-semibold text-text-primary">
            Calculation Analysis Log
          </h3>
        </div>
        <Icon
          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
          size={20}
          className="text-text-secondary transition-transform"
        />
      </button>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <pre className="bg-surface-sunken p-3 rounded-lg text-xs text-text-secondary whitespace-pre-wrap font-mono">
            {log.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CalculationLog; 