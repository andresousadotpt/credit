import { useI18n } from '../../i18n';
import InfoTooltip from '../ui/InfoTooltip';
import type { EarlyRepayment, CreditType, AmortizationMode } from '../../types';

interface EarlyRepaymentsProps {
  earlyRepayments: EarlyRepayment[];
  addRepayment: () => void;
  removeRepayment: (id: number) => void;
  updateRepayment: (id: number, field: keyof Omit<EarlyRepayment, 'id'>, value: number) => void;
  getCommissionRate: (month: number) => number;
  isExempt: boolean;
  creditType: CreditType;
  months: number;
  loanAmount: number;
  amortizationMode: AmortizationMode;
  setAmortizationMode: (mode: AmortizationMode) => void;
}

export default function EarlyRepayments({
  earlyRepayments,
  addRepayment,
  removeRepayment,
  updateRepayment,
  getCommissionRate,
  isExempt,
  creditType,
  months,
  loanAmount,
  amortizationMode,
  setAmortizationMode,
}: EarlyRepaymentsProps) {
  const { t, formatCurrency } = useI18n();

  const totalEarlyAmount = earlyRepayments.reduce((s, r) => s + r.amount, 0);
  const totalCommissions = earlyRepayments.reduce((s, r) => s + r.amount * getCommissionRate(r.month), 0);

  return (
    <div style={{
      background: 'var(--early-repay-bg)',
      border: '1px solid var(--early-repay-border)',
      borderRadius: 12,
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <h4 style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-yellow)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          fontFamily: "'Space Mono', monospace",
        }}>
          ⚡ {t('earlyRepayments.title')}
          <InfoTooltip text={t('tooltips.earlyRepayments')} />
        </h4>
        <button
          onClick={addRepayment}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid rgba(250,204,21,0.3)',
            background: 'rgba(250,204,21,0.1)',
            color: 'var(--color-yellow)',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          + {t('earlyRepayments.add')}
        </button>
      </div>

      {/* Amortization Mode Toggle */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 16,
      }}>
        {([
          { key: 'reduce_term' as AmortizationMode, label: t('earlyRepayments.mode.reduceTerm'), desc: t('earlyRepayments.mode.reduceTermDesc'), icon: '⏱️' },
          { key: 'reduce_payment' as AmortizationMode, label: t('earlyRepayments.mode.reducePayment'), desc: t('earlyRepayments.mode.reducePaymentDesc'), icon: '💶' },
        ]).map(mode => (
          <button
            key={mode.key}
            onClick={() => setAmortizationMode(mode.key)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              textAlign: 'left', lineHeight: 1.4,
              border: amortizationMode === mode.key
                ? '1px solid rgba(250,204,21,0.4)'
                : '1px solid var(--border-card)',
              background: amortizationMode === mode.key
                ? 'rgba(250,204,21,0.08)'
                : 'var(--bg-card-alt)',
              color: amortizationMode === mode.key
                ? 'var(--color-yellow)'
                : 'var(--text-muted)',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{ marginBottom: 2 }}>{mode.icon} {mode.label}</div>
            <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.7 }}>{mode.desc}</div>
          </button>
        ))}
      </div>

      {earlyRepayments.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          color: 'var(--text-dim)',
          fontSize: 13,
          lineHeight: 1.6,
          border: '1px dashed var(--border-input)',
          borderRadius: 10,
        }}>
          {t('earlyRepayments.empty')}<br />
          <span style={{ fontSize: 12 }}>{t('earlyRepayments.emptyHint')}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {earlyRepayments.map((repay, idx) => {
          const rate = getCommissionRate(repay.month);
          const commVal = isExempt ? 0 : repay.amount * rate;
          const remaining = months - repay.month;
          return (
            <div
              key={repay.id}
              style={{
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-card)',
                borderRadius: 10,
                padding: '16px',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--color-yellow)',
                  fontFamily: "'Space Mono', monospace",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  ⚡ {t('earlyRepayments.label')} #{idx + 1}
                </span>
                <button
                  onClick={() => removeRepayment(repay.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid rgba(248,113,113,0.3)',
                    background: 'rgba(248,113,113,0.08)',
                    color: 'var(--color-red)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ✕ {t('earlyRepayments.remove')}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    💸 {t('earlyRepayments.value')}
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}>
                    <input
                      type="number"
                      value={repay.amount}
                      onChange={(e) => updateRepayment(repay.id, 'amount', Number(e.target.value))}
                      min={0}
                      max={loanAmount}
                      step={500}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        padding: '10px 12px',
                        fontSize: 14,
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 600,
                        width: '100%',
                        minWidth: 0,
                      }}
                    />
                    <span style={{
                      padding: '10px 12px',
                      fontSize: 12,
                      color: 'var(--text-dim)',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 600,
                      borderLeft: '1px solid var(--border-card)',
                      background: 'var(--bg-card)',
                    }}>€</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    📅 {t('earlyRepayments.month')}
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}>
                    <input
                      type="number"
                      value={repay.month}
                      onChange={(e) => updateRepayment(repay.id, 'month', Math.max(1, Math.min(months, Number(e.target.value))))}
                      min={1}
                      max={months}
                      step={1}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        padding: '10px 12px',
                        fontSize: 14,
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 600,
                        width: '100%',
                        minWidth: 0,
                      }}
                    />
                    <span style={{
                      padding: '10px 12px',
                      fontSize: 12,
                      color: 'var(--text-dim)',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 600,
                      borderLeft: '1px solid var(--border-card)',
                      background: 'var(--bg-card)',
                    }}>{t('earlyRepayments.month')}</span>
                  </div>
                </div>
              </div>
              {/* Commission info for this repayment */}
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isExempt ? (
                  <span>
                    {t('earlyRepayments.commission')}: <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>{t('earlyRepayments.exempt')}</span> ({t('earlyRepayments.exemptReason')})
                  </span>
                ) : (
                  <span>
                    {t('earlyRepayments.commission')}: <span style={{ color: 'var(--color-orange)', fontWeight: 600 }}>{formatCurrency(commVal)}</span> ({(rate * 100).toFixed(2)}% × {formatCurrency(repay.amount)})
                    {creditType === 'consumer' && <span> — {remaining > 12 ? t('earlyRepayments.remainingMore') : t('earlyRepayments.remainingLess')}</span>}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total commission summary */}
      {earlyRepayments.length > 0 && (
        <div style={{
          marginTop: 16,
          background: 'var(--bg-card-alt)',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <div>
            <strong style={{ color: 'var(--color-yellow)' }}>{t('earlyRepayments.totalLabel')}:</strong>{' '}
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(totalEarlyAmount)}
            </span>
            <span style={{ color: 'var(--text-dim)' }}> {t('earlyRepayments.paymentsCount', { count: earlyRepayments.length })}</span>
          </div>
          <div>
            {isExempt ? (
              <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>✓ {t('earlyRepayments.allExempt')}</span>
            ) : (
              <span>
                <strong style={{ color: 'var(--color-orange)' }}>{t('earlyRepayments.totalCommissions')}:</strong>{' '}
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: 'var(--color-orange)' }}>
                  {formatCurrency(totalCommissions)}
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
