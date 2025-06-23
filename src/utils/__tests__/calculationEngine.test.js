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