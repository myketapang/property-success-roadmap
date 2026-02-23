import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine
} from 'recharts';
import './GrowthSimulator.css';



function formatRM(n) {
  if (n >= 1000000) return `RM ${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `RM ${(n / 1000).toFixed(0)}k`;
  return `RM ${Math.round(n)}`;
}

const RENTAL_MODES_FIXED = [
  { id: 'whole', label: '🏠 Whole Unit', multiplier: 1.0, desc: 'Traditional single tenant. Stable income, lower yield.' },
  { id: 'coliving', label: '🛏️ Co-Living', multiplier: 1.5, desc: 'Room-by-room rental. 50% higher income, higher management.' },
  { id: 'airbnb', label: '✈️ AirBnB/STR', multiplier: 2.2, desc: 'Short-term rental. Maximum income, seasonal variability.' },
];

export default function GrowthSimulator() {
  const [propPrice, setPropPrice] = useState(450000);
  const [ltvPct, setLtvPct] = useState(90);
  const [annualGrowth, setAnnualGrowth] = useState(5);
  const [baseRent, setBaseRent] = useState(2000);
  const [rentalMode, setRentalMode] = useState('whole');
  const [view, setView] = useState('roi'); // roi | snowball | rental

  const loanAmt = propPrice * (ltvPct / 100);
  const downpayment = propPrice - loanAmt;
  const monthlyRate = 4.5 / 100 / 12;
  const n = 360;
  const monthlyInstallment = loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  const mode = RENTAL_MODES_FIXED.find(m => m.id === rentalMode);
  const effectiveRent = baseRent * mode.multiplier;
  const annualRent = effectiveRent * 12;
  const cashROI = ((annualRent - monthlyInstallment * 12) / downpayment) * 100;
  const cashOnlyROI = (annualRent * 0.05) / propPrice * 100; // simplified

  // Snowball data
  const snowballData = useMemo(() => {
    const years = [0, 1, 2, 3, 4, 5];
    return years.map(yr => {
      const propVal = propPrice * Math.pow(1 + annualGrowth / 100, yr);
      const equity = propVal - loanAmt;
      const rentIncome = effectiveRent * 12 * yr;
      return {
        year: yr === 0 ? 'Now' : `Yr ${yr}`,
        'Property Value': Math.round(propVal),
        'Equity': Math.round(equity),
        'Rental Income (cumulative)': Math.round(rentIncome),
      };
    });
  }, [propPrice, annualGrowth, loanAmt, effectiveRent]);

  // Rental mode comparison
  const rentalCompare = RENTAL_MODES_FIXED.map(m => ({
    name: m.label,
    monthly: Math.round(baseRent * m.multiplier),
    annual: Math.round(baseRent * m.multiplier * 12),
    yield: ((baseRent * m.multiplier * 12) / propPrice * 100).toFixed(2),
  }));

  return (
    <div className="page simulator-page">
      <div className="container">
        <div className="page-header animate-fadeUp">
          <div className="overline">Step 03 — Strategy</div>
          <h1 className="section-title">OPM Growth Simulator</h1>
          <p className="section-subtitle">Visualize how leverage, time, and rental strategy combine to build wealth.</p>
        </div>

        <div className="sim-layout">
          {/* Controls */}
          <div className="sim-controls animate-fadeUp">
            <div className="card">
              <h3 className="card-title">Property Parameters</h3>

              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="input-label">Property Price</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: '600' }}>{formatRM(propPrice)}</span>
                </div>
                <input type="range" min={200000} max={2000000} step={10000} value={propPrice}
                  onChange={e => setPropPrice(Number(e.target.value))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--stone)' }}>
                  <span>RM 200k</span><span>RM 2M</span>
                </div>
              </div>

              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="input-label">Loan-to-Value (LTV)</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: '600' }}>{ltvPct}%</span>
                </div>
                <input type="range" min={70} max={90} step={5} value={ltvPct}
                  onChange={e => setLtvPct(Number(e.target.value))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--stone)' }}>
                  <span>70% (30% down)</span><span>90% (10% down)</span>
                </div>
              </div>

              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="input-label">Annual Capital Growth</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: '600' }}>{annualGrowth}%</span>
                </div>
                <input type="range" min={2} max={12} step={0.5} value={annualGrowth}
                  onChange={e => setAnnualGrowth(Number(e.target.value))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--stone)' }}>
                  <span>2% (conservative)</span><span>12% (bullish)</span>
                </div>
              </div>

              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="input-label">Base Market Rent</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: '600' }}>RM {baseRent.toLocaleString()}</span>
                </div>
                <input type="range" min={500} max={8000} step={100} value={baseRent}
                  onChange={e => setBaseRent(Number(e.target.value))} />
              </div>
            </div>

            {/* Key metrics */}
            <div className="card key-metrics">
              <h3 className="card-title">Key Numbers</h3>
              <div className="stat-row">
                <span className="stat-label">Loan Amount</span>
                <span className="stat-value">{formatRM(loanAmt)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Downpayment</span>
                <span className="stat-value highlight-val">{formatRM(downpayment)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Monthly Installment</span>
                <span className="stat-value">RM {Math.round(monthlyInstallment).toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Effective Rent ({mode.label})</span>
                <span className="stat-value" style={{ color: 'var(--accent-sage)' }}>RM {Math.round(effectiveRent).toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Cash-on-Cash ROI</span>
                <span className="stat-value roi-highlight">{cashROI.toFixed(1)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Gross Yield</span>
                <span className="stat-value">{((annualRent / propPrice) * 100).toFixed(2)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Net Cash Flow</span>
                <span className="stat-value" style={{ color: effectiveRent - monthlyInstallment >= 0 ? 'var(--accent-sage)' : 'var(--accent-rust)' }}>
                  RM {Math.round(effectiveRent - monthlyInstallment).toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="sim-charts animate-fadeUp">
            {/* Tab nav */}
            <div className="tab-nav" style={{ marginBottom: '24px' }}>
              {[
                { id: 'roi', label: '⚡ ROI: Cash vs Leverage' },
                { id: 'snowball', label: '📈 Snowball Growth' },
                { id: 'rental', label: '🏠 Rental Strategy' },
              ].map(t => (
                <button key={t.id} className={`tab-btn ${view === t.id ? 'active' : ''}`} onClick={() => setView(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {view === 'roi' && (
              <div className="chart-panel">
                <div className="card">
                  <h3 className="card-title">Cash vs. Leverage ROI Comparison</h3>
                  <p className="card-sub">Why smart investors use Other People's Money (OPM)</p>

                  <div className="roi-comparison">
                    <div className="roi-card bad">
                      <div className="roi-badge">Cash Purchase</div>
                      <div className="roi-big">{cashOnlyROI.toFixed(1)}%</div>
                      <div className="roi-sub">Annual ROI</div>
                      <div className="roi-detail">
                        <div>Capital deployed: {formatRM(propPrice)}</div>
                        <div>Annual gain: {formatRM(propPrice * annualGrowth / 100)}</div>
                      </div>
                    </div>
                    <div className="roi-vs">vs</div>
                    <div className="roi-card good">
                      <div className="roi-badge">90% Bank Loan</div>
                      <div className="roi-big">{cashROI.toFixed(1)}%</div>
                      <div className="roi-sub">Cash-on-Cash ROI</div>
                      <div className="roi-detail">
                        <div>Capital deployed: {formatRM(downpayment)}</div>
                        <div>Net monthly: RM {Math.round(effectiveRent - monthlyInstallment).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="leverage-flow">
                    <h4 className="lf-title">Leverage Flow Diagram</h4>
                    <div className="lf-steps">
                      <div className="lf-step">
                        <div className="lf-icon">💰</div>
                        <div>Your Cash<br /><strong>{formatRM(downpayment)}</strong></div>
                      </div>
                      <div className="lf-arrow">→</div>
                      <div className="lf-step">
                        <div className="lf-icon">🏦</div>
                        <div>Bank Loan<br /><strong>{formatRM(loanAmt)}</strong></div>
                      </div>
                      <div className="lf-arrow">→</div>
                      <div className="lf-step">
                        <div className="lf-icon">🏠</div>
                        <div>Property<br /><strong>{formatRM(propPrice)}</strong></div>
                      </div>
                      <div className="lf-arrow">→</div>
                      <div className="lf-step highlight-step">
                        <div className="lf-icon">📈</div>
                        <div>5yr Equity<br /><strong style={{ color: 'var(--accent-sage)' }}>{formatRM(propPrice * Math.pow(1 + annualGrowth/100, 5) - loanAmt)}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ marginTop: '20px' }}>
                  <h3 className="card-title">Equity Recycling Roadmap</h3>
                  <p className="card-sub">How 1 property becomes 3 through strategic refinancing</p>
                  <div className="recycling-timeline">
                    {[
                      { yr: 'Year 0', action: 'Buy Property A', capital: formatRM(downpayment), note: 'Use 10% downpayment + loan' },
                      { yr: 'Year 2–3', action: 'Property Appreciates', capital: `+${formatRM(propPrice * annualGrowth/100 * 2.5)}`, note: `At ${annualGrowth}% p.a. growth` },
                      { yr: 'Year 3', action: 'Refinance Property A', capital: formatRM(propPrice * Math.pow(1+annualGrowth/100,3) * 0.3), note: 'Extract built-up equity' },
                      { yr: 'Year 3', action: 'Buy Property B', capital: 'RM 0 extra cash', note: 'Using extracted equity' },
                      { yr: 'Year 5', action: 'Refinance B, Buy C', capital: '3 Properties', note: `Total portfolio: ${formatRM(propPrice * Math.pow(1+annualGrowth/100,5) * 3)}` },
                    ].map((step, i) => (
                      <div className="timeline-item" key={i}>
                        <div className={`timeline-dot ${i < 3 ? 'completed' : ''}`} />
                        <div className="tl-content">
                          <div className="tl-year">{step.yr}</div>
                          <div className="tl-action">{step.action}</div>
                          <div className="tl-capital">{step.capital}</div>
                          <div className="tl-note">{step.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'snowball' && (
              <div className="card chart-panel">
                <h3 className="card-title">5-Year Wealth Snowball</h3>
                <p className="card-sub">Property value and equity growth over time</p>

                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={snowballData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--beige)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'var(--stone)' }} />
                    <YAxis tickFormatter={v => `RM ${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                    <Tooltip formatter={v => formatRM(v)} contentStyle={{ background: 'var(--warm-white)', border: '1px solid var(--beige)', borderRadius: '10px', fontSize: '0.85rem' }} />
                    <Legend wrapperStyle={{ fontSize: '0.82rem' }} />
                    <Line type="monotone" dataKey="Property Value" stroke="var(--accent-gold)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--accent-gold)' }} />
                    <Line type="monotone" dataKey="Equity" stroke="var(--accent-sage)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--accent-sage)' }} />
                    <Line type="monotone" dataKey="Rental Income (cumulative)" stroke="var(--accent-blue)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                    <ReferenceLine y={propPrice} stroke="var(--sand)" strokeDasharray="3 3" label={{ value: 'Purchase Price', fontSize: 10, fill: 'var(--stone)' }} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="snapshot-grid" style={{ marginTop: '24px' }}>
                  {snowballData.filter((_, i) => [0, 2, 5].includes(i)).map((d, i) => (
                    <div className="snapshot-card" key={i}>
                      <div className="snap-year">{d.year}</div>
                      <div className="snap-val">{formatRM(d['Property Value'])}</div>
                      <div className="snap-equity">Equity: {formatRM(d['Equity'])}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'rental' && (
              <div className="chart-panel">
                <div className="card">
                  <h3 className="card-title">Rental Strategy Selector</h3>
                  <p className="card-sub">Choose your rental approach and see the income impact</p>

                  <div className="rental-modes">
                    {RENTAL_MODES_FIXED.map(m => (
                      <div
                        key={m.id}
                        className={`rental-mode ${rentalMode === m.id ? 'active' : ''}`}
                        onClick={() => setRentalMode(m.id)}
                      >
                        <div className="rm-label">{m.label}</div>
                        <div className="rm-multiplier">×{m.multiplier}</div>
                        <div className="rm-rent">RM {Math.round(baseRent * m.multiplier).toLocaleString()}/mo</div>
                        <div className="rm-desc">{m.desc}</div>
                      </div>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height={220} style={{ marginTop: '24px' }}>
                    <BarChart data={rentalCompare} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--beige)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--stone)' }} />
                      <YAxis tickFormatter={v => `RM ${v.toLocaleString()}`} tick={{ fontSize: 10, fill: 'var(--stone)' }} />
                      <Tooltip formatter={v => `RM ${v.toLocaleString()}`} contentStyle={{ background: 'var(--warm-white)', border: '1px solid var(--beige)', borderRadius: '10px', fontSize: '0.82rem' }} />
                      <Bar dataKey="annual" name="Annual Rental Income" fill="var(--accent-gold)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card" style={{ marginTop: '20px' }}>
                  <h3 className="card-title">Strategy Comparison</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {rentalCompare.map((r, i) => (
                      <div key={i} className={`strategy-row ${rentalMode === RENTAL_MODES_FIXED[i].id ? 'active' : ''}`} onClick={() => setRentalMode(RENTAL_MODES_FIXED[i].id)}>
                        <span style={{ fontWeight: '500', color: 'var(--charcoal)', fontSize: '0.9rem' }}>{r.name}</span>
                        <div style={{ flex: 1, margin: '0 16px' }}>
                          <div className="meter-container">
                            <div className="meter-fill" style={{ width: `${(r.monthly / (baseRent * 2.2)) * 100}%`, background: ['var(--accent-sage)', 'var(--accent-blue)', 'var(--accent-gold)'][i] }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: '600' }}>RM {r.monthly.toLocaleString()}/mo</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--stone)' }}>{r.yield}% yield</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
