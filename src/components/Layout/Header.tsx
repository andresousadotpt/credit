import { useI18n } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONFIG } from '../../config';

interface HeaderProps {
  onShare: () => void;
  copyFeedback: boolean;
  onClear: () => void;
  clearFeedback: boolean;
}

export default function Header({ onShare, copyFeedback, onClear, clearFeedback }: HeaderProps) {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        {/* Left side: Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--logo-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            fontFamily: "'Space Mono', monospace",
            boxShadow: '0 4px 16px rgba(0,102,0,0.3)',
          }}>€</div>
          <div>
            <h1 style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              background: 'var(--title-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{t('header.title')}</h1>
            <p style={{
              color: 'var(--text-dim)',
              fontSize: 12,
              margin: 0,
            }}>{t('header.subtitle')}</p>
          </div>
        </div>

        {/* Right side: Settings controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          {/* Language toggle */}
          <div style={{
            display: 'flex',
            gap: 4,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 8,
            padding: 2,
          }}>
            <button
              onClick={() => setLanguage('pt')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
                cursor: 'pointer',
                border: language === 'pt' ? '1px solid var(--selected-border)' : 'none',
                background: language === 'pt' ? 'var(--selected-bg)' : 'transparent',
                color: language === 'pt' ? 'var(--color-blue)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
                cursor: 'pointer',
                border: language === 'en' ? '1px solid var(--selected-border)' : 'none',
                background: language === 'en' ? 'var(--selected-bg)' : 'transparent',
                color: language === 'en' ? 'var(--color-blue)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              EN
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s',
              fontFamily: "'Space Mono', monospace",
            }}
            title={theme === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Share button */}
          <button
            onClick={onShare}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              border: copyFeedback ? '1px solid rgba(74,222,128,0.4)' : '1px solid var(--border-card)',
              background: copyFeedback ? 'rgba(74,222,128,0.15)' : 'var(--bg-card)',
              color: copyFeedback ? 'var(--color-green)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title={t('share.button')}
          >
            {copyFeedback ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t('share.copied')}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {t('share.button')}
              </>
            )}
          </button>

          {/* Clear button */}
          <button
            onClick={onClear}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              border: clearFeedback ? '1px solid rgba(74,222,128,0.4)' : '1px solid var(--border-card)',
              background: clearFeedback ? 'rgba(74,222,128,0.15)' : 'var(--bg-card)',
              color: clearFeedback ? 'var(--color-green)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title={t('clear.button')}
          >
            {clearFeedback ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t('clear.done')}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {t('clear.button')}
              </>
            )}
          </button>

          {/* GitHub link */}
          <a
            href={APP_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title={t('settings.viewOnGithub')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
