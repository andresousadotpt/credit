import { useState } from 'react';
import { useI18n } from './i18n';
import CreditSimulator from './components/CreditSimulator';
import EffortRateSimulator from './components/EffortRateSimulator';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

type Tab = 'credit' | 'effort';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('credit');
  const { t } = useI18n();

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
        <Header />

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

        {activeTab === 'credit' ? <CreditSimulator /> : <EffortRateSimulator />}
        <Footer />
      </div>
    </div>
  );
}
