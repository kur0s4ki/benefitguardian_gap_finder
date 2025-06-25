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

  // Base state data with generic retirement system names
  const baseStates = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];

  // Function to get profession-appropriate pension system name
  const getPensionSystemName = (stateName, stateCode) => {
    const professionTemplates = {
      teacher: {
        // Most states have dedicated teacher retirement systems
        specific: {
          'CA': 'California State Teachers\' Retirement System (CalSTRS)',
          'TX': 'Teacher Retirement System of Texas',
          'NY': 'New York State Teachers\' Retirement System',
          'FL': 'Florida Retirement System (Teachers)',
          'IL': 'Illinois Teachers\' Retirement System',
          'PA': 'Pennsylvania Public School Employees\' Retirement System',
          'OH': 'Ohio State Teachers Retirement System',
          'MI': 'Michigan Public School Employees Retirement System',
          'GA': 'Teachers Retirement System of Georgia',
          'NC': 'North Carolina Teachers\' and State Employees\' Retirement System',
          'VA': 'Virginia Retirement System (Education)',
          'WA': 'Washington Teachers\' Retirement System',
          'AZ': 'Arizona State Retirement System (Education)',
          'MA': 'Massachusetts Teachers\' Retirement System',
          'TN': 'Tennessee Teachers Retirement System',
          'MO': 'Missouri Public School Retirement System',
          'WI': 'Wisconsin Teachers Retirement System',
          'MD': 'Maryland Teachers\' Retirement and Pension System',
          'MN': 'Minnesota Teachers Retirement Association',
          'CO': 'Colorado Public Employees\' Retirement Association (Education)',
          'AL': 'Alabama Teachers\' Retirement System',
          'LA': 'Louisiana Teachers\' Retirement System',
          'KY': 'Kentucky Teachers\' Retirement System',
          'OR': 'Oregon Public Employees Retirement System (Education)',
          'OK': 'Oklahoma Teachers\' Retirement System',
          'CT': 'Connecticut Teachers\' Retirement System',
          'IA': 'Iowa Public Employees\' Retirement System (Education)',
          'AR': 'Arkansas Teacher Retirement System',
          'MS': 'Mississippi Public Employees\' Retirement System (Education)',
          'KS': 'Kansas Public Employees Retirement System (Education)',
          'UT': 'Utah Retirement Systems (Education)',
          'NV': 'Nevada Public Employees\' Retirement System (Education)',
          'NM': 'New Mexico Educational Retirement Board',
          'WV': 'West Virginia Teachers\' Retirement System',
          'ID': 'Idaho Public Employee Retirement System (Education)',
          'NH': 'New Hampshire Teachers\' Retirement System',
          'ME': 'Maine Public Employees Retirement System (Education)',
          'HI': 'Hawaii Employees\' Retirement System (Education)',
          'RI': 'Rhode Island Employees\' Retirement System (Education)',
          'MT': 'Montana Teachers\' Retirement System',
          'DE': 'Delaware Public Employees\' Retirement System (Education)',
          'SD': 'South Dakota Teachers Retirement System',
          'ND': 'North Dakota Teachers\' Fund for Retirement',
          'AK': 'Alaska Teachers\' Retirement System',
          'VT': 'Vermont Teachers\' Retirement System',
          'WY': 'Wyoming Public Employees\' Retirement System (Education)',
          'NJ': 'New Jersey Teachers\' Pension and Annuity Fund',
          'IN': 'Indiana Teachers\' Retirement Fund',
          'SC': 'South Carolina Teachers and Employees Retirement System'
        },
        default: `${stateName} Teachers\' Retirement System`
      },
      nurse: {
        // Nurses often participate in general public employee or healthcare-specific systems
        specific: {
          'CA': 'California Public Employees\' Retirement System (CalPERS)',
          'TX': 'Employees Retirement System of Texas',
          'NY': 'New York State and Local Employees\' Retirement System',
          'FL': 'Florida Retirement System (Healthcare)',
          'IL': 'Illinois Municipal Retirement Fund',
          'PA': 'Pennsylvania Public Employee Retirement System',
          'OH': 'Ohio Public Employees Retirement System',
          'MI': 'Michigan Municipal Employees Retirement System',
          'GA': 'Employees\' Retirement System of Georgia',
          'NC': 'North Carolina Local Governmental Employees\' Retirement System',
          'VA': 'Virginia Retirement System (Healthcare)',
          'WA': 'Washington Public Employees\' Retirement System',
          'AZ': 'Arizona State Retirement System',
          'MA': 'Massachusetts State Employees\' Retirement System',
          'TN': 'Tennessee Consolidated Retirement System'
        },
        default: `${stateName} Public Employees\' Retirement System`
      },
      'first-responder': {
        // First responders often have dedicated public safety retirement systems
        specific: {
          'CA': 'California Public Safety Officers\' Retirement System',
          'TX': 'Texas Public Safety Personnel Retirement System',
          'NY': 'New York Police and Fire Retirement System',
          'FL': 'Florida Retirement System (Special Risk)',
          'IL': 'Illinois Police Officers\' Retirement System',
          'PA': 'Pennsylvania Municipal Police Officers\' Retirement System',
          'OH': 'Ohio Police and Fire Pension Fund',
          'MI': 'Michigan Public Safety Employees Retirement System',
          'GA': 'Georgia Public Safety Retirement System',
          'NC': 'North Carolina Local Governmental Employees\' Retirement System (Law Enforcement)',
          'VA': 'Virginia Retirement System (Public Safety)',
          'WA': 'Washington Law Enforcement Officers\' and Firefighters\' Retirement System',
          'AZ': 'Arizona Public Safety Personnel Retirement System',
          'MA': 'Massachusetts State Police Retirement System',
          'TN': 'Tennessee Police Officers and Firefighters Pension Plan'
        },
        default: `${stateName} Public Safety Retirement System`
      },
      'government-employee': {
        // Government employees typically use general public employee systems
        specific: {
          'CA': 'California Public Employees\' Retirement System (CalPERS)',
          'TX': 'Employees Retirement System of Texas',
          'NY': 'New York State and Local Employees\' Retirement System',
          'FL': 'Florida Retirement System',
          'IL': 'Illinois State Employees\' Retirement System',
          'PA': 'Pennsylvania State Employees\' Retirement System',
          'OH': 'Ohio Public Employees Retirement System',
          'MI': 'Michigan State Employees\' Retirement System',
          'GA': 'Employees\' Retirement System of Georgia',
          'NC': 'North Carolina State and Local Government Workers\' Retirement System',
          'VA': 'Virginia Retirement System',
          'WA': 'Washington State Department of Retirement Systems',
          'AZ': 'Arizona State Retirement System',
          'MA': 'Massachusetts State Employees\' Retirement System',
          'TN': 'Tennessee Consolidated Retirement System'
        },
        default: `${stateName} State Employees\' Retirement System`
      }
    };

    const professionTemplate = professionTemplates[profession] || professionTemplates['government-employee'];
    return professionTemplate.specific[stateCode] || professionTemplate.default;
  };

  // Generate states with profession-specific pension systems
  const states = baseStates.map(state => ({
    ...state,
    pensionSystem: getPensionSystemName(state.name, state.code)
  }));

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