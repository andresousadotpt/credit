import { useState, useMemo } from "react";

function fmt(val) {
  return val.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11, fontWeight: 700,
        background: "rgba(255,255,255,0.08)",
        color: "#71717a",
        width: 18, height: 18, borderRadius: "50%",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginLeft: 6, transition: "all 0.2s",
        border: "1px solid rgba(255,255,255,0.06)",
        ...(show ? { background: "rgba(255,255,255,0.14)", color: "#a1a1aa" } : {}),
      }}>ⓘ</span>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "12px 16px",
          fontSize: 11, color: "#d4d4d8", lineHeight: 1.6,
          width: 300, zIndex: 100,
          boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          whiteSpace: "normal",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "#facc15", marginBottom: 6,
            textTransform: "uppercase", letterSpacing: 1,
            fontFamily: "'Space Mono', monospace",
          }}>Como é calculado</div>
          {text}
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 10, height: 10, background: "#1a1a2e",
            borderRight: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }} />
        </div>
      )}
    </span>
  );
}

function InputField({ label, value, onChange, suffix, min, max, step = 1, icon }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontSize: 10, fontWeight: 600, color: "#71717a",
        textTransform: "uppercase", letterSpacing: 1,
        fontFamily: "'Space Mono', monospace",
      }}>{icon} {label}</label>
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, overflow: "hidden",
      }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min} max={max} step={step}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#e4e4e7", padding: "12px 14px", fontSize: 16,
            fontFamily: "'Space Mono', monospace", fontWeight: 600,
            width: "100%", minWidth: 0,
          }}
        />
        {suffix && (
          <span style={{
            padding: "12px 14px", fontSize: 13, color: "#52525b",
            fontFamily: "'Space Mono', monospace", fontWeight: 600,
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)", whiteSpace: "nowrap",
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default function SimuladorCredito() {
  const [loanAmount, setLoanAmount] = useState(42975);
  const [tan, setTan] = useState(4.13);
  const [taeg, setTaeg] = useState(5.08);
  const [monthlyPayment, setMonthlyPayment] = useState(593);
  const [months, setMonths] = useState(36);
  const [earlyRepayments, setEarlyRepayments] = useState([]);
  const [creditType, setCreditType] = useState("consumer");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showAllRows, setShowAllRows] = useState(false);

  const addRepayment = () => {
    setEarlyRepayments(prev => [...prev, { id: Date.now(), amount: 5000, month: 12 }]);
  };
  const removeRepayment = (id) => {
    setEarlyRepayments(prev => prev.filter(r => r.id !== id));
  };
  const updateRepayment = (id, field, value) => {
    setEarlyRepayments(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const getCommissionRate = (repayMonth) => {
    if (creditType === "housing_variable") return 0.005;
    if (creditType === "housing_fixed") return 0.02;
    const remaining = months - repayMonth;
    return remaining > 12 ? 0.005 : 0.0025;
  };

  const isExempt = creditType === "housing_variable";

  const data = useMemo(() => {
    // Build repayment map inline
    const repMap = {};
    earlyRepayments.forEach(r => {
      if (r.amount > 0 && r.month >= 1 && r.month <= months) {
        repMap[r.month] = (repMap[r.month] || 0) + r.amount;
      }
    });

    const monthlyRate = tan / 100 / 12;
    let balance = loanAmount;
    const rows = [];

    for (let i = 1; i <= months; i++) {
      if (balance <= 0) break;
      const interest = balance * monthlyRate;
      const effectivePayment = Math.min(monthlyPayment, balance + interest);
      const principal = effectivePayment - interest;
      balance = Math.max(balance - principal, 0);

      let earlyRepay = 0;
      let commission = 0;
      if (repMap[i]) {
        earlyRepay = Math.min(repMap[i], balance);
        // Commission rate inline
        let rate = 0;
        if (creditType === "housing_variable") rate = 0.005;
        else if (creditType === "housing_fixed") rate = 0.02;
        else rate = (months - i) > 12 ? 0.005 : 0.0025;
        commission = isExempt ? 0 : earlyRepay * rate;
        balance = Math.max(balance - earlyRepay, 0);
      }

      rows.push({
        month: i, payment: Math.round(effectivePayment * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        earlyRepay, commission: Math.round(commission * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        interestPct: effectivePayment > 0 ? Math.round((interest / effectivePayment) * 1000) / 10 : 0,
        principalPct: effectivePayment > 0 ? Math.round((principal / effectivePayment) * 1000) / 10 : 0,
      });
      if (balance <= 0) break;
    }
    return rows;
  }, [loanAmount, tan, monthlyPayment, months, earlyRepayments, creditType, isExempt]);

  const totalInterest = data.reduce((s, r) => s + r.interest, 0);
  const totalPrincipal = data.reduce((s, r) => s + r.principal, 0);
  const totalEarlyRepay = data.reduce((s, r) => s + r.earlyRepay, 0);
  const totalCommission = data.reduce((s, r) => s + r.commission, 0);
  const totalPaid = data.reduce((s, r) => s + r.payment, 0) + totalEarlyRepay + totalCommission;
  const finalBalance = data.length > 0 ? data[data.length - 1].balance : loanAmount;
  const actualMonths = data.length;
  const visibleData = showAllRows ? data : data.slice(0, 24);
  const hasMore = data.length > 24 && !showAllRows;

  const creditTypeLabels = {
    housing_variable: "Habitação — Taxa Variável",
    housing_fixed: "Habitação — Taxa Fixa",
    consumer: "Consumo (Automóvel, Pessoal)",
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "linear-gradient(145deg, #0a0a0f 0%, #12121f 50%, #0d1117 100%)",
      color: "#e4e4e7", minHeight: "100vh", padding: "28px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #facc15; cursor: pointer;
          box-shadow: 0 0 10px rgba(250,204,21,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%; border: none;
          background: #facc15; cursor: pointer;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.3; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1000, margin: "0 auto 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #006600 0%, #ff0000 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#fff",
            fontFamily: "'Space Mono', monospace",
            boxShadow: "0 4px 16px rgba(0,102,0,0.3)",
          }}>€</div>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 700, margin: 0,
              background: "linear-gradient(90deg, #f4f4f5, #a1a1aa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Simulador de Crédito 🇵🇹</h1>
            <p style={{ color: "#52525b", fontSize: 12, margin: 0 }}>Baseado na legislação portuguesa e regulamentação do Banco de Portugal</p>
          </div>
        </div>
      </div>

      {/* Warning: Vibe Coded */}
      <div style={{
        maxWidth: 1000, margin: "0 auto 12px",
        background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)",
        borderRadius: 12, padding: "14px 20px",
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fb923c", marginBottom: 4 }}>Simulador "Vibe Coded" — Usar com cautela!</div>
          <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>
            Este simulador foi gerado por IA e <strong style={{ color: "#d4d4d8" }}>não foi auditado por profissionais financeiros</strong>. Os valores e cálculos podem conter erros. Não tomes decisões financeiras com base exclusivamente nestes resultados — consulta sempre o teu banco ou consultor financeiro. Passa o rato sobre os ícones <span style={{ fontFamily: "'Space Mono', monospace", background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>ⓘ</span> para ver como cada cálculo é feito.
          </div>
        </div>
      </div>

      {/* Warning: Portugal-specific */}
      <div style={{
        maxWidth: 1000, margin: "0 auto 20px",
        background: "rgba(13,110,253,0.05)", border: "1px solid rgba(13,110,253,0.15)",
        borderRadius: 12, padding: "14px 20px",
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>🇵🇹</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", marginBottom: 4 }}>Cálculos baseados na legislação portuguesa</div>
          <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.6 }}>
            Utiliza o <strong style={{ color: "#d4d4d8" }}>Sistema Francês de Amortização</strong> (prestações constantes), padrão em Portugal. Comissões de amortização antecipada seguem limites legais do Banco de Portugal: <strong style={{ color: "#d4d4d8" }}>0,5%</strong> taxa variável / <strong style={{ color: "#d4d4d8" }}>2%</strong> taxa fixa (habitação); <strong style={{ color: "#d4d4d8" }}>0,5%</strong> {">"}1 ano / <strong style={{ color: "#d4d4d8" }}>0,25%</strong> ≤1 ano (consumo, DL 133/2009). A isenção para habitação taxa variável vigorou até 31/12/2025 (Lei n.º 1/2025) — <strong style={{ color: "#d4d4d8" }}>confirma junto do teu banco se foi prolongada</strong>. A TAEG é informativa e inclui TAN + seguros + comissões. Os juros são calculados mensalmente: Capital em Dívida × (TAN ÷ 12).
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <div style={{
        maxWidth: 1000, margin: "0 auto 20px",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: "24px",
      }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, color: "#a1a1aa", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Space Mono', monospace" }}>⚙️ Parâmetros do Crédito</h3>

        {/* Credit Type */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 8 }}>🏦 Tipo de Crédito<InfoTooltip text="O tipo de crédito determina a comissão de amortização antecipada aplicável. Habitação taxa variável: até 0,5% (isento até fim 2025). Habitação taxa fixa: até 2%. Consumo (automóvel, pessoal): 0,5% se faltam >12 meses, 0,25% se ≤12 meses (DL 133/2009)." /></label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(creditTypeLabels).map(([key, label]) => (
              <button key={key} onClick={() => setCreditType(key)} style={{
                padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: creditType === key ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.08)",
                background: creditType === key ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.03)",
                color: creditType === key ? "#60a5fa" : "#71717a",
                transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
              }}>
                {key.startsWith("housing") ? "🏠" : "🚗"} {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
          <InputField label="Montante Financiado" value={loanAmount} onChange={setLoanAmount} suffix="€" min={1000} max={500000} step={500} icon="💰" />
          <InputField label="Mensalidade" value={monthlyPayment} onChange={setMonthlyPayment} suffix="€" min={50} max={10000} step={10} icon="📅" />
          <InputField label="TAN" value={tan} onChange={setTan} suffix="%" min={0} max={30} step={0.01} icon="📊" />
          <InputField label="TAEG (informativa)" value={taeg} onChange={setTaeg} suffix="%" min={0} max={30} step={0.01} icon="📈" />
          <InputField label="Duração" value={months} onChange={setMonths} suffix="meses" min={6} max={480} step={1} icon="⏱️" />
        </div>

        {/* Early Repayments */}
        <div style={{
          background: "rgba(250,204,21,0.03)", border: "1px solid rgba(250,204,21,0.1)",
          borderRadius: 12, padding: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: "#facc15", margin: 0, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Space Mono', monospace" }}>
              ⚡ Amortizações Antecipadas
              <InfoTooltip text="Adiciona uma ou mais amortizações antecipadas em meses diferentes. Cada uma abate ao capital em dívida nesse mês e reduz os juros futuros. A comissão é calculada individualmente para cada amortização conforme o tipo de crédito e legislação portuguesa." />
            </h4>
            <button onClick={addRepayment} style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: "pointer", border: "1px solid rgba(250,204,21,0.3)",
              background: "rgba(250,204,21,0.1)", color: "#facc15",
              transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              + Adicionar Amortização
            </button>
          </div>

          {earlyRepayments.length === 0 && (
            <div style={{
              textAlign: "center", padding: "24px 16px",
              color: "#52525b", fontSize: 13, lineHeight: 1.6,
              border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 10,
            }}>
              Nenhuma amortização antecipada configurada.<br />
              <span style={{ fontSize: 12 }}>Clica em "+ Adicionar Amortização" para simular pagamentos extra.</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {earlyRepayments.map((repay, idx) => {
              const rate = getCommissionRate(repay.month);
              const commVal = isExempt ? 0 : repay.amount * rate;
              const remaining = months - repay.month;
              return (
                <div key={repay.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, padding: "16px",
                  animation: `fadeIn 0.3s ease`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#facc15",
                      fontFamily: "'Space Mono', monospace",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      ⚡ Amortização #{idx + 1}
                    </span>
                    <button onClick={() => removeRepayment(repay.id)} style={{
                      padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      cursor: "pointer", border: "1px solid rgba(248,113,113,0.3)",
                      background: "rgba(248,113,113,0.08)", color: "#f87171",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>✕ Remover</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 9, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>💸 Valor</label>
                      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" }}>
                        <input type="number" value={repay.amount} onChange={(e) => updateRepayment(repay.id, "amount", Number(e.target.value))}
                          min={0} max={loanAmount} step={500}
                          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e4e4e7", padding: "10px 12px", fontSize: 14, fontFamily: "'Space Mono', monospace", fontWeight: 600, width: "100%", minWidth: 0 }}
                        />
                        <span style={{ padding: "10px 12px", fontSize: 12, color: "#52525b", fontFamily: "'Space Mono', monospace", fontWeight: 600, borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>€</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 9, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>📅 Mês</label>
                      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" }}>
                        <input type="number" value={repay.month} onChange={(e) => updateRepayment(repay.id, "month", Math.max(1, Math.min(months, Number(e.target.value))))}
                          min={1} max={months} step={1}
                          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e4e4e7", padding: "10px 12px", fontSize: 14, fontFamily: "'Space Mono', monospace", fontWeight: 600, width: "100%", minWidth: 0 }}
                        />
                        <span style={{ padding: "10px 12px", fontSize: 12, color: "#52525b", fontFamily: "'Space Mono', monospace", fontWeight: 600, borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>mês</span>
                      </div>
                    </div>
                  </div>
                  {/* Commission info for this repayment */}
                  <div style={{ marginTop: 10, fontSize: 11, color: "#71717a", lineHeight: 1.5 }}>
                    {isExempt ? (
                      <span>Comissão: <span style={{ color: "#34d399", fontWeight: 600 }}>Isenta</span> (habitação taxa variável)</span>
                    ) : (
                      <span>Comissão: <span style={{ color: "#fb923c", fontWeight: 600 }}>{fmt(commVal)}</span> ({(rate * 100).toFixed(2)}% × {fmt(repay.amount)}){creditType === "consumer" && <span> — {remaining > 12 ? ">12 meses restantes" : "≤12 meses restantes"}</span>}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total commission summary */}
          {earlyRepayments.length > 0 && (
            <div style={{
              marginTop: 16, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 16px",
              fontSize: 12, color: "#a1a1aa", lineHeight: 1.6,
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
            }}>
              <div>
                <strong style={{ color: "#facc15" }}>Total amortizações:</strong>{" "}
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#e4e4e7" }}>{fmt(earlyRepayments.reduce((s, r) => s + r.amount, 0))}</span>
                <span style={{ color: "#52525b" }}> em {earlyRepayments.length} pagamento(s)</span>
              </div>
              <div>
                {isExempt ? (
                  <span style={{ color: "#34d399", fontWeight: 600 }}>✓ Todas isentas de comissão</span>
                ) : (
                  <span><strong style={{ color: "#fb923c" }}>Comissões totais:</strong> <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#fb923c" }}>{fmt(earlyRepayments.reduce((s, r) => s + r.amount * getCommissionRate(r.month), 0))}</span></span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ maxWidth: 1000, margin: "0 auto 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        {[
          { label: "Total Juros", value: fmt(totalInterest), color: "#f87171", sub: `${totalPaid > 0 ? (totalInterest / totalPaid * 100).toFixed(1) : 0}% do total pago`, tooltip: "Soma dos juros mensais. Fórmula: Juros(mês) = Capital em Dívida × (TAN ÷ 12). No sistema francês, os juros incidem sobre o saldo devedor e diminuem à medida que amortizas capital." },
          { label: "Capital Amortizado", value: fmt(totalPrincipal + totalEarlyRepay), color: "#34d399", sub: `${((totalPrincipal + totalEarlyRepay) / loanAmount * 100).toFixed(1)}% do montante`, tooltip: "Capital pago: prestações regulares + amortizações extra. Cada mês: Capital = Prestação − Juros. A amortização antecipada abate diretamente ao saldo devedor." },
          { label: "Dívida Restante", value: fmt(finalBalance), color: "#60a5fa", sub: `após ${actualMonths} meses`, tooltip: "Saldo devedor no final do período. Reduzido mensalmente pelo capital amortizado nas prestações e por amortizações antecipadas." },
          { label: "Total Pago", value: fmt(totalPaid), color: "#a78bfa", sub: totalCommission > 0 ? `incl. ${fmt(totalCommission)} comissão` : totalEarlyRepay > 0 ? `incl. ${fmt(totalEarlyRepay)} amort.` : `${actualMonths} prestações`, tooltip: "Soma de todas as prestações + amortizações extra + comissões de reembolso. Representa o custo total efetivo no período simulado." },
          ...(totalCommission > 0 ? [{ label: "Comissão Amort.", value: fmt(totalCommission), color: "#fb923c", sub: `${earlyRepayments.length} amortização(ões)`, tooltip: `Comissão sobre o valor amortizado. Limites legais PT: Habitação variável: 0,5% (isento até fim 2025); Habitação fixa: 2%; Consumo >1 ano: 0,5%; Consumo ≤1 ano: 0,25%.` }] : []),
        ].map((card, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "16px 18px",
            animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
          }}>
            <div style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontWeight: 600, fontFamily: "'Space Mono', monospace", display: "flex", alignItems: "center" }}>
              {card.label}<InfoTooltip text={card.tooltip} />
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: card.color, fontFamily: "'Space Mono', monospace" }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#52525b", marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        maxWidth: 1000, margin: "0 auto 20px",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14, padding: "24px 20px",
      }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, color: "#a1a1aa", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>Composição Mensal — Juros vs Capital</h3>
        <div style={{ display: "flex", gap: Math.max(1, Math.floor(4 - data.length / 20)), alignItems: "end", height: 140, overflowX: data.length > 60 ? "auto" : "visible", paddingBottom: 4 }}>
          {data.map((row, i) => {
            const totalH = 120;
            const interestH = (row.interest / monthlyPayment) * totalH;
            const principalH = (row.principal / monthlyPayment) * totalH;
            const isHovered = hoveredRow === i;
            const barWidth = data.length > 60 ? 10 : undefined;
            return (
              <div key={i} style={{ flex: barWidth ? `0 0 ${barWidth}px` : 1, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", position: "relative" }}
                onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                {isHovered && (
                  <div style={{
                    position: "absolute", bottom: totalH + 14, left: "50%", transform: "translateX(-50%)",
                    background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "8px 12px", whiteSpace: "nowrap",
                    fontSize: 11, zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Mês {row.month}</div>
                    <div style={{ color: "#f87171" }}>Juros: {fmt(row.interest)}</div>
                    <div style={{ color: "#34d399" }}>Capital: {fmt(row.principal)}</div>
                    <div style={{ color: "#60a5fa", fontSize: 10, marginTop: 2 }}>Dívida: {fmt(row.balance)}</div>
                    {row.earlyRepay > 0 && (
                      <>
                        <div style={{ color: "#facc15", fontWeight: 700, marginTop: 2 }}>⚡ Amortização: {fmt(row.earlyRepay)}</div>
                        {row.commission > 0 && <div style={{ color: "#fb923c", fontSize: 10 }}>Comissão: {fmt(row.commission)}</div>}
                        {isExempt && <div style={{ color: "#34d399", fontSize: 10 }}>✓ Isento de comissão</div>}
                      </>
                    )}
                  </div>
                )}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 1, position: "relative" }}>
                  {row.earlyRepay > 0 && (<div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 10, lineHeight: 1 }}>⚡</div>)}
                  <div style={{ height: interestH, borderRadius: "3px 3px 0 0", background: isHovered ? "#f87171" : "rgba(248,113,113,0.6)", transition: "all 0.2s" }} />
                  <div style={{ height: principalH, borderRadius: "0 0 3px 3px", background: isHovered ? "#34d399" : "rgba(52,211,153,0.5)", transition: "all 0.2s" }} />
                </div>
                {(data.length <= 48 || row.month % Math.ceil(data.length / 24) === 0 || row.month === 1) && (
                  <div style={{ fontSize: 8, color: "#52525b", marginTop: 4, fontFamily: "'Space Mono', monospace" }}>{row.month}</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a1a1aa" }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#f87171" }} /> Juros</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a1a1aa" }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#34d399" }} /> Capital</div>
          {earlyRepayments.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a1a1aa" }}>⚡ {earlyRepayments.length} amortização(ões) antecipada(s)</div>}
        </div>
      </div>

      {/* Table */}
      <div style={{ maxWidth: 1000, margin: "0 auto 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {[
                  { label: "Mês", tip: null },
                  { label: "Prestação", tip: "Valor fixo mensal (sistema francês). P = C × [i × (1+i)^n] / [(1+i)^n − 1], onde C = montante, i = TAN/12, n = nº meses. Método padrão regulado pelo Banco de Portugal." },
                  { label: "Juros", tip: "Juros = Capital em Dívida × (TAN ÷ 12). Calculados sobre o saldo devedor atual. Diminuem à medida que a dívida baixa." },
                  { label: "Capital", tip: "Capital = Prestação − Juros. Parte que reduz a dívida. No sistema francês aumenta ao longo do tempo." },
                  { label: "Amort. Extra", tip: "Pagamento extraordinário que abate ao capital. Comissão máx. PT: Habitação variável 0,5% (isenta até fim 2025); fixa 2%; Consumo 0,5% (>1 ano) ou 0,25% (≤1 ano) — DL 133/2009." },
                  { label: "% Juros", tip: "(Juros ÷ Prestação) × 100. Desce gradualmente ao longo do crédito." },
                  { label: "% Capital", tip: "(Capital ÷ Prestação) × 100. Sobe gradualmente ao longo do crédito." },
                  { label: "Dívida", tip: "Saldo após pagamento: Dívida anterior − Capital − Amort. extra. Base de cálculo dos juros seguintes." },
                ].map((h, i) => (
                  <th key={i} style={{ padding: "12px 10px", textAlign: i === 0 ? "center" : "right", fontSize: 10, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center" }}>{h.label}{h.tip && <InfoTooltip text={h.tip} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleData.map((row, i) => {
                const isYear = row.month % 12 === 0;
                const isAmort = row.earlyRepay > 0;
                return (
                  <tr key={i} style={{
                    borderBottom: isYear ? "2px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.03)",
                    background: isAmort ? "rgba(250,204,21,0.08)" : isYear ? "rgba(255,255,255,0.03)" : "transparent",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isAmort ? "rgba(250,204,21,0.12)" : "rgba(255,255,255,0.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = isAmort ? "rgba(250,204,21,0.08)" : isYear ? "rgba(255,255,255,0.03)" : "transparent"}
                  >
                    <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "#a1a1aa" }}>{row.month}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace" }}>{fmt(row.payment)}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#f87171" }}>{fmt(row.interest)}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#34d399" }}>{fmt(row.principal)}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace" }}>
                      {row.earlyRepay > 0 ? (
                        <span style={{ background: "rgba(250,204,21,0.15)", color: "#facc15", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                          ⚡ {fmt(row.earlyRepay)}{row.commission > 0 ? ` (+${fmt(row.commission)})` : ""}
                        </span>
                      ) : <span style={{ color: "#3f3f46" }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>
                      <span style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", padding: "2px 7px", borderRadius: 6, fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>{row.interestPct}%</span>
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>
                      <span style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", padding: "2px 7px", borderRadius: 6, fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>{row.principalPct}%</span>
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#60a5fa", fontWeight: 500 }}>{fmt(row.balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <button onClick={() => setShowAllRows(true)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 28px", color: "#a1a1aa", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Ver todos os {data.length} meses ↓
            </button>
          </div>
        )}
        {showAllRows && data.length > 24 && (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <button onClick={() => setShowAllRows(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 28px", color: "#a1a1aa", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Mostrar menos ↑
            </button>
          </div>
        )}
      </div>

      {/* Legal Footer */}
      <div style={{ maxWidth: 1000, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 10, color: "#3f3f46", lineHeight: 1.7, fontFamily: "'Space Mono', monospace" }}>
          <strong style={{ color: "#52525b" }}>📋 Referências legais:</strong> Sistema Francês (padrão PT) · DL 133/2009 (crédito consumo) · DL 74-A/2017 (crédito habitação) · DL 80-A/2022 + Lei n.º 1/2025 (isenção comissão taxa variável até 31/12/2025) · Instrução n.º 12/2023 BdP (cálculo TAEG) · Simulação meramente indicativa — consulta o teu banco para valores vinculativos.
        </div>
      </div>
    </div>
  );
}