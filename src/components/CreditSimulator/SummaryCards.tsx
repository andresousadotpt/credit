import { useI18n } from '../../i18n';
import InfoTooltip from '../ui/InfoTooltip';

interface SummaryCardsProps {
  totalInterest: number;
  totalPrincipal: number;
  totalEarlyRepay: number;
  totalCommission: number;
  totalPaid: number;
  finalBalance: number;
  actualMonths: number;
  loanAmount: number;
  earlyRepaymentsCount: number;
}

export default function SummaryCards({
  totalInterest,
  totalPrincipal,
  totalEarlyRepay,
  totalCommission,
  totalPaid,
  finalBalance,
  actualMonths,
  loanAmount,
  earlyRepaymentsCount,
}: SummaryCardsProps) {
  const { t, formatCurrency } = useI18n();

  const cards = [
    {
      label: t('summary.totalInterest'),
      value: formatCurrency(totalInterest),
      color: 'var(--color-red)',
      sub: t('summary.ofTotalPaid', { percent: totalPaid > 0 ? (totalInterest / totalPaid * 100).toFixed(1) : '0' }),
      tooltip: t('tooltips.totalInterest'),
    },
    {
      label: t('summary.capitalAmortized'),
      value: formatCurrency(totalPrincipal + totalEarlyRepay),
      color: 'var(--color-green)',
      sub: t('summary.ofAmount', { percent: ((totalPrincipal + totalEarlyRepay) / loanAmount * 100).toFixed(1) }),
      tooltip: t('tooltips.capitalAmortized'),
    },
    {
      label: t('summary.remainingDebt'),
      value: formatCurrency(finalBalance),
      color: 'var(--color-blue)',
      sub: t('summary.afterMonths', { months: actualMonths }),
      tooltip: t('tooltips.remainingDebt'),
    },
    {
      label: t('summary.totalPaid'),
      value: formatCurrency(totalPaid),
      color: 'var(--color-purple)',
      sub: totalCommission > 0
        ? t('summary.inclCommission', { amount: formatCurrency(totalCommission) })
        : totalEarlyRepay > 0
        ? t('summary.inclAmort', { amount: formatCurrency(totalEarlyRepay) })
        : t('summary.payments', { count: actualMonths }),
      tooltip: t('tooltips.totalPaid'),
    },
  ];

  if (totalCommission > 0) {
    cards.push({
      label: t('summary.amortCommission'),
      value: formatCurrency(totalCommission),
      color: 'var(--color-orange)',
      sub: t('summary.amortCount', { count: earlyRepaymentsCount }),
      tooltip: t('tooltips.amortCommission'),
    });
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
      gap: 12,
    }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-card)',
            borderRadius: 14,
            padding: '16px 18px',
            animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
          }}
        >
          <div style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 6,
            fontWeight: 600,
            fontFamily: "'Space Mono', monospace",
            display: 'flex',
            alignItems: 'center',
          }}>
            {card.label}
            <InfoTooltip text={card.tooltip} />
          </div>
          <div style={{
            fontSize: 19,
            fontWeight: 700,
            color: card.color,
            fontFamily: "'Space Mono', monospace",
          }}>
            {card.value}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text-dim)',
            marginTop: 4,
          }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
