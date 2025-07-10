/**
 * Calculate the future value of premium payments
 * 
 * For ANNUAL premiums:
 * FV = Premium × [(1 + r)^n - 1] / r × (1 + r)
 * 
 * For MONTHLY premiums:
 * FV = Premium × [(1 + r/12)^(12n) - 1] / (r/12) × (1 + r/12)
 */
export function calculateFutureValue(
  premium: number, 
  interestRate: number, 
  years: number,
  paymentFrequency: 'monthly' | 'annual' = 'annual'
): number {
  const r = interestRate / 100;
  
  if (paymentFrequency === 'annual') {
    // Annual premium formula
    const compoundFactor = Math.pow(1 + r, years) - 1;
    // Handle case where interest rate is 0
    if (r === 0) {
      return Math.round(premium * years);
    }
    const futureValue = premium * (compoundFactor / r) * (1 + r);
    return Math.round(futureValue);
  } else {
    // Monthly premium formula
    const monthlyRate = r / 12;
    const totalMonths = years * 12;
    const compoundFactor = Math.pow(1 + monthlyRate, totalMonths) - 1;
    // Handle case where interest rate is 0
    if (monthlyRate === 0) {
      return Math.round(premium * totalMonths);
    }
    const futureValue = premium * (compoundFactor / monthlyRate) * (1 + monthlyRate);
    return Math.round(futureValue);
  }
}

/**
 * Apply inflation adjustment to a future value
 * Real FV = FV / (1 + i)^n
 */
export function applyInflationAdjustment(futureValue: number, inflationRate: number, years: number): number {
  const i = inflationRate / 100;
  
  // Handle case where inflation rate is 0
  if (i === 0) {
    return futureValue;
  }
  
  const inflationFactor = Math.pow(1 + i, years);
  const adjustedValue = futureValue / inflationFactor;
  return Math.round(adjustedValue);
}

/**
 * Calculate monthly retirement income based on account value and withdrawal percentage
 */
export function calculateRetirementIncome(accountValue: number, withdrawalPercentage: number): number {
  // Monthly income = Account Value * (Withdrawal Percentage / 100) / 12
  return Math.round((accountValue * (withdrawalPercentage / 100)) / 12);
}

/**
 * Calculate all results for a premium comparison
 */
export function calculateComparisonResults(
  premiumA: number,
  premiumB: number,
  fundingPeriod: number,
  inflationRate: number,
  frequencyA: 'monthly' | 'annual' = 'annual',
  frequencyB: 'monthly' | 'annual' = 'annual'
) {
  // Define the interest rates to use for calculations
  const interestRates = [3.5, 6.45, 8.14, 10.17];
  
  const results = interestRates.map(interestRate => {
    // Calculate future values
    const futureValueA = calculateFutureValue(premiumA, interestRate, fundingPeriod, frequencyA);
    const futureValueB = calculateFutureValue(premiumB, interestRate, fundingPeriod, frequencyB);
    
    // Calculate inflation-adjusted values
    const inflationAdjustedValueA = applyInflationAdjustment(futureValueA, inflationRate, fundingPeriod);
    const inflationAdjustedValueB = applyInflationAdjustment(futureValueB, inflationRate, fundingPeriod);
    
    // Calculate retirement income at 4.5% and 5.1% withdrawal rates
    const incomeA45 = calculateRetirementIncome(inflationAdjustedValueA, 4.5);
    const incomeA51 = calculateRetirementIncome(inflationAdjustedValueA, 5.1);
    const incomeB45 = calculateRetirementIncome(inflationAdjustedValueB, 4.5);
    const incomeB51 = calculateRetirementIncome(inflationAdjustedValueB, 5.1);
    
    return {
      interestRate,
      futureValueA,
      inflationAdjustedValueA,
      futureValueB,
      inflationAdjustedValueB,
      incomeA45,
      incomeA51,
      incomeB45,
      incomeB51
    };
  });
  
  return results;
}

/**
 * Format a currency value for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a percentage for display
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
} 