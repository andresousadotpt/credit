import { useState, useCallback } from 'react';
import { useI18n } from './i18n';
import CreditSimulator from './components/CreditSimulator';
import EffortRateSimulator from './components/EffortRateSimulator';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { getShareDataFromUrl, encodeShareData } from './utils/sharing';
import type { CreditShareInput, EffortShareInput } from './utils/sharing';

type Tab = 'credit' | 'effort';

const sharedData = getShareDataFromUrl();

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(sharedData?.activeTab ?? 'credit');
  const [isShared, setIsShared] = useState(!!sharedData);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [clearFeedback, setClearFeedback] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useI18n();

  const handleShare = useCallback(() => {
    // Read current state from localStorage (always in sync with hooks)
    let credit: CreditShareInput;
    let effort: EffortShareInput;

    try {
      const rawCredit = localStorage.getItem('credit-sim-data');
      const parsedCredit = rawCredit ? JSON.parse(rawCredit) : {};
      credit = {
        loanAmount: parsedCredit.loanAmount ?? 42975,
        tan: parsedCredit.tan ?? 4.13,
        taeg: parsedCredit.taeg ?? 5.08,
        months: parsedCredit.months ?? 36,
        creditType: parsedCredit.creditType ?? 'consumer',
        amortizationMode: parsedCredit.amortizationMode ?? 'reduce_term',
        earlyRepayments: (parsedCredit.earlyRepayments ?? []).map((r: any) => ({
          amount: r.amount,
          month: r.month,
        })),
      };
    } catch {
      credit = {
        loanAmount: 42975, tan: 4.13, taeg: 5.08, months: 36,
        creditType: 'consumer', amortizationMode: 'reduce_term', earlyRepayments: [],
      };
    }

    try {
      const rawEffort = localStorage.getItem('credit-sim-effort');
      const parsedEffort = rawEffort ? JSON.parse(rawEffort) : {};
      effort = {
        monthlyIncome: parsedEffort.monthlyIncome ?? 1500,
        debts: (parsedEffort.debts ?? []).map((d: any) => ({
          name: d.name ?? '',
          amount: d.amount ?? 0,
        })),
      };
    } catch {
      effort = { monthlyIncome: 1500, debts: [] };
    }

    const encoded = encodeShareData(credit, effort, activeTab);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }, [activeTab]);

  const handleSaveShared = useCallback(() => {
    if (!sharedData) return;
    // Write shared data to localStorage so it persists
    const credit = sharedData.credit;
    localStorage.setItem('credit-sim-data', JSON.stringify({
      loanAmount: credit.loanAmount,
      tan: credit.tan,
      taeg: credit.taeg,
      months: credit.months,
      creditType: credit.creditType,
      amortizationMode: credit.amortizationMode,
      earlyRepayments: credit.earlyRepayments.map((r, i) => ({
        id: Date.now() + i, amount: r.amount, month: r.month,
      })),
    }));
    const effort = sharedData.effort;
    localStorage.setItem('credit-sim-effort', JSON.stringify({
      monthlyIncome: effort.monthlyIncome,
      debts: effort.debts.map((d, i) => ({
        id: Date.now() + i, name: d.name, amount: d.amount,
      })),
    }));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  }, []);

  const handleClear = useCallback(() => {
    // Write zeroed-out data so hooks pick up empty state on re-mount
    localStorage.setItem('credit-sim-data', JSON.stringify({
      loanAmount: 0, tan: 0, taeg: 0, months: 0,
      earlyRepayments: [], creditType: 'consumer', amortizationMode: 'reduce_term',
    }));
    localStorage.setItem('credit-sim-effort', JSON.stringify({
      monthlyIncome: 0, debts: [],
    }));
    // Clear share hash if present
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    setIsShared(false);
    setResetKey(k => k + 1);
    setClearFeedback(true);
    setTimeout(() => setClearFeedback(false), 2000);
  }, []);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: 'var(--bg-body-gradient)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      padding: '28px 20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--color-yellow); cursor: pointer;
          box-shadow: 0 0 10px rgba(250,204,21,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%; border: none;
          background: var(--color-yellow); cursor: pointer;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.3; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Header onShare={handleShare} copyFeedback={copyFeedback} onClear={handleClear} clearFeedback={clearFeedback} />

        {/* Shared simulation banner */}
        {isShared && (
          <div style={{
            marginBottom: 12,
            background: 'var(--warning-blue-bg)',
            border: '1px solid var(--warning-blue-border)',
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔗</span>
              <span style={{ fontSize: 13, color: 'var(--color-blue)', fontWeight: 600 }}>
                {t('share.banner')}
              </span>
            </div>
            <button
              onClick={handleSaveShared}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid rgba(96,165,250,0.3)',
                background: savedFeedback ? 'rgba(74,222,128,0.15)' : 'rgba(96,165,250,0.1)',
                color: savedFeedback ? 'var(--color-green)' : 'var(--color-blue)',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {savedFeedback ? `✓ ${t('share.saved')}` : t('share.save')}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 20,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 12, padding: 4,
        }}>
          {([
            { key: 'credit' as Tab, label: t('tabs.creditSimulator'), icon: '💰' },
            { key: 'effort' as Tab, label: t('tabs.effortRate'), icon: '📊' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: activeTab === tab.key ? '1px solid var(--selected-border)' : '1px solid transparent',
                background: activeTab === tab.key ? 'var(--selected-bg)' : 'transparent',
                color: activeTab === tab.key ? 'var(--color-blue)' : 'var(--text-muted)',
                transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'credit'
          ? <CreditSimulator key={resetKey} sharedData={resetKey === 0 ? sharedData?.credit : undefined} />
          : <EffortRateSimulator key={resetKey} sharedData={resetKey === 0 ? sharedData?.effort : undefined} />
        }
        <Footer />
      </div>
    </div>
  );
}
