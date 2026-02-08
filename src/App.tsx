import CreditSimulator from './components/CreditSimulator';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

export default function App() {
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
        <CreditSimulator />
        <Footer />
      </div>
    </div>
  );
}
