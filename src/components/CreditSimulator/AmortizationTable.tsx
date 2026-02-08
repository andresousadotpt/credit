import { useState } from 'react';
import { useI18n } from '../../i18n';
import InfoTooltip from '../ui/InfoTooltip';
import type { AmortizationRow } from '../../types';

interface AmortizationTableProps {
  data: AmortizationRow[];
}

export default function AmortizationTable({ data }: AmortizationTableProps) {
  const [showAllRows, setShowAllRows] = useState(false);
  const { t, formatCurrency } = useI18n();

  const visibleData = showAllRows ? data : data.slice(0, 24);
  const hasMore = data.length > 24 && !showAllRows;

  const headers = [
    { label: t('table.month'), tip: null },
    { label: t('table.payment'), tip: t('tooltips.payment') },
    { label: t('table.interest'), tip: t('tooltips.interest') },
    { label: t('table.capital'), tip: t('tooltips.capital') },
    { label: t('table.earlyRepay'), tip: t('tooltips.earlyRepay') },
    { label: t('table.interestPct'), tip: t('tooltips.interestPct') },
    { label: t('table.capitalPct'), tip: t('tooltips.capitalPct') },
    { label: t('table.debt'), tip: t('tooltips.debt') },
  ];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-input)' }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '12px 10px',
                    textAlign: i === 0 ? 'center' : 'right',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontFamily: "'Space Mono', monospace",
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {h.label}
                    {h.tip && <InfoTooltip text={h.tip} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, i) => {
              const isYear = row.month % 12 === 0;
              const isAmort = row.earlyRepay > 0;
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: isYear ? '2px solid var(--border-strong)' : '1px solid rgba(255,255,255,0.03)',
                    background: isAmort ? 'var(--early-repay-row-bg)' : isYear ? 'var(--bg-card-alt)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isAmort ? 'var(--early-repay-row-hover)' : 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isAmort ? 'var(--early-repay-row-bg)' : isYear ? 'var(--bg-card-alt)' : 'transparent';
                  }}
                >
                  <td style={{
                    padding: '10px 10px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--text-secondary)',
                  }}>
                    {row.month}
                  </td>
                  <td style={{
                    padding: '10px 10px',
                    textAlign: 'right',
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    {formatCurrency(row.payment)}
                  </td>
                  <td style={{
                    padding: '10px 10px',
                    textAlign: 'right',
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--color-red)',
                  }}>
                    {formatCurrency(row.interest)}
                  </td>
                  <td style={{
                    padding: '10px 10px',
                    textAlign: 'right',
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--color-green)',
                  }}>
                    {formatCurrency(row.principal)}
                  </td>
                  <td style={{
                    padding: '10px 10px',
                    textAlign: 'right',
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    {row.earlyRepay > 0 ? (
                      <span style={{
                        background: 'rgba(250,204,21,0.15)',
                        color: 'var(--color-yellow)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>
                        ⚡ {formatCurrency(row.earlyRepay)}
                        {row.commission > 0 ? ` (+${formatCurrency(row.commission)})` : ''}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-faint)' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                    <span style={{
                      background: 'var(--color-red-bg)',
                      color: 'var(--color-red)',
                      padding: '2px 7px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 600,
                    }}>
                      {row.interestPct}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                    <span style={{
                      background: 'var(--color-green-bg)',
                      color: 'var(--color-green)',
                      padding: '2px 7px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 600,
                    }}>
                      {row.principalPct}%
                    </span>
                  </td>
                  <td style={{
                    padding: '10px 10px',
                    textAlign: 'right',
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--color-blue)',
                    fontWeight: 500,
                  }}>
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <button
            onClick={() => setShowAllRows(true)}
            style={{
              background: 'var(--bg-button)',
              border: '1px solid var(--border-strong)',
              borderRadius: 10,
              padding: '10px 28px',
              color: 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t('table.showAll', { count: data.length })} ↓
          </button>
        </div>
      )}
      {showAllRows && data.length > 24 && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <button
            onClick={() => setShowAllRows(false)}
            style={{
              background: 'var(--bg-button)',
              border: '1px solid var(--border-strong)',
              borderRadius: 10,
              padding: '10px 28px',
              color: 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t('table.showLess')} ↑
          </button>
        </div>
      )}
    </div>
  );
}
