import { jsPDF } from 'jspdf';

/**
 * Generates a professional, single-page PDF report using the EXACT same data as results page.
 * @param {Object} calculatedResults - Direct results from calculation engine (same as results page uses)
 * @param {Object} projections - calculator projections (optional)
 * @returns {Uint8Array} ArrayBuffer of PDF to be used for download or email attachment.
 */
const buildDoc = (calculatedResults, projections = {}) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;

  // Professional colors - only black and blue
  const blue = [15, 94, 156]; // #0F5E9C
  const black = [0, 0, 0];
  const lightGray = [128, 128, 128];

  let y = margin;

  // Header Section
  doc.setFontSize(24);
  doc.setTextColor(...blue);
  doc.setFont('helvetica', 'bold');
  doc.text('GapGuardian Gold Standard™ Analysis Report', margin, y);
  y += 40;

  // Date and basic info
  doc.setFontSize(12);
  doc.setTextColor(...black);
  doc.setFont('helvetica', 'normal');

  // Use actual current date
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
  doc.text(`Generated: ${formattedDate}`, margin, y);

  // Format profession properly
  const profession = calculatedResults.profession || 'Professional';
  const formattedProfession = profession === 'teacher' ? 'Educator' :
                             profession === 'government-employee' ? 'Government Employee' :
                             profession.charAt(0).toUpperCase() + profession.slice(1);
  doc.text(`Profession: ${formattedProfession}`, pageWidth - margin - 150, y);
  y += 30;

  // Risk Score Section
  doc.setFontSize(16);
  doc.setTextColor(...blue);
  doc.setFont('helvetica', 'bold');
  doc.text('RISK ASSESSMENT', margin, y);
  y += 25;

  doc.setFontSize(12);
  doc.setTextColor(...black);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Risk Score: ${calculatedResults.riskScore || 0}/100`, margin, y);

  const riskLevel = (calculatedResults.riskScore || 0) >= 70 ? 'High Risk' :
                   (calculatedResults.riskScore || 0) >= 40 ? 'Moderate Risk' : 'Low Risk';
  doc.text(`Risk Level: ${riskLevel}`, margin + 200, y);
  y += 20;

  // Risk Components
  if (calculatedResults.riskComponents) {
    doc.text(`Pension Risk: ${calculatedResults.riskComponents.pensionRisk || 0}%`, margin, y);
    doc.text(`Tax Risk: ${calculatedResults.riskComponents.taxRisk || 0}%`, margin + 150, y);
    doc.text(`Survivor Risk: ${calculatedResults.riskComponents.survivorRisk || 0}%`, margin + 300, y);
  }
  y += 35;

  // Gap Analysis Section - USE EXACT SAME DATA AS RESULTS PAGE
  doc.setFontSize(16);
  doc.setTextColor(...blue);
  doc.setFont('helvetica', 'bold');
  doc.text('GAP ANALYSIS', margin, y);
  y += 25;

  doc.setFontSize(12);
  doc.setTextColor(...black);
  doc.setFont('helvetica', 'normal');

  // EXACT same data extraction as results page (lines 442, 456, 470 in dynamic-results-dashboard)
  const pensionGap = calculatedResults.pensionGap || 0;
  const taxTorpedo = calculatedResults.taxTorpedo || 0;
  const survivorGap = calculatedResults.survivorGap || 0;
  const totalGap = calculatedResults.totalGap || 0;

  // Display gaps exactly like results page shows them
  doc.text(`Monthly Pension Gap: $${pensionGap.toLocaleString()}`, margin, y);
  y += 18;

  doc.text(`Tax Torpedo Risk: $${taxTorpedo.toLocaleString()}`, margin, y);
  y += 18;

  doc.text(`Survivor Protection Gap: $${survivorGap.toLocaleString()}/month`, margin, y);
  y += 18;

  doc.text(`Total Retirement Gap: $${totalGap.toLocaleString()}`, margin, y);
  y += 35;

  // Current Age and Retirement Info
  doc.setFontSize(16);
  doc.setTextColor(...blue);
  doc.setFont('helvetica', 'bold');
  doc.text('RETIREMENT PLANNING', margin, y);
  y += 25;

  doc.setFontSize(12);
  doc.setTextColor(...black);
  doc.setFont('helvetica', 'normal');

  // Display available retirement planning data
  const currentAge = calculatedResults.currentAge || 'N/A';
  const retirementAge = calculatedResults.retirementAge || 'N/A';
  const yearsOfService = calculatedResults.yearsOfService || 'N/A';

  doc.text(`Current Age: ${currentAge}`, margin, y);
  if (retirementAge !== 'N/A') {
    doc.text(`Planned Retirement Age: ${retirementAge}`, margin + 150, y);
  }
  doc.text(`Years of Service: ${yearsOfService}`, margin + (retirementAge !== 'N/A' ? 350 : 200), y);
  y += 35;

  // Recommendations Section
  doc.setFontSize(16);
  doc.setTextColor(...blue);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMMENDATIONS', margin, y);
  y += 25;

  doc.setFontSize(12);
  doc.setTextColor(...black);
  doc.setFont('helvetica', 'normal');

  const recommendations = [
    'Increase retirement contributions to close pension gap',
    'Consider Roth IRA conversions for tax diversification',
    'Review pension benefit options and survivor elections',
    'Evaluate supplemental insurance for survivor protection',
    'Implement tax-efficient withdrawal strategies'
  ];

  recommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, margin, y);
    y += 18;
  });

  y += 20;

  // Projections Section (if available)
  const hasProjections = projections && Object.keys(projections).length > 0;
  const hasMonthlyContribution = calculatedResults.monthlyContribution;

  if (hasProjections || hasMonthlyContribution) {
    doc.setFontSize(16);
    doc.setTextColor(...blue);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTIONS', margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'normal');

    // Show monthly contribution needed from projections or calculatedResults
    const monthlyNeeded = projections?.monthlyNeeded || calculatedResults.monthlyContribution;
    if (monthlyNeeded) {
      doc.text(`Monthly Contribution Needed: $${Math.round(monthlyNeeded).toLocaleString()}`, margin, y);
      y += 18;
    }

    if (projections?.projectedValue) {
      doc.text(`Projected Portfolio Value: $${Math.round(projections.projectedValue).toLocaleString()}`, margin, y);
      y += 18;
    }

    if (projections?.gapClosure) {
      doc.text(`Gap Closure Percentage: ${Math.round(projections.gapClosure)}%`, margin, y);
      y += 18;
    }

    // Add lifetime payout if available
    if (calculatedResults.lifetimePayout) {
      doc.text(`Projected Lifetime Payout: $${Math.round(calculatedResults.lifetimePayout).toLocaleString()}`, margin, y);
      y += 18;
    }
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.setFont('helvetica', 'normal');
  doc.text('This analysis is for educational purposes only. Consult a financial advisor for personalized advice.', margin, pageHeight - 40);

  return doc;
};

export const generateFullReport = (calculatedResults, projections = {}) => {
  return buildDoc(calculatedResults, projections).output('arraybuffer');
};

export const downloadFullReport = (calculatedResults, projections = {}) => {
  buildDoc(calculatedResults, projections).save('Retirement_Gap_Report.pdf');
};