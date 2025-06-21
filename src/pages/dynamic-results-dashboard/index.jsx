import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressHeader from 'components/ui/ProgressHeader';
import ConversionFooter from 'components/ui/ConversionFooter';

import RiskGauge from './components/RiskGauge';
import GapAnalysisCard from './components/GapAnalysisCard';
import DetailedBreakdown from './components/DetailedBreakdown';
import CallToActionSection from './components/CallToActionSection';

const DynamicResultsDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('teacher');

  // Mock user data - would come from previous steps
  const mockUserData = {
    profession: 'teacher',
    yearsOfService: 15,
    monthlyPension: 2800,
    state: 'California',
    retirementAge: 62,
    hasInflationProtection: false,
    hasSurvivorBenefits: true,
    currentAssets: 125000,
    riskScore: 72,
    gaps: {
      pensionGap: 185000,
      taxTorpedoRisk: 95000,
      survivorGap: 220000
    },
    monthlyContributions: {
      pensionGap: 485,
      taxTorpedo: 245,
      survivorGap: 575
    }
  };

  const professionThemes = {
    teacher: {
      emoji: '🍎',
      title: 'Educator',
      bgGradient: 'from-blue-50 to-indigo-50',
      accentColor: 'text-primary'
    },
    nurse: {
      emoji: '⚕️',
      title: 'Healthcare Hero',
      bgGradient: 'from-teal-50 to-cyan-50',
      accentColor: 'text-success'
    },
    'first-responder': {
      emoji: '🚒',
      title: 'First Responder',
      bgGradient: 'from-red-50 to-orange-50',
      accentColor: 'text-error'
    },
    'government-employee': {
      emoji: '🏛️',
      title: 'Public Servant',
      bgGradient: 'from-slate-50 to-gray-50',
      accentColor: 'text-secondary'
    }
  };

  const currentTheme = professionThemes[mockUserData.profession] || professionThemes.teacher;

  useEffect(() => {
    // Simulate loading and data processing
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowResults(true), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getRiskLevel = (score) => {
    if (score < 40) return { level: 'Low', color: 'text-success', bgColor: 'bg-success-50' };
    if (score < 70) return { level: 'Moderate', color: 'text-warning', bgColor: 'bg-warning-50' };
    return { level: 'High', color: 'text-error', bgColor: 'bg-error-50' };
  };

  const riskLevel = getRiskLevel(mockUserData.riskScore);

  const handleNavigateToCalculator = () => {
    navigate('/gap-calculator-tool');
  };

  const handleEmailReport = () => {
    // HubSpot integration would go here
    console.log('Email report requested');
    navigate('/report-delivery-confirmation');
  };

  const handleBookAudit = () => {
    // Calendly integration would go here
    console.log('Audit booking requested');
    window.open('https://calendly.com/publicserv-wealth', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressHeader currentStep={4} profession={mockUserData.profession} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Analyzing Your Retirement Profile
            </h2>
            <p className="text-text-secondary">
              Calculating personalized gap analysis...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader currentStep={4} profession={mockUserData.profession} />
      
      <main className={`bg-gradient-to-br ${currentTheme.bgGradient} min-h-screen`}>
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel.bgColor} mb-4`}>
              <span className="text-2xl">{currentTheme.emoji}</span>
              <span className={`font-semibold ${riskLevel.color}`}>
                {currentTheme.title} Risk Analysis
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Your Personalized Retirement Gap Analysis
            </h1>
            
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Based on your {mockUserData.yearsOfService} years of service and retirement planning profile, 
              we've identified critical gaps that could impact your financial security.
            </p>
          </div>
        </div>

        {/* Risk Gauge Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <RiskGauge 
              score={mockUserData.riskScore}
              profession={mockUserData.profession}
              showResults={showResults}
            />
          </div>
        </div>

        {/* Gap Analysis Cards */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
              Critical Retirement Gaps Identified
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GapAnalysisCard
                title="Pension Shortfall"
                amount={mockUserData.gaps.pensionGap}
                icon="TrendingDown"
                emoji="📉"
                description="Projected gap between your pension and retirement needs"
                riskLevel="high"
                delay={0}
              />
              
              <GapAnalysisCard
                title="Tax Torpedo Risk"
                amount={mockUserData.gaps.taxTorpedoRisk}
                icon="Zap"
                emoji="💥"
                description="Potential tax impact on your retirement income"
                riskLevel="moderate"
                delay={200}
              />
              
              <GapAnalysisCard
                title="Survivor Protection"
                amount={mockUserData.gaps.survivorGap}
                icon="Heart"
                emoji="❤️‍🩹"
                description="Income protection gap for your loved ones"
                riskLevel="high"
                delay={400}
              />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <DetailedBreakdown 
              userData={mockUserData}
              onNavigateToCalculator={handleNavigateToCalculator}
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <CallToActionSection
              onEmailReport={handleEmailReport}
              onBookAudit={handleBookAudit}
              profession={mockUserData.profession}
            />
          </div>
        </div>
      </main>

      <ConversionFooter />
    </div>
  );
};

export default DynamicResultsDashboard;