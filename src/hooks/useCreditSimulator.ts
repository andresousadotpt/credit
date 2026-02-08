import { useState, useMemo, useEffect } from 'react';
import type { AmortizationRow, EarlyRepayment, CreditType, AmortizationMode } from '../types';

const STORAGE_KEY = 'credit-sim-data';

interface PersistedCreditData {
  loanAmount: number;
  tan: number;
  taeg: number;
  monthlyPayment: number;
  months: number;
  earlyRepayments: EarlyRepayment[];
  creditType: CreditType;
  amortizationMode: AmortizationMode;
}

const defaults: PersistedCreditData = {
  loanAmount: 42975,
  tan: 4.13,
  taeg: 5.08,
  monthlyPayment: 593,
  months: 36,
  earlyRepayments: [],
  creditType: 'consumer',
  amortizationMode: 'reduce_term',
};

function loadSaved(): PersistedCreditData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch { /* ignore */ }
  return defaults;
}

export function useCreditSimulator() {
  const saved = loadSaved();
  const [loanAmount, setLoanAmount] = useState(saved.loanAmount);
  const [tan, setTan] = useState(saved.tan);
  const [taeg, setTaeg] = useState(saved.taeg);
  const [monthlyPayment, setMonthlyPayment] = useState(saved.monthlyPayment);
  const [months, setMonths] = useState(saved.months);
  const [earlyRepayments, setEarlyRepayments] = useState<EarlyRepayment[]>(saved.earlyRepayments);
  const [creditType, setCreditType] = useState<CreditType>(saved.creditType);
  const [amortizationMode, setAmortizationMode] = useState<AmortizationMode>(saved.amortizationMode);

  useEffect(() => {
    const data: PersistedCreditData = {
      loanAmount, tan, taeg, monthlyPayment, months, earlyRepayments, creditType, amortizationMode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [loanAmount, tan, taeg, monthlyPayment, months, earlyRepayments, creditType, amortizationMode]);

  const addRepayment = () => {
    setEarlyRepayments(prev => [...prev, { id: Date.now(), amount: 5000, month: 12 }]);
  };
  const removeRepayment = (id: number) => {
    setEarlyRepayments(prev => prev.filter(r => r.id !== id));
  };
  const updateRepayment = (id: number, field: keyof Omit<EarlyRepayment, 'id'>, value: number) => {
    setEarlyRepayments(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const getCommissionRate = (repayMonth: number): number => {
    if (creditType === 'housing_variable') return 0.005;
    if (creditType === 'housing_fixed') return 0.02;
    const remaining = months - repayMonth;
    return remaining > 12 ? 0.005 : 0.0025;
  };

  const isExempt = creditType === 'housing_variable';

  const data = useMemo((): AmortizationRow[] => {
    const repMap: Record<number, number> = {};
    earlyRepayments.forEach(r => {
      if (r.amount > 0 && r.month >= 1 && r.month <= months) {
        repMap[r.month] = (repMap[r.month] || 0) + r.amount;
      }
    });

    const monthlyRate = tan / 100 / 12;
    let balance = loanAmount;
    let currentPayment = monthlyPayment;
    const rows: AmortizationRow[] = [];

    for (let i = 1; i <= months; i++) {
      if (balance <= 0) break;
      const interest = balance * monthlyRate;
      const effectivePayment = Math.min(currentPayment, balance + interest);
      const principal = effectivePayment - interest;
      balance = Math.max(balance - principal, 0);

      let earlyRepay = 0;
      let commission = 0;
      if (repMap[i]) {
        earlyRepay = Math.min(repMap[i], balance);
        let rate = 0;
        if (creditType === 'housing_variable') rate = 0.005;
        else if (creditType === 'housing_fixed') rate = 0.02;
        else rate = (months - i) > 12 ? 0.005 : 0.0025;
        commission = isExempt ? 0 : earlyRepay * rate;
        const balanceBeforeEarlyRepay = balance;
        balance = Math.max(balance - earlyRepay, 0);

        if (amortizationMode === 'reduce_payment' && balance > 0 && balanceBeforeEarlyRepay > 0) {
          // Reduce payment proportionally to the balance reduction
          // In the French system P is linear in B, so P_new/P_old = B_new/B_old
          currentPayment = currentPayment * (balance / balanceBeforeEarlyRepay);
        }
        // reduce_term: keep same payment, loop ends sooner when balance hits 0
      }

      rows.push({
        month: i,
        payment: Math.round(effectivePayment * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        earlyRepay,
        commission: Math.round(commission * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        interestPct: effectivePayment > 0 ? Math.round((interest / effectivePayment) * 1000) / 10 : 0,
        principalPct: effectivePayment > 0 ? Math.round((principal / effectivePayment) * 1000) / 10 : 0,
      });
      if (balance <= 0) break;
    }
    return rows;
  }, [loanAmount, tan, monthlyPayment, months, earlyRepayments, creditType, isExempt, amortizationMode]);

  const totalInterest = data.reduce((s, r) => s + r.interest, 0);
  const totalPrincipal = data.reduce((s, r) => s + r.principal, 0);
  const totalEarlyRepay = data.reduce((s, r) => s + r.earlyRepay, 0);
  const totalCommission = data.reduce((s, r) => s + r.commission, 0);
  const totalPaid = data.reduce((s, r) => s + r.payment, 0) + totalEarlyRepay + totalCommission;
  const finalBalance = data.length > 0 ? data[data.length - 1].balance : loanAmount;
  const actualMonths = data.length;

  return {
    loanAmount, setLoanAmount,
    tan, setTan,
    taeg, setTaeg,
    monthlyPayment, setMonthlyPayment,
    months, setMonths,
    earlyRepayments,
    creditType, setCreditType,
    amortizationMode, setAmortizationMode,
    addRepayment, removeRepayment, updateRepayment,
    getCommissionRate,
    isExempt,
    data,
    totalInterest, totalPrincipal, totalEarlyRepay, totalCommission, totalPaid,
    finalBalance, actualMonths,
  };
}
