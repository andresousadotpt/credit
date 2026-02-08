import type { CreditType, AmortizationMode } from '../types';

interface ShareData {
  v: 1;
  t: 'credit' | 'effort';
  c: {
    a: number;  // loanAmount
    r: number;  // tan
    g: number;  // taeg
    m: number;  // months
    k: CreditType;
    d: AmortizationMode;
    e: { a: number; m: number }[];  // earlyRepayments
  };
  f: {
    i: number;  // monthlyIncome
    d: { n: string; a: number }[];  // debts
  };
}

export interface CreditShareInput {
  loanAmount: number;
  tan: number;
  taeg: number;
  months: number;
  creditType: CreditType;
  amortizationMode: AmortizationMode;
  earlyRepayments: { amount: number; month: number }[];
}

export interface EffortShareInput {
  monthlyIncome: number;
  debts: { name: string; amount: number }[];
}

export interface DecodedShareData {
  activeTab: 'credit' | 'effort';
  credit: CreditShareInput;
  effort: EffortShareInput;
}

function toUrlSafeBase64(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafeBase64(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return atob(b64);
}

export function encodeShareData(
  credit: CreditShareInput,
  effort: EffortShareInput,
  activeTab: 'credit' | 'effort',
): string {
  const data: ShareData = {
    v: 1,
    t: activeTab,
    c: {
      a: credit.loanAmount,
      r: credit.tan,
      g: credit.taeg,
      m: credit.months,
      k: credit.creditType,
      d: credit.amortizationMode,
      e: credit.earlyRepayments.map(r => ({ a: r.amount, m: r.month })),
    },
    f: {
      i: effort.monthlyIncome,
      d: effort.debts.map(d => ({ n: d.name, a: d.amount })),
    },
  };
  return toUrlSafeBase64(JSON.stringify(data));
}

export function decodeShareData(hash: string): DecodedShareData | null {
  try {
    const json = fromUrlSafeBase64(hash);
    const data: ShareData = JSON.parse(json);
    if (data.v !== 1) return null;

    return {
      activeTab: data.t,
      credit: {
        loanAmount: data.c.a,
        tan: data.c.r,
        taeg: data.c.g,
        months: data.c.m,
        creditType: data.c.k,
        amortizationMode: data.c.d,
        earlyRepayments: (data.c.e || []).map(r => ({ amount: r.a, month: r.m })),
      },
      effort: {
        monthlyIncome: data.f.i,
        debts: (data.f.d || []).map(d => ({ name: d.n, amount: d.a })),
      },
    };
  } catch {
    return null;
  }
}

export function getShareDataFromUrl(): DecodedShareData | null {
  const hash = window.location.hash.slice(1); // remove #
  if (!hash) return null;
  return decodeShareData(hash);
}
