import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Bankability.css';

const DEBT_CATEGORIES = [
  { id: 'car', label: '🚗 Car Loan', type: 'bad', monthly: 0 },
  { id: 'personal', label: '💳 Personal Loan', type: 'bad', monthly: 0 },
  { id: 'credit', label: '💳 Credit Card (min)', type: 'bad', monthly: 0 },
  { id: 'student', label: '🎓 PTPTN / Study Loan', type: 'neutral', monthly: 0 },
];

function formatRM(num) {
  if (num >= 1000000) return `RM ${(num/1000000).toFixed(2)}M`;
  if (num >= 1000) return `RM ${(num/1000).toFixed(0)}k`;
  return `RM ${num}`;
}

export default function Bankability() {
  const [income, setIncome] = useState(8000);
  const [debts, setDebts] = useState(DEBT_CATEGORIES.map(d => ({ ...d })));
  const [newDebt, setNewDebt] = useState({ label: '', type: 'bad', monthly: 0 });

  const totalDebt = useMemo(() => debts.reduce((sum, d) => sum + (Number(d.monthly) || 0), 0), [debts]);
  const dsr = useMemo(() => income > 0 ? (totalDebt / income) * 100 : 0, [totalDebt, income]);
  const remainingCapacity = useMemo(() => income * 0.65 - totalDebt, [income, totalDebt]);
  const maxLoan = useMemo(() => {
    const monthly = remainingCapacity;
    const rate = 4.5 / 100 / 12;
    const n = 360;
    if (monthly <= 0 || rate <= 0) return 0;
    return monthly * (1 - Math.pow(1 + rate, -n)) / rate;
  }, [remainingCapacity]);

  const dsrStatus = dsr <= 50 ? 'safe' : dsr <= 65 ? 'warning' : 'danger';
  const dsrColor = { safe: 'var(--accent-sage)', warning: 'var(--accent-gold)', danger: 'var(--accent-rust)' }[dsrStatus];
  const dsrLabel = { safe: 'Excellent', warning: 'Caution', danger: 'Over-limit' }[dsrStatus];
  const dsrIcon = { safe: CheckCircle, warning: AlertCircle, danger: XCircle }[dsrStatus];
  const DsrIcon = dsrIcon;

  const badDebt = debts.filter(d => d.type === 'bad').reduce((s, d) => s + Number(d.monthly || 0), 0);
  const goodDebt = debts.filter(d => d.type === 'good').reduce((s, d) => s + Number(d.monthly || 0), 0);
  const neutralDebt = debts.filter(d => d.type === 'neutral').reduce((s, d) => s + Number(d.monthly || 0), 0);

  const pieData = [
    { name: 'Bad Debt', value: badDebt || 0.01, color: 'var(--accent-rust)' },
    { name: 'Good Debt', value: goodDebt || 0.01, color: 'var(--accent-sage)' },
    { name: 'Neutral Debt', value: neutralDebt || 0.01, color: 'var(--accent-gold)' },
    { name: 'Free Capacity', value: Math.max(0, income * 0.65 - totalDebt), color: 'var(--beige)' },
  ];

  const updateDebt = (id, field, val) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));
  };

  const removeDebt = (id) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const addDebt = () => {
    if (!newDebt.label) return;
    setDebts(prev => [...prev, { ...newDebt, id: Date.now().toString(), monthly: Number(newDebt.monthly) || 0 }]);
    setNewDebt({ label: '', type: 'bad', monthly: 0 });
  };

  return (
    <div className="page bankability-page">
      <div className="container">
        {/* Header */}
        <div className="page-header animate-fadeUp">
          <div className="overline">Step 01 — Eligibility</div>
          <h1 className="section-title">Bankability Scanner</h1>
          <p className="section-subtitle">Know your real borrowing power before you fall in love with a property.</p>
        </div>

        <div className="bank-layout">
          {/* Left: Inputs */}
          <div className="bank-inputs">
            {/* Income */}
            <div className="card" style={{ animationDelay: '0.1s' }} className="card animate-fadeUp">
              <h3 className="card-title">Monthly Income</h3>
              <p className="card-sub">Total gross income (salary + allowances)</p>

              <div className="income-display">
                <span className="income-prefix">RM</span>
                <input
                  type="number"
                  className="income-input"
                  value={income}
                  onChange={e => setIncome(Number(e.target.value))}
                  min="1000"
                  max="100000"
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="500"
                  value={income}
                  onChange={e => setIncome(Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--stone)' }}>RM 2,000</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--stone)' }}>RM 50,000</span>
                </div>
              </div>

              <div className="income-breakdown">
                <div className="ib-item">
                  <span>Max DSR Capacity (65%)</span>
                  <span>{formatRM(income * 0.65)}</span>
                </div>
                <div className="ib-item">
                  <span>Committed Repayments</span>
                  <span style={{ color: totalDebt > income * 0.65 ? 'var(--accent-rust)' : 'inherit' }}>
                    {formatRM(totalDebt)}
                  </span>
                </div>
                <div className="ib-item highlight">
                  <span>Available for Property Loan</span>
                  <span style={{ color: 'var(--accent-sage)' }}>{formatRM(Math.max(0, income * 0.65 - totalDebt))}</span>
                </div>
              </div>
            </div>

            {/* Debt tracker */}
            <div className="card animate-fadeUp" style={{ marginTop: '20px' }}>
              <h3 className="card-title">Debt Commitments</h3>
              <p className="card-sub">Every monthly commitment you have</p>

              <div className="debt-legend">
                <span className="dl-item bad">● Bad Debt</span>
                <span className="dl-item good">● Good Debt (property)</span>
                <span className="dl-item neutral">● Neutral</span>
              </div>

              <div className="debt-list">
                {debts.map(debt => (
                  <div className={`debt-row debt-${debt.type}`} key={debt.id}>
                    <div className="debt-label-wrap">
                      <span className={`debt-dot ${debt.type}`} />
                      <span className="debt-name">{debt.label}</span>
                    </div>
                    <div className="debt-controls">
                      <span style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>RM</span>
                      <input
                        type="number"
                        className="debt-input"
                        value={debt.monthly}
                        onChange={e => updateDebt(debt.id, 'monthly', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                      <button className="debt-remove" onClick={() => removeDebt(debt.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new debt */}
              <div className="add-debt">
                <input
                  type="text"
                  placeholder="Debt name..."
                  className="input-field"
                  style={{ flex: 2, fontSize: '0.9rem', padding: '10px 12px' }}
                  value={newDebt.label}
                  onChange={e => setNewDebt(p => ({ ...p, label: e.target.value }))}
                />
                <select
                  className="input-field"
                  style={{ flex: 1, fontSize: '0.85rem', padding: '10px 8px' }}
                  value={newDebt.type}
                  onChange={e => setNewDebt(p => ({ ...p, type: e.target.value }))}
                >
                  <option value="bad">Bad Debt</option>
                  <option value="good">Good Debt</option>
                  <option value="neutral">Neutral</option>
                </select>
                <input
                  type="number"
                  placeholder="RM/mo"
                  className="input-field"
                  style={{ flex: 1, fontSize: '0.9rem', padding: '10px 12px' }}
                  value={newDebt.monthly || ''}
                  onChange={e => setNewDebt(p => ({ ...p, monthly: Number(e.target.value) }))}
                />
                <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px' }} onClick={addDebt}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="bank-results">
            {/* DSR Gauge */}
            <div className="card dsr-card animate-fadeUp">
              <h3 className="card-title">Your DSR Score</h3>
              <p className="card-sub">Debt Service Ratio — the bank's primary metric</p>

              <div className="dsr-gauge">
                <div className="dsr-circle" style={{ '--dsr-color': dsrColor }}>
                  <svg viewBox="0 0 100 100" className="dsr-svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--beige)" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={dsrColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(dsr, 100) * 2.51} 251`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                    />
                  </svg>
                  <div className="dsr-inner">
                    <div className="dsr-value" style={{ color: dsrColor }}>{dsr.toFixed(1)}%</div>
                    <div className="dsr-label">{dsrLabel}</div>
                  </div>
                </div>

                <div className="dsr-zones">
                  <div className="zone safe">
                    <span className="zone-dot" style={{ background: 'var(--accent-sage)' }} />
                    <div>
                      <div className="zone-range">≤ 50% — Safe Zone</div>
                      <div className="zone-desc">Excellent bankability</div>
                    </div>
                  </div>
                  <div className="zone warning">
                    <span className="zone-dot" style={{ background: 'var(--accent-gold)' }} />
                    <div>
                      <div className="zone-range">50–65% — Caution</div>
                      <div className="zone-desc">Reduce commitments first</div>
                    </div>
                  </div>
                  <div className="zone danger">
                    <span className="zone-dot" style={{ background: 'var(--accent-rust)' }} />
                    <div>
                      <div className="zone-range">&gt; 65% — Danger</div>
                      <div className="zone-desc">Banks likely to reject</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`dsr-verdict ${dsrStatus}`}>
                <DsrIcon size={18} />
                <span>
                  {dsrStatus === 'safe' && `You're in great shape! Your DSR is below 50%.`}
                  {dsrStatus === 'warning' && `You're in the caution zone. Consider clearing some debts first.`}
                  {dsrStatus === 'danger' && `Banks will likely reject your loan. Reduce debts to below 65%.`}
                </span>
              </div>
            </div>

            {/* Loan range */}
            <div className="card loan-card animate-fadeUp" style={{ marginTop: '20px' }}>
              <h3 className="card-title">Estimated Loan Eligibility</h3>
              <p className="card-sub">Based on DSR capacity at 4.5% rate, 30-year tenure</p>

              <div className="loan-display">
                <div className="loan-main">
                  <div className="loan-amount">{maxLoan > 0 ? formatRM(maxLoan) : 'RM 0'}</div>
                  <div className="loan-sub">Maximum property loan</div>
                </div>
                <div className="loan-meta">
                  <div className="stat-row">
                    <span className="stat-label">Property Price (90% LTV)</span>
                    <span className="stat-value">{maxLoan > 0 ? formatRM(maxLoan / 0.9) : '—'}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Downpayment Needed (10%)</span>
                    <span className="stat-value">{maxLoan > 0 ? formatRM(maxLoan / 0.9 * 0.1) : '—'}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Monthly Installment</span>
                    <span className="stat-value">{formatRM(Math.max(0, income * 0.65 - totalDebt))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Debt composition pie */}
            <div className="card animate-fadeUp" style={{ marginTop: '20px' }}>
              <h3 className="card-title">Debt Composition</h3>
              <p className="card-sub">How your commitments affect bankability</p>
              <div className="pie-wrap">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => val < 0.02 ? '—' : `RM ${val.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map((d, i) => (
                    <div className="pie-leg-item" key={i}>
                      <span className="pie-dot" style={{ background: d.color }} />
                      <span className="pie-name">{d.name}</span>
                      <span className="pie-val">RM {Math.max(0, d.value).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {badDebt > 0 && (
                <div className="debt-tip">
                  💡 <strong>Tip:</strong> Clearing RM {formatRM(badDebt)} in bad debt would increase your loan capacity by approximately {formatRM(badDebt / (4.5/100/12) * (1 - Math.pow(1 + 4.5/100/12, -360)))}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
