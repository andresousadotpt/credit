import { useI18n } from '../../i18n';
import { useCreditSimulator } from '../../hooks/useCreditSimulator';
import InputPanel from './InputPanel';
import EarlyRepayments from './EarlyRepayments';
import SummaryCards from './SummaryCards';
import Chart from './Chart';
import AmortizationTable from './AmortizationTable';

export default function CreditSimulator() {
  const { t } = useI18n();
  const {
    loanAmount,
    setLoanAmount,
    tan,
    setTan,
    taeg,
    setTaeg,
    monthlyPayment,
    setMonthlyPayment,
    months,
    setMonths,
    earlyRepayments,
    creditType,
    setCreditType,
    addRepayment,
    removeRepayment,
    updateRepayment,
    getCommissionRate,
    isExempt,
    data,
    totalInterest,
    totalPrincipal,
    totalEarlyRepay,
    totalCommission,
    totalPaid,
    finalBalance,
    actualMonths,
  } = useCreditSimulator();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Warning: Vibe Coded */}
      <div style={{
        marginBottom: 12,
        background: 'var(--warning-orange-bg)',
        border: '1px solid var(--warning-orange-border)',
        borderRadius: 12,
        padding: '14px 20px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>⚠️</span>
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-orange)',
            marginBottom: 4,
          }}>
            {t('warnings.vibeCoded.title')}
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            {t('warnings.vibeCoded.description')}{' '}
            <strong style={{ color: 'var(--text-highlight)' }}>
              {t('warnings.vibeCoded.notAudited')}
            </strong>. {' '}
            {t('warnings.vibeCoded.tooltipHint')}
          </div>
        </div>
      </div>

      {/* Warning: Portugal-specific */}
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
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>🇵🇹</span>
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-blue)',
            marginBottom: 4,
          }}>
            {t('warnings.portugal.title')}
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            {t('warnings.portugal.description')}
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <div style={{ marginBottom: 20 }}>
        <InputPanel
          creditType={creditType}
          setCreditType={setCreditType}
          loanAmount={loanAmount}
          setLoanAmount={setLoanAmount}
          monthlyPayment={monthlyPayment}
          setMonthlyPayment={setMonthlyPayment}
          tan={tan}
          setTan={setTan}
          taeg={taeg}
          setTaeg={setTaeg}
          months={months}
          setMonths={setMonths}
        />

        {/* Early Repayments - nested inside InputPanel card */}
        <div style={{ marginTop: 20 }}>
          <EarlyRepayments
            earlyRepayments={earlyRepayments}
            addRepayment={addRepayment}
            removeRepayment={removeRepayment}
            updateRepayment={updateRepayment}
            getCommissionRate={getCommissionRate}
            isExempt={isExempt}
            creditType={creditType}
            months={months}
            loanAmount={loanAmount}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ marginBottom: 20 }}>
        <SummaryCards
          totalInterest={totalInterest}
          totalPrincipal={totalPrincipal}
          totalEarlyRepay={totalEarlyRepay}
          totalCommission={totalCommission}
          totalPaid={totalPaid}
          finalBalance={finalBalance}
          actualMonths={actualMonths}
          loanAmount={loanAmount}
          earlyRepaymentsCount={earlyRepayments.length}
        />
      </div>

      {/* Chart */}
      <div style={{ marginBottom: 20 }}>
        <Chart
          data={data}
          monthlyPayment={monthlyPayment}
          earlyRepaymentsCount={earlyRepayments.length}
        />
      </div>

      {/* Amortization Table */}
      <div style={{ marginBottom: 20 }}>
        <AmortizationTable data={data} />
      </div>
    </div>
  );
}
