import { useI18n } from '../../i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(255,255,255,0.04)',
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      <div style={{
        fontSize: 10,
        color: 'var(--text-faint)',
        lineHeight: 1.7,
        fontFamily: "'Space Mono', monospace",
      }}>
        <strong style={{ color: 'var(--text-dim)' }}>📋 {t('footer.legal')}</strong>
      </div>
    </div>
  );
}
