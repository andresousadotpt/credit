import { useState, useMemo } from 'react';
import type { AmortizationRow, EarlyRepayment, CreditType } from '../types';

export function useCreditSimulator() {
  const [loanAmount, setLoanAmount] = useState(42975);
  const [tan, setTan] = useState(4.13);
  const [taeg, setTaeg] = useState(5.08);
  const [monthlyPayment, setMonthlyPayment] = useState(593);
  const [months, setMonths] = useState(36);
  const [earlyRepayments, setEarlyRepayments] = useState<EarlyRepayment[]>([]);
  const [creditType, setCreditType] = useState<CreditType>('consumer');

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
    const rows: AmortizationRow[] = [];

    for (let i = 1; i <= months; i++) {
      if (balance <= 0) break;
      const interest = balance * monthlyRate;
      const effectivePayment = Math.min(monthlyPayment, balance + interest);
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
        balance = Math.max(balance - earlyRepay, 0);
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
  }, [loanAmount, tan, monthlyPayment, months, earlyRepayments, creditType, isExempt]);

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
    addRepayment, removeRepayment, updateRepayment,
    getCommissionRate,
    isExempt,
    data,
    totalInterest, totalPrincipal, totalEarlyRepay, totalCommission, totalPaid,
    finalBalance, actualMonths,
  };
}
