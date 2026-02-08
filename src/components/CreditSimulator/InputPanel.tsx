import { useI18n } from '../../i18n';
import InputField from '../ui/InputField';
import InfoTooltip from '../ui/InfoTooltip';
import type { CreditType } from '../../types';

interface InputPanelProps {
  creditType: CreditType;
  setCreditType: (type: CreditType) => void;
  loanAmount: number;
  setLoanAmount: (val: number) => void;
  monthlyPayment: number;
  setMonthlyPayment: (val: number) => void;
  tan: number;
  setTan: (val: number) => void;
  taeg: number;
  setTaeg: (val: number) => void;
  months: number;
  setMonths: (val: number) => void;
}

export default function InputPanel({
  creditType,
  setCreditType,
  loanAmount,
  setLoanAmount,
  monthlyPayment,
  setMonthlyPayment,
  tan,
  setTan,
  taeg,
  setTaeg,
  months,
  setMonths,
}: InputPanelProps) {
  const { t } = useI18n();

  const creditTypeLabels: Record<CreditType, string> = {
    housing_variable: t('params.creditType.housingVariable'),
    housing_fixed: t('params.creditType.housingFixed'),
    consumer: t('params.creditType.consumer'),
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: 16,
      padding: '24px',
    }}>
      <h3 style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        margin: '0 0 16px',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontFamily: "'Space Mono', monospace",
      }}>⚙️ {t('params.title')}</h3>

      {/* Credit Type */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontFamily: "'Space Mono', monospace",
          display: 'block',
          marginBottom: 8,
        }}>
          🏦 {t('params.creditType.label')}
          <InfoTooltip text={t('tooltips.creditType')} />
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.entries(creditTypeLabels) as [CreditType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCreditType(key)}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: creditType === key ? '1px solid var(--selected-border)' : '1px solid var(--border-input)',
                background: creditType === key ? 'var(--selected-bg)' : 'var(--bg-card-alt)',
                color: creditType === key ? 'var(--color-blue)' : 'var(--text-muted)',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {key.startsWith('housing') ? '🏠' : '🚗'} {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 20,
      }}>
        <InputField
          label={t('params.fields.loanAmount')}
          value={loanAmount}
          onChange={setLoanAmount}
          suffix="€"
          min={1000}
          max={500000}
          step={500}
          icon="💰"
        />
        <InputField
          label={t('params.fields.monthlyPayment')}
          value={monthlyPayment}
          onChange={setMonthlyPayment}
          suffix="€"
          min={50}
          max={10000}
          step={10}
          icon="📅"
        />
        <InputField
          label={t('params.fields.tan')}
          value={tan}
          onChange={setTan}
          suffix="%"
          min={0}
          max={30}
          step={0.01}
          icon="📊"
        />
        <InputField
          label={t('params.fields.taeg')}
          value={taeg}
          onChange={setTaeg}
          suffix="%"
          min={0}
          max={30}
          step={0.01}
          icon="📈"
        />
        <InputField
          label={t('params.fields.duration')}
          value={months}
          onChange={setMonths}
          suffix={t('params.fields.months')}
          min={6}
          max={480}
          step={1}
          icon="⏱️"
        />
      </div>
    </div>
  );
}
