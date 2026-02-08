interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  icon?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 1,
  icon
}: InputFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: "'Space Mono', monospace",
      }}>{icon} {label}</label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-input)',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            padding: '12px 14px',
            fontSize: 16,
            fontFamily: "'Space Mono', monospace",
            fontWeight: 600,
            width: '100%',
            minWidth: 0,
          }}
        />
        {suffix && (
          <span style={{
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--text-dim)',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 600,
            borderLeft: '1px solid var(--border-card)',
            background: 'var(--bg-card)',
            whiteSpace: 'nowrap',
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}
