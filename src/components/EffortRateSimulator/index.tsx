import { useI18n } from '../../i18n';
import { useEffortRate } from '../../hooks/useEffortRate';
import InputField from '../ui/InputField';
import InfoTooltip from '../ui/InfoTooltip';

export default function EffortRateSimulator() {
  const { t, formatCurrency } = useI18n();
  const {
    monthlyIncome, setMonthlyIncome,
    debts, addDebt, removeDebt, updateDebt,
    totalDebts, effortRate, availableIncome, riskLevel,
  } = useEffortRate();

  const riskColor =
    riskLevel === 'low' ? 'var(--color-green)' :
    riskLevel === 'moderate' ? 'var(--color-yellow)' :
    'var(--color-red)';

  const riskBg =
    riskLevel === 'low' ? 'var(--color-green-bg)' :
    riskLevel === 'moderate' ? 'var(--color-yellow-bg)' :
    'var(--color-red-bg)';

  const riskLabel =
    riskLevel === 'low' ? t('effortRate.result.riskLow') :
    riskLevel === 'moderate' ? t('effortRate.result.riskModerate') :
    t('effortRate.result.riskHigh');

  const riskDesc =
    riskLevel === 'low' ? t('effortRate.result.riskLowDesc') :
    riskLevel === 'moderate' ? t('effortRate.result.riskModerateDesc') :
    t('effortRate.result.riskHighDesc');

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Info box */}
      <div style={{
        marginBottom: 20,
        background: 'var(--warning-blue-bg)',
        border: '1px solid var(--warning-blue-border)',
        borderRadius: 12,
        padding: '14px 20px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>📊</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-blue)', marginBottom: 4 }}>
            {t('effortRate.warning.title')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {t('effortRate.warning.description')}
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
      }}>
        <h3 style={{
          fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
          margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1.5,
          fontFamily: "'Space Mono', monospace",
        }}>
          💰 {t('effortRate.income.title')}
        </h3>

        <div style={{ marginBottom: 20 }}>
          <InputField
            label={t('effortRate.income.netIncome')}
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            suffix="€"
            min={0}
            max={50000}
            step={50}
            icon="💰"
          />
        </div>

        {/* Debts Panel */}
        <div style={{
          background: 'var(--early-repay-bg)',
          border: '1px solid var(--early-repay-border)',
          borderRadius: 12,
          padding: 20,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 16,
          }}>
            <h4 style={{
              fontSize: 11, fontWeight: 600, color: 'var(--color-yellow)',
              margin: 0, textTransform: 'uppercase', letterSpacing: 1.5,
              fontFamily: "'Space Mono', monospace",
            }}>
              📋 {t('effortRate.debts.title')}
            </h4>
            <button onClick={addDebt} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', border: '1px solid rgba(250,204,21,0.3)',
              background: 'rgba(250,204,21,0.1)', color: 'var(--color-yellow)',
              transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              + {t('effortRate.debts.add')}
            </button>
          </div>

          {debts.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '24px 16px',
              color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6,
              border: '1px dashed var(--border-input)', borderRadius: 10,
            }}>
              {t('effortRate.debts.empty')}<br />
              <span style={{ fontSize: 12 }}>{t('effortRate.debts.emptyHint')}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {debts.map((debt, idx) => (
              <div key={debt.id} style={{
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-card)',
                borderRadius: 10, padding: 16,
                animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--color-yellow)',
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    📋 {t('effortRate.debts.label')} #{idx + 1}
                  </span>
                  <button onClick={() => removeDebt(debt.id)} style={{
                    padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: '1px solid rgba(248,113,113,0.3)',
                    background: 'rgba(248,113,113,0.08)', color: 'var(--color-red)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    ✕ {t('effortRate.debts.remove')}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{
                      fontSize: 9, fontWeight: 600, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: 1,
                      fontFamily: "'Space Mono', monospace",
                    }}>
                      📝 {t('effortRate.debts.name')}
                    </label>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      placeholder={t('effortRate.debts.namePlaceholder')}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-input)',
                        borderRadius: 8, padding: '10px 12px',
                        fontSize: 13, color: 'var(--text-primary)',
                        fontFamily: "'DM Sans', sans-serif",
                        outline: 'none', width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{
                      fontSize: 9, fontWeight: 600, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: 1,
                      fontFamily: "'Space Mono', monospace",
                    }}>
                      💸 {t('effortRate.debts.amount')}
                    </label>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-input)',
                      borderRadius: 8, overflow: 'hidden',
                    }}>
                      <input
                        type="number"
                        value={debt.amount}
                        onChange={(e) => updateDebt(debt.id, 'amount', Number(e.target.value))}
                        min={0} max={50000} step={10}
                        style={{
                          flex: 1, background: 'transparent',
                          border: 'none', outline: 'none',
                          color: 'var(--text-primary)', padding: '10px 12px',
                          fontSize: 14, fontFamily: "'Space Mono', monospace",
                          fontWeight: 600, width: '100%', minWidth: 0,
                        }}
                      />
                      <span style={{
                        padding: '10px 12px', fontSize: 12, color: 'var(--text-dim)',
                        fontFamily: "'Space Mono', monospace", fontWeight: 600,
                        borderLeft: '1px solid var(--border-card)',
                        background: 'var(--bg-card)',
                      }}>€</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
      }}>
        <h3 style={{
          fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
          margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: 1.5,
          fontFamily: "'Space Mono', monospace",
        }}>
          📊 {t('effortRate.result.title')}
        </h3>

        {/* Big percentage */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontSize: 56, fontWeight: 700, color: riskColor,
            fontFamily: "'Space Mono', monospace", lineHeight: 1,
          }}>
            {effortRate.toFixed(1)}%
          </div>
          <div style={{
            fontSize: 13, color: 'var(--text-secondary)', marginTop: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            {t('effortRate.result.effortRate')}
            <InfoTooltip text={t('effortRate.tooltips.effortRate')} />
          </div>
        </div>

        {/* Gauge bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            width: '100%', height: 12, borderRadius: 6,
            background: 'var(--bg-input)', overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Threshold markers */}
            <div style={{
              position: 'absolute', left: '30%', top: 0, bottom: 0,
              width: 2, background: 'var(--border-strong)', zIndex: 1,
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: 2, background: 'var(--border-strong)', zIndex: 1,
            }} />
            {/* Fill */}
            <div style={{
              width: `${Math.min(effortRate, 100)}%`,
              height: '100%', borderRadius: 6,
              background: riskColor,
              transition: 'width 0.4s ease, background 0.4s ease',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9, color: 'var(--text-muted)',
            fontFamily: "'Space Mono', monospace",
            marginTop: 4,
          }}>
            <span>0%</span>
            <span>30%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Risk level */}
        <div style={{
          background: riskBg,
          border: `1px solid ${riskColor}33`,
          borderRadius: 12, padding: '14px 20px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: riskColor, marginBottom: 4 }}>
            {riskLevel === 'low' ? '✓' : riskLevel === 'moderate' ? '⚠️' : '✕'} {riskLabel}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {riskDesc}
          </div>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)', marginTop: 8,
            fontFamily: "'Space Mono', monospace",
          }}>
            {t('effortRate.result.threshold')}
          </div>
        </div>

        {/* Summary cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
        }}>
          <div style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-card)',
            borderRadius: 14, padding: '16px 18px',
          }}>
            <div style={{
              fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 6, fontWeight: 600,
              fontFamily: "'Space Mono', monospace",
              display: 'flex', alignItems: 'center',
            }}>
              {t('effortRate.result.totalDebts')}
              <InfoTooltip text={t('effortRate.tooltips.totalDebts')} />
            </div>
            <div style={{
              fontSize: 19, fontWeight: 700, color: 'var(--color-red)',
              fontFamily: "'Space Mono', monospace",
            }}>
              {formatCurrency(totalDebts)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
              {debts.length} {t('effortRate.debts.label').toLowerCase()}(s)
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-card)',
            borderRadius: 14, padding: '16px 18px',
          }}>
            <div style={{
              fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 6, fontWeight: 600,
              fontFamily: "'Space Mono', monospace",
              display: 'flex', alignItems: 'center',
            }}>
              {t('effortRate.result.availableIncome')}
              <InfoTooltip text={t('effortRate.tooltips.availableIncome')} />
            </div>
            <div style={{
              fontSize: 19, fontWeight: 700,
              color: availableIncome >= 0 ? 'var(--color-green)' : 'var(--color-red)',
              fontFamily: "'Space Mono', monospace",
            }}>
              {formatCurrency(availableIncome)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
              {availableIncome >= 0
                ? `${((availableIncome / monthlyIncome) * 100).toFixed(1)}%`
                : '0%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
