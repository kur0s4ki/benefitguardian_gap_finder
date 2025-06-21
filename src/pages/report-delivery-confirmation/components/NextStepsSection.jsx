import React from 'react';
import Icon from 'components/AppIcon';

const NextStepsSection = ({ 
  onBookAudit, 
  onShareResults, 
  onCalculateScenarios, 
  onReferColleague,
  profession = 'teacher' 
}) => {
  const getProfessionSpecificText = () => {
    const texts = {
      teacher: {
        referTitle: 'Refer a Fellow Educator',
        referDesc: 'Help your teaching colleagues discover their retirement gaps'
      },
      nurse: {
        referTitle: 'Refer a Healthcare Colleague',
        referDesc: 'Share this valuable tool with your nursing team'
      },
      'first-responder': {
        referTitle: 'Refer a Fellow First Responder',
        referDesc: 'Help your brothers and sisters in service plan for retirement'
      },
      'government-employee': {
        referTitle: 'Refer a Government Colleague',
        referDesc: 'Share with your fellow public service professionals'
      }
    };
    return texts[profession] || texts.teacher;
  };

  const professionText = getProfessionSpecificText();

  const nextSteps = [
    {
      title: 'Book Your Priority Benefit Audit',
      description: 'Schedule a personalized consultation to review your gaps and create an action plan',
      icon: 'Calendar',
      action: onBookAudit,
      primary: true,
      badge: 'Recommended'
    },
    {
      title: 'Share Your Results',
      description: 'Let others know about this valuable retirement planning tool',
      icon: 'Share2',
      action: onShareResults,
      primary: false
    },
    {
      title: 'Calculate Different Scenarios',
      description: 'Explore how different contribution amounts could close your gaps',
      icon: 'Calculator',
      action: onCalculateScenarios,
      primary: false
    },
    {
      title: professionText.referTitle,
      description: professionText.referDesc,
      icon: 'Users',
      action: onReferColleague,
      primary: false
    }
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
        <Icon name="ArrowRight" size={24} />
        What's Next?
      </h2>

      <div className="grid gap-4">
        {nextSteps.map((step, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
              step.primary 
                ? 'border-primary bg-primary-50 hover:bg-primary-100' :'border-border bg-background hover:border-primary-200'
            }`}
            onClick={step.action}
          >
            {step.badge && (
              <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                {step.badge}
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                step.primary ? 'bg-primary text-white' : 'bg-primary-100 text-primary'
              }`}>
                <Icon name={step.icon} size={20} />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${
                  step.primary ? 'text-primary' : 'text-text-primary'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  {step.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    step.primary ? 'text-primary' : 'text-primary'
                  }`}>
                    {step.primary ? 'Schedule Now' : 'Get Started'}
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={14} 
                    className={step.primary ? 'text-primary' : 'text-primary'} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Engagement */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <h3 className="font-semibold text-text-primary mb-2">
            Questions About Your Results?
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Our retirement planning specialists are here to help explain your personalized analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+15551234567"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 transition-colors duration-150"
            >
              <Icon name="Phone" size={16} />
              <span className="text-sm font-medium">(555) 123-4567</span>
            </a>
            <a
              href="mailto:support@publicservwealth.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 transition-colors duration-150"
            >
              <Icon name="Mail" size={16} />
              <span className="text-sm font-medium">Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepsSection;