import { useState, useEffect } from 'react';
import type { Debt, RiskLevel } from '../types';
import type { EffortShareInput } from '../utils/sharing';

const STORAGE_KEY = 'credit-sim-effort';

interface PersistedEffortData {
  monthlyIncome: number;
  debts: Debt[];
}

const defaults: PersistedEffortData = {
  monthlyIncome: 1500,
  debts: [],
};


function loadSaved(sharedData?: EffortShareInput): PersistedEffortData {
  if (sharedData) {
    return {
      monthlyIncome: sharedData.monthlyIncome,
      debts: sharedData.debts.map((d, i) => ({
        id: Date.now() + i,
        name: d.name,
        amount: d.amount,
      })),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch { /* ignore */ }
  return defaults;
}

export function useEffortRate(sharedData?: EffortShareInput) {
  const saved = loadSaved(sharedData);
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

  const clear = () => {
    setMonthlyIncome(0);
    setDebts([]);
  };

  const getShareData = (): EffortShareInput => ({
    monthlyIncome,
    debts: debts.map(d => ({ name: d.name, amount: d.amount })),
  });

  return {
    monthlyIncome, setMonthlyIncome,
    debts, addDebt, removeDebt, updateDebt,
    totalDebts, effortRate, availableIncome, riskLevel,
    getShareData, clear,
  };
}
