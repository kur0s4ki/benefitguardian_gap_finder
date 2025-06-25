import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const StateSelector = ({ 
  value, 
  onChange, 
  error, 
  profession, 
  mobile = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const states = [
    { code: 'AL', name: 'Alabama', pensionSystem: 'Alabama Retirement Systems' },
    { code: 'AK', name: 'Alaska', pensionSystem: 'Alaska Retirement Systems' },
    { code: 'AZ', name: 'Arizona', pensionSystem: 'Arizona State Retirement System' },
    { code: 'AR', name: 'Arkansas', pensionSystem: 'Arkansas Public Employees Retirement System' },
    { code: 'CA', name: 'California', pensionSystem: 'California Public Employees\' Retirement System (CalPERS)' },
    { code: 'CO', name: 'Colorado', pensionSystem: 'Colorado Public Employees\' Retirement Association (PERA)' },
    { code: 'CT', name: 'Connecticut', pensionSystem: 'Connecticut Retirement Plans and Trust Funds' },
    { code: 'DE', name: 'Delaware', pensionSystem: 'Delaware Public Employees\' Retirement System' },
    { code: 'FL', name: 'Florida', pensionSystem: 'Florida Retirement System' },
    { code: 'GA', name: 'Georgia', pensionSystem: 'Employees\' Retirement System of Georgia' },
    { code: 'HI', name: 'Hawaii', pensionSystem: 'Employees\' Retirement System of Hawaii' },
    { code: 'ID', name: 'Idaho', pensionSystem: 'Public Employee Retirement System of Idaho' },
    { code: 'IL', name: 'Illinois', pensionSystem: 'Illinois Public Employee Retirement Systems' },
    { code: 'IN', name: 'Indiana', pensionSystem: 'Indiana Public Retirement System' },
    { code: 'IA', name: 'Iowa', pensionSystem: 'Iowa Public Employees\' Retirement System' },
    { code: 'KS', name: 'Kansas', pensionSystem: 'Kansas Public Employees Retirement System' },
    { code: 'KY', name: 'Kentucky', pensionSystem: 'Kentucky Retirement Systems' },
    { code: 'LA', name: 'Louisiana', pensionSystem: 'Louisiana State Employees\' Retirement System' },
    { code: 'ME', name: 'Maine', pensionSystem: 'Maine Public Employees Retirement System' },
    { code: 'MD', name: 'Maryland', pensionSystem: 'Maryland State Retirement and Pension System' },
    { code: 'MA', name: 'Massachusetts', pensionSystem: 'Massachusetts Public Employee Retirement Administration' },
    { code: 'MI', name: 'Michigan', pensionSystem: 'Michigan Public Employee Retirement Systems' },
    { code: 'MN', name: 'Minnesota', pensionSystem: 'Minnesota State Retirement System' },
    { code: 'MS', name: 'Mississippi', pensionSystem: 'Mississippi Public Employees\' Retirement System' },
    { code: 'MO', name: 'Missouri', pensionSystem: 'Missouri State Employees\' Retirement System' },
    { code: 'MT', name: 'Montana', pensionSystem: 'Montana Public Employee Retirement Systems' },
    { code: 'NE', name: 'Nebraska', pensionSystem: 'Nebraska Public Employees Retirement Systems' },
    { code: 'NV', name: 'Nevada', pensionSystem: 'Nevada Public Employees\' Retirement System' },
    { code: 'NH', name: 'New Hampshire', pensionSystem: 'New Hampshire Retirement System' },
    { code: 'NJ', name: 'New Jersey', pensionSystem: 'New Jersey Public Employee Retirement Systems' },
    { code: 'NM', name: 'New Mexico', pensionSystem: 'New Mexico Public Employee Retirement Systems' },
    { code: 'NY', name: 'New York', pensionSystem: 'New York State and Local Retirement Systems' },
    { code: 'NC', name: 'North Carolina', pensionSystem: 'North Carolina Retirement Systems' },
    { code: 'ND', name: 'North Dakota', pensionSystem: 'North Dakota Public Employees Retirement System' },
    { code: 'OH', name: 'Ohio', pensionSystem: 'Ohio Public Employees Retirement System' },
    { code: 'OK', name: 'Oklahoma', pensionSystem: 'Oklahoma Public Employees Retirement System' },
    { code: 'OR', name: 'Oregon', pensionSystem: 'Oregon Public Employees Retirement System' },
    { code: 'PA', name: 'Pennsylvania', pensionSystem: 'Pennsylvania Public Employee Retirement Systems' },
    { code: 'RI', name: 'Rhode Island', pensionSystem: 'Rhode Island Employees\' Retirement System' },
    { code: 'SC', name: 'South Carolina', pensionSystem: 'South Carolina Retirement Systems' },
    { code: 'SD', name: 'South Dakota', pensionSystem: 'South Dakota Retirement System' },
    { code: 'TN', name: 'Tennessee', pensionSystem: 'Tennessee Consolidated Retirement System' },
    { code: 'TX', name: 'Texas', pensionSystem: 'Texas Public Employee Retirement Systems' },
    { code: 'UT', name: 'Utah', pensionSystem: 'Utah Retirement Systems' },
    { code: 'VT', name: 'Vermont', pensionSystem: 'Vermont State Retirement Systems' },
    { code: 'VA', name: 'Virginia', pensionSystem: 'Virginia Retirement System' },
    { code: 'WA', name: 'Washington', pensionSystem: 'Washington State Department of Retirement Systems' },
    { code: 'WV', name: 'West Virginia', pensionSystem: 'West Virginia Retirement Systems' },
    { code: 'WI', name: 'Wisconsin', pensionSystem: 'Wisconsin Retirement System' },
    { code: 'WY', name: 'Wyoming', pensionSystem: 'Wyoming Retirement System' }
  ];

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedState = states.find(state => state.code === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredStates.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredStates.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleStateSelect(filteredStates[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleStateSelect = (state) => {
    onChange(state.code);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const getProfessionContext = () => {
    const contexts = {
      teacher: {
        title: 'Select Your State',
        description: 'Each state has different teacher retirement systems and benefit structures',
        icon: 'MapPin'
      },
      nurse: {
        title: 'Select Your State',
        description: 'Healthcare retirement benefits vary significantly by state',
        icon: 'MapPin'
      },
      'first-responder': {
        title: 'Select Your State',
        description: 'Public safety retirement systems differ across states',
        icon: 'MapPin'
      },
      'government-employee': {
        title: 'Select Your State',
        description: 'Government employee benefits are state-specific',
        icon: 'MapPin'
      }
    };
    return contexts[profession] || contexts.teacher;
  };

  const context = getProfessionContext();

  return (
    <div className={`${mobile ? 'flex-1 flex flex-col' : ''}`} ref={dropdownRef}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-1">
            {context.title}
          </h3>
          <p className="text-text-secondary text-sm">
            {context.description}
          </p>
        </div>
        
        <Icon name={context.icon} size={24} className="text-primary" />
      </div>

      <div className={`${mobile ? 'flex-1 flex flex-col justify-center' : ''}`}>
        {/* State Selector */}
        <div className="relative mb-4">
          <button
            ref={inputRef}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={`input-field w-full px-4 py-4 text-left flex items-center justify-between ${
              error ? 'border-error focus:border-error focus:ring-error-100' : ''
            }`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-3">
              {selectedState ? (
                <>
                  <div className="w-8 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{selectedState.code}</span>
                  </div>
                  <span className="font-medium text-text-primary">{selectedState.name}</span>
                </>
              ) : (
                <span className="text-text-muted">Select your state...</span>
              )}
            </div>
            <Icon 
              name={isOpen ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              className="text-text-secondary" 
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-modal max-h-64 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search states..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setHighlightedIndex(-1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary-100 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* States List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredStates.length > 0 ? (
                  filteredStates.map((state, index) => (
                    <button
                      key={state.code}
                      onClick={() => handleStateSelect(state)}
                      className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150 ${
                        index === highlightedIndex ? 'bg-primary-50' : ''
                      } ${value === state.code ? 'bg-primary-100 text-primary' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-6 rounded flex items-center justify-center ${
                          value === state.code ? 'bg-primary' : 'bg-secondary-200'
                        }`}>
                          <span className={`text-xs font-bold ${
                            value === state.code ? 'text-white' : 'text-secondary'
                          }`}>
                            {state.code}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{state.name}</div>
                          <div className="text-xs text-text-muted truncate max-w-xs">
                            {state.pensionSystem}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-text-muted">
                    <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No states found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected State Info */}
        {selectedState && (
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{selectedState.code}</span>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-1">{selectedState.name}</h4>
                <p className="text-sm text-text-secondary">
                  Retirement System: {selectedState.pensionSystem}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Popular States */}
        {!selectedState && (
          <div className="mt-4">
            <p className="text-sm font-medium text-text-secondary mb-3">Popular States:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['CA', 'TX', 'FL', 'NY'].map((stateCode) => {
                const state = states.find(s => s.code === stateCode);
                return (
                  <button
                    key={stateCode}
                    onClick={() => handleStateSelect(state)}
                    className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors duration-150 text-center"
                  >
                    <div className="w-8 h-6 bg-secondary rounded mx-auto mb-1 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{stateCode}</span>
                    </div>
                    <div className="text-sm font-medium text-secondary">{state.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
            <span className="text-sm text-error-600">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateSelector;