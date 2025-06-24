import { calculateBenefitGaps } from '../calculationEngine';

describe('calculateBenefitGaps – core logic', () => {
  const baseInput = {
    profession: 'teacher',
    yearsOfService: 20,
    state: 'CA',
    retirementAge: 65,
    currentAge: 45,
    otherSavings: 0,
    financialFears: []
  };

  test('survivor-risk is lower when survivor planning is "yes"', () => {
    const withProtection = calculateBenefitGaps({ ...baseInput, survivorPlanning: 'yes' });
    const noProtection = calculateBenefitGaps({ ...baseInput, survivorPlanning: 'no' });

    expect(withProtection.riskComponents.survivorRisk).toBeLessThan(noProtection.riskComponents.survivorRisk);
    expect(withProtection.riskScore).toBeLessThan(noProtection.riskScore);
  });

  test('riskScore is clamped to 0-100', () => {
    const result = calculateBenefitGaps({
      ...baseInput,
      otherSavings: 10_000_000, // extreme savings to push risk high
      survivorPlanning: 'no'
    });

    expect(result.riskScore).toBeLessThanOrEqual(100);
    expect(result.riskScore).toBeGreaterThanOrEqual(0);
  });

  test('totalGap is calculated correctly', () => {
    const result = calculateBenefitGaps({
      ...baseInput,
      survivorPlanning: 'no'
    });

    const expectedTotalGap = (result.pensionGap + result.survivorGap) * 240 + result.taxTorpedo;
    expect(result.totalGap).toBe(expectedTotalGap);
    expect(result.totalGap).toBeGreaterThan(0);
  });

  test('gaps structure is properly formatted', () => {
    const result = calculateBenefitGaps({
      ...baseInput,
      survivorPlanning: 'no'
    });

    expect(result.gaps).toBeDefined();
    expect(result.gaps.pension).toBeDefined();
    expect(result.gaps.tax).toBeDefined();
    expect(result.gaps.survivor).toBeDefined();
    
    // Check that gap amounts are consistent
    expect(result.gaps.pension.amount).toBe(result.pensionGap * 240);
    expect(result.gaps.survivor.amount).toBe(result.survivorGap * 240);
    expect(result.gaps.tax.amount).toBe(result.taxTorpedo);
  });

  describe('yearsUntilRetirementBand edge cases', () => {
    const cases = [
      { diff: 5, exp: '5-10' },
      { diff: 10, exp: '5-10' },
      { diff: 11, exp: '11-15' },
      { diff: 18, exp: '16-20' },
      { diff: 26, exp: '26+' }
    ];

    cases.forEach(({ diff, exp }) => {
      it(`${diff} years ⇒ ${exp}`, () => {
        const r = calculateBenefitGaps({
          ...baseInput,
          retirementAge: baseInput.currentAge + diff,
          survivorPlanning: 'no'
        });
        expect(r.yearsUntilRetirementBand).toBe(exp);
      });
    });
  });

  test('COLA protection lowers pensionRisk', () => {
    const noCola = calculateBenefitGaps({ ...baseInput, inflationProtection: 'no' });
    const withCola = calculateBenefitGaps({ ...baseInput, inflationProtection: 'yes' });

    expect(withCola.riskComponents.pensionRisk).toBeLessThan(noCola.riskComponents.pensionRisk);
  });

  describe('Hidden Benefit Opportunity varies by profession/state', () => {
    it('Teacher in CA vs Nurse in FL should differ', () => {
      const teacherCA = calculateBenefitGaps({ ...baseInput, profession: 'teacher', state: 'CA' });
      const nurseFL = calculateBenefitGaps({ ...baseInput, profession: 'nurse', state: 'FL' });

      expect(teacherCA.hiddenBenefitOpportunity).not.toBe(nurseFL.hiddenBenefitOpportunity);
      // Ensure formula responds in expected direction (nurse has 1.15 factor, FL state 1.1)
      const expectedRatio = (1.15 * 1.1) / (1 * 1.2); // nurseFL / teacherCA factors
      const actualRatio = nurseFL.hiddenBenefitOpportunity / teacherCA.hiddenBenefitOpportunity;
      expect(actualRatio).toBeCloseTo(expectedRatio, 1);
    });
  });
});

// Helper tests for the gap-closure clamp used in the calculator view.
// Replicates the inline formula to ensure future refactors keep behaviour.
const clampGapClosure = (projected, gap) => Math.min(100, Math.max(0, (projected / gap) * 100));

describe('gap-closure clamp utility', () => {
  test('caps at 100%', () => {
    expect(clampGapClosure(1500, 1000)).toBe(100);
  });

  test('floors at 0%', () => {
    expect(clampGapClosure(-200, 1000)).toBe(0);
  });
}); 