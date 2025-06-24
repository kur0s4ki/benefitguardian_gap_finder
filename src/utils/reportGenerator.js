import { jsPDF } from 'jspdf';

/**
 * Generates a full report PDF using userData and projections.
 * @param {Object} userData - normalized results from calculation engine and transformed for UI.
 * @param {Object} projections - calculator projections (optional)
 * @returns {Uint8Array} ArrayBuffer of PDF to be used for download or email attachment.
 */
const buildDoc = (userData, projections = {}) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const lineHeight = 18;
  let y = 40;

  const addHeading = (text) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(text, 40, y);
    y += lineHeight * 1.5;
  };

  const addBody = (text) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(text, 520);
    splitText.forEach(t => {
      doc.text(t, 40, y);
      y += lineHeight;
    });
    y += lineHeight * 0.5;
  };

  // Title Page
  doc.setFontSize(22);
  doc.text('Personalized Retirement Gap Analysis', 40, y);
  y += lineHeight * 2;
  doc.setFontSize(14);
  doc.text(`Profession: ${userData.profession}`, 40, y);
  y += lineHeight;
  doc.text(`GrowthGuard Risk Score: ${userData.riskScore}`, 40, y);
  y += lineHeight;
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, y);

  doc.addPage();
  y = 40;
  // Section: Detailed Risk Analysis
  addHeading('1. Detailed Risk Analysis');
  addBody(`Risk Score: ${userData.riskScore} / 100`);
  addBody(`Risk Level: ${userData.riskColor === 'red' ? 'High' : userData.riskColor === 'gold' ? 'Moderate' : 'Low'}`);
  addBody(`Pension Risk: ${userData.riskComponents?.pensionRisk ?? 'N/A'}`);
  addBody(`Tax Risk: ${userData.riskComponents?.taxRisk ?? 'N/A'}`);
  addBody(`Survivor Risk: ${userData.riskComponents?.survivorRisk ?? 'N/A'}`);

  // Section: Gap Calculations
  addHeading('2. Gap Calculations');
  if (userData.gaps) {
    addBody(`Pension Gap: $${userData.gaps.pension.monthly || 0}/month ($${userData.gaps.pension.amount.toLocaleString()} over 20 years)`);
    addBody(`Tax Torpedo Risk: $${userData.gaps.tax.amount.toLocaleString()}`);
    addBody(`Survivor Protection Gap: $${userData.gaps.survivor.monthly || 0}/month ($${userData.gaps.survivor.amount.toLocaleString()} over 20 years)`);
  } else {
    // Fallback for older data format
    addBody(`Pension Gap: $${(userData.pensionGap || 0).toLocaleString()}/month ($${((userData.pensionGap || 0)*240).toLocaleString()} over 20 years)`);
    addBody(`Tax Torpedo Risk: $${(userData.taxTorpedo || 0).toLocaleString()}`);
    addBody(`Survivor Protection Gap: $${(userData.survivorGap || 0).toLocaleString()}/month ($${((userData.survivorGap || 0)*240).toLocaleString()} over 20 years)`);
  }
  addBody(`Total Gap: $${(userData.totalGap || 0).toLocaleString()}`);

  // Section: Action Plan
  addHeading('3. Action Plan');
  const actions = [
    'Increase contributions to retirement accounts to close the pension gap.',
    'Implement tax-diversification strategies (Roth conversions, withdrawal sequencing).',
    'Ensure survivor benefits or supplemental insurance are in place.'
  ];
  actions.forEach(a => addBody(`• ${a}`));

  // Section: Projection Scenarios
  addHeading('4. Projection Scenarios');
  if (projections && projections.totalContributions) {
    addBody(`Scenario: Retirement age ${(projections.yearsToRetirement || 0) + (userData.currentAge || 45)}, contribution $${(projections.monthlyNeeded || 0).toLocaleString()}/month`);
    addBody(`Projected value: $${(projections.projectedValue || 0).toLocaleString()}`);
    addBody(`Gap closure: ${projections.gapClosure}%`);
  } else {
    addBody('No projection scenarios calculated yet. Use the Gap Calculator Tool to create scenarios.');
  }

  // Section: Benefit Optimization
  addHeading('5. Benefit Optimization');
  addBody('• Review your pension plan for purchase-of-service or DROP options.');
  addBody('• Coordinate Social Security claiming strategy with pension income.');
  addBody('• Leverage health-savings or 457(b) plans available to first responders.');

  // Section: Timeline Guidance
  addHeading('6. Timeline Guidance');
  addBody('Now – 5 Years: Increase contributions, execute Roth ladder conversions.');
  addBody('5 – 10 Years: Evaluate partial lump-sum options, lock in COLA-protected benefits.');
  addBody('Retirement Date: Finalize survivor elections, set tax-efficient withdrawal plan.');

  return doc;
};

export const generateFullReport = (userData, projections = {}) => {
  return buildDoc(userData, projections).output('arraybuffer');
};

export const downloadFullReport = (userData, projections = {}) => {
  buildDoc(userData, projections).save('Retirement_Gap_Report.pdf');
}; 