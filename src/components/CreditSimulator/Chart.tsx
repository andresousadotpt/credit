import { useState } from 'react';
import { useI18n } from '../../i18n';
import type { AmortizationRow } from '../../types';

interface ChartProps {
  data: AmortizationRow[];
  monthlyPayment: number;
  earlyRepaymentsCount: number;
}

export default function Chart({ data, monthlyPayment, earlyRepaymentsCount }: ChartProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { t, formatCurrency } = useI18n();

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: 14,
      padding: '24px 20px',
    }}>
      <h3 style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        margin: '0 0 20px',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: "'Space Mono', monospace",
      }}>
        {t('chart.title')}
      </h3>
      <div style={{
        display: 'flex',
        gap: Math.max(1, Math.floor(4 - data.length / 20)),
        alignItems: 'end',
        height: 140,
        overflowX: data.length > 60 ? 'auto' : 'visible',
        paddingBottom: 4,
      }}>
        {data.map((row, i) => {
          const totalH = 120;
          const interestH = (row.interest / monthlyPayment) * totalH;
          const principalH = (row.principal / monthlyPayment) * totalH;
          const isHovered = hoveredRow === i;
          const barWidth = data.length > 60 ? 10 : undefined;
          return (
            <div
              key={i}
              style={{
                flex: barWidth ? `0 0 ${barWidth}px` : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: totalH + 14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--bg-chart-tooltip)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                  fontSize: 11,
                  zIndex: 10,
                  boxShadow: 'var(--shadow-chart)',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {t('chart.month')} {row.month}
                  </div>
                  <div style={{ color: 'var(--color-red)' }}>
                    {t('chart.interest')}: {formatCurrency(row.interest)}
                  </div>
                  <div style={{ color: 'var(--color-green)' }}>
                    {t('chart.capital')}: {formatCurrency(row.principal)}
                  </div>
                  <div style={{ color: 'var(--color-blue)', fontSize: 10, marginTop: 2 }}>
                    {t('chart.debt')}: {formatCurrency(row.balance)}
                  </div>
                  {row.earlyRepay > 0 && (
                    <>
                      <div style={{ color: 'var(--color-yellow)', fontWeight: 700, marginTop: 2 }}>
                        ⚡ {t('earlyRepayments.label')}: {formatCurrency(row.earlyRepay)}
                      </div>
                      {row.commission > 0 && (
                        <div style={{ color: 'var(--color-orange)', fontSize: 10 }}>
                          {t('earlyRepayments.commission')}: {formatCurrency(row.commission)}
                        </div>
                      )}
                      {row.commission === 0 && (
                        <div style={{ color: 'var(--color-green)', fontSize: 10 }}>
                          ✓ {t('earlyRepayments.exempt')}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                position: 'relative',
              }}>
                {row.earlyRepay > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 10,
                    lineHeight: 1,
                  }}>⚡</div>
                )}
                <div style={{
                  height: interestH,
                  borderRadius: '3px 3px 0 0',
                  background: isHovered ? 'var(--color-red)' : 'var(--color-red-muted)',
                  transition: 'all 0.2s',
                }} />
                <div style={{
                  height: principalH,
                  borderRadius: '0 0 3px 3px',
                  background: isHovered ? 'var(--color-green)' : 'var(--color-green-muted)',
                  transition: 'all 0.2s',
                }} />
              </div>
              {(data.length <= 48 || row.month % Math.ceil(data.length / 24) === 0 || row.month === 1) && (
                <div style={{
                  fontSize: 8,
                  color: 'var(--text-dim)',
                  marginTop: 4,
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {row.month}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{
        display: 'flex',
        gap: 20,
        marginTop: 16,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: 'var(--color-red)',
          }} />
          {t('chart.interest')}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: 'var(--color-green)',
          }} />
          {t('chart.capital')}
        </div>
        {earlyRepaymentsCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'var(--text-secondary)',
          }}>
            ⚡ {t('chart.earlyRepaymentsLabel', { count: earlyRepaymentsCount })}
          </div>
        )}
      </div>
    </div>
  );
}
