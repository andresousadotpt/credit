import { useState, useEffect } from 'react';
import type { Debt, RiskLevel } from '../types';

const STORAGE_KEY = 'credit-sim-effort';

interface PersistedEffortData {
  monthlyIncome: number;
  debts: Debt[];
}

const defaults: PersistedEffortData = {
  monthlyIncome: 1500,
  debts: [],
};

function loadSaved(): PersistedEffortData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch { /* ignore */ }
  return defaults;
}

export function useEffortRate() {
  const saved = loadSaved();
  const [monthlyIncome, setMonthlyIncome] = useState(saved.monthlyIncome);
  const [debts, setDebts] = useState<Debt[]>(saved.debts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ monthlyIncome, debts }));
  }, [monthlyIncome, debts]);

  const addDebt = () => {
    setDebts(prev => [...prev, { id: Date.now(), name: '', amount: 300 }]);
  };

  const removeDebt = (id: number) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const updateDebt = (id: number, field: keyof Omit<Debt, 'id'>, value: string | number) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
  const effortRate = monthlyIncome > 0 ? (totalDebts / monthlyIncome) * 100 : 0;
  const availableIncome = monthlyIncome - totalDebts;

  const riskLevel: RiskLevel =
    effortRate <= 30 ? 'low' :
    effortRate <= 50 ? 'moderate' :
    'high';

  return {
    monthlyIncome, setMonthlyIncome,
    debts, addDebt, removeDebt, updateDebt,
    totalDebts, effortRate, availableIncome, riskLevel,
  };
}
