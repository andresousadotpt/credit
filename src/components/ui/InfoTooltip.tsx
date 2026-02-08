import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../i18n';

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);
  const { t } = useI18n();

  const handleEnter = useCallback(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPos({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
    setShow(true);
  }, []);

  return (
    <span
      ref={iconRef}
      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        fontWeight: 700,
        background: 'var(--border-input)',
        color: 'var(--text-muted)',
        width: 18,
        height: 18,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        transition: 'all 0.2s',
        border: '1px solid var(--border-card)',
        ...(show ? { background: 'rgba(255,255,255,0.14)', color: 'var(--text-secondary)' } : {}),
      }}>ⓘ</span>
      {show && createPortal(
        <div style={{
          position: 'fixed',
          top: pos.top - 10,
          left: pos.left,
          transform: 'translate(-50%, -100%)',
          background: 'var(--bg-tooltip)',
          border: '1px solid var(--border-tooltip)',
          borderRadius: 10,
          padding: '12px 16px',
          fontSize: 11,
          color: 'var(--text-highlight)',
          lineHeight: 1.6,
          width: 300,
          maxWidth: 'calc(100vw - 32px)',
          zIndex: 9999,
          boxShadow: 'var(--shadow-tooltip)',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          whiteSpace: 'normal',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--color-yellow)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: "'Space Mono', monospace",
          }}>{t('tooltip.howCalculated')}</div>
          {text}
          <div style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 10,
            height: 10,
            background: 'var(--bg-tooltip)',
            borderRight: '1px solid var(--border-tooltip)',
            borderBottom: '1px solid var(--border-tooltip)',
          }} />
        </div>,
        document.body
      )}
    </span>
  );
}
