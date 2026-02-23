import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import './Landing.css';

const pillars = [
  {
    icon: '🏦',
    number: '01',
    title: 'Bankability Scanner',
    subtitle: 'Know your limits — and break them',
    desc: 'Instant DSR check, good vs bad debt analysis, and your real loan ceiling. No spreadsheets.',
    path: '/bankability',
    badge: 'Eligibility',
    color: 'var(--accent-gold)',
  },
  {
    icon: '🏙️',
    number: '02',
    title: 'Holy Trinity Filter',
    subtitle: 'Only the best properties, curated',
    desc: 'Every listing scored on Price, Location, and Layout. Undercon-first. Zero noise.',
    path: '/filter',
    badge: 'Selection',
    color: 'var(--accent-sage)',
  },
  {
    icon: '📈',
    number: '03',
    title: 'OPM Growth Simulator',
    subtitle: 'See your wealth multiply',
    desc: 'Visualize leverage ROI, equity recycling, and rental strategy returns in one click.',
    path: '/simulator',
    badge: 'Strategy',
    color: 'var(--accent-blue)',
  },
  {
    icon: '⚡',
    number: '04',
    title: 'Guided Execution',
    subtitle: 'Knowledge → Action',
    desc: 'Specialized bankers, live loan tracking, and one-tap booking — all in one place.',
    path: '/execute',
    badge: 'Action',
    color: 'var(--accent-rust)',
  },
];

const stats = [
  { value: '90%', label: 'Max Loan-to-Value', sub: 'for first-time buyers' },
  { value: '50%', label: 'ROI with leverage', sub: 'vs 5% cash purchase' },
  { value: '3x', label: 'Properties in 5 yrs', sub: 'via equity recycling' },
  { value: '✓', label: 'Under-Construction', sub: 'specialist defaults' },
];

export default function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let raf;
    const handleMove = (e) => {
      raf = requestAnimationFrame(() => {
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = ((e.clientX - left) / width - 0.5) * 20;
        const y = ((e.clientY - top) / height - 0.5) * 20;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => { window.removeEventListener('mousemove', handleMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="badge badge-gold">🏠 Malaysia Property</span>
              <span className="badge badge-sage">Newbie-Friendly</span>
            </div>
            <h1 className="hero-title">
              Your <em>Property Success</em>
              <br />Roadmap
            </h1>
            <p className="hero-desc">
              From "can I even afford this?" to owning three properties in five years.
              The intelligent guide for first-time Malaysian property investors.
            </p>
            <div className="hero-actions">
              <Link to="/bankability" className="btn-primary">
                Check My Bankability <ArrowRight size={18} />
              </Link>
              <Link to="/filter" className="btn-secondary">
                Browse Properties
              </Link>
            </div>

            <div className="hero-stats">
              {stats.map((s, i) => (
                <div className="hero-stat" key={i} style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                  <div className="hero-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card fc-1">
              <div className="fc-label">DSR Score</div>
              <div className="fc-value">68%</div>
              <div className="fc-bar">
                <div className="fc-fill" style={{ width: '68%', background: 'var(--accent-gold)' }} />
              </div>
              <div className="fc-sub">✓ Within safe zone</div>
            </div>
            <div className="floating-card fc-2">
              <div className="fc-label">Loan Approved</div>
              <div className="fc-value big">RM 650k</div>
              <div className="fc-sub">🏆 Best rate secured</div>
            </div>
            <div className="floating-card fc-3">
              <div className="fc-label">Year 5 Portfolio</div>
              <div className="fc-value">3 Units</div>
              <div className="fc-sub">📈 +RM 2.1M equity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <p className="overline">The Framework</p>
            <h2 className="section-title">Four Pillars to Property Success</h2>
            <p className="section-subtitle">A structured, step-by-step journey built for first-time investors</p>
          </div>

          <div className="pillars-grid">
            {pillars.map((p, i) => (
              <Link to={p.path} key={i} className="pillar-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="pillar-number">{p.number}</div>
                <div className="pillar-icon" style={{ background: p.color + '22' }}>
                  <span>{p.icon}</span>
                </div>
                <div className="pillar-badge" style={{ background: p.color + '22', color: p.color }}>
                  {p.badge}
                </div>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-subtitle">{p.subtitle}</p>
                <p className="pillar-desc">{p.desc}</p>
                <div className="pillar-arrow" style={{ color: p.color }}>
                  Explore <ChevronRight size={16} />
                </div>
                <div className="pillar-accent" style={{ background: p.color }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-inner">
            <div className="philosophy-text">
              <p className="overline">The Snowball Strategy</p>
              <h2 className="section-title">One Property Today.<br /><em>Three in Five Years.</em></h2>
              <p style={{ color: 'var(--stone)', lineHeight: 1.8, marginTop: '16px' }}>
                The secret isn't saving more cash — it's understanding how to use <strong>Other People's Money (OPM)</strong>. 
                By leveraging a 90% bank loan, your actual cash ROI doesn't just double — it multiplies tenfold.
              </p>
              <div className="comparison-row">
                <div className="comparison-item bad">
                  <div className="comp-label">Cash Purchase ROI</div>
                  <div className="comp-value">5%</div>
                  <div className="comp-sub">Full capital tied up</div>
                </div>
                <div className="comparison-divider">vs</div>
                <div className="comparison-item good">
                  <div className="comp-label">Leveraged ROI (90% loan)</div>
                  <div className="comp-value">50%</div>
                  <div className="comp-sub">10% capital, 90% bank's money</div>
                </div>
              </div>
              <Link to="/simulator" className="btn-gold" style={{ marginTop: '24px', display: 'inline-flex' }}>
                See the Math <ArrowRight size={18} />
              </Link>
            </div>
            <div className="philosophy-visual">
              <div className="snowball-diagram">
                {[
                  { year: 'Now', units: 1, equity: 'RM 50k' },
                  { year: 'Yr 2', units: 1, equity: 'RM 120k' },
                  { year: 'Yr 3', units: 2, equity: 'RM 280k' },
                  { year: 'Yr 5', units: 3, equity: 'RM 600k+' },
                ].map((item, i) => (
                  <div className="snowball-step" key={i}>
                    <div className="sb-year">{item.year}</div>
                    <div className="sb-units">{Array(item.units).fill(0).map((_, j) => <span key={j}>🏠</span>)}</div>
                    <div className="sb-equity">{item.equity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2 className="cta-title">Ready to start your journey?</h2>
            <p className="cta-sub">Begin with a 2-minute bankability check. No commitment required.</p>
            <Link to="/bankability" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
              Start Free Assessment <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
