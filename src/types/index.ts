export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  earlyRepay: number;
  commission: number;
  balance: number;
  interestPct: number;
  principalPct: number;
}

export interface EarlyRepayment {
  id: number;
  amount: number;
  month: number;
}

export type CreditType = 'housing_variable' | 'housing_fixed' | 'consumer';
export type Language = 'pt' | 'en';
export type Theme = 'dark' | 'light';
