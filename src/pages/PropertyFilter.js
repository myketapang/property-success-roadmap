import React, { useState, useMemo } from 'react';
import { MapPin, Star } from 'lucide-react';
import './PropertyFilter.css';

const PROPERTIES = [
  {
    id: 1, name: 'Residensi Ara Damansara', location: 'Petaling Jaya, Selangor',
    price: 420000, avgArea: 520000, type: 'Undercon', layout: 'Serviced Apartment',
    sqft: 850, rooms: '2+1', status: 'available', score: { price: 95, location: 92, layout: 88 },
    completionYear: 2026, developer: 'Matrix Concepts',
    jobAreas: ['Subang', 'PJ', 'KL'], rentEst: 2200, emoji: '🏙️',
    packages: ['Zero downpayment', 'Free legal fees', 'Rental guarantee'],
  },
  {
    id: 2, name: 'Taman Austin Perdana', location: 'Johor Bahru, Johor',
    price: 310000, avgArea: 380000, type: 'Undercon', layout: 'Intermediate',
    sqft: 1200, rooms: '4+1', status: 'available', score: { price: 90, location: 85, layout: 95 },
    completionYear: 2026, developer: 'Bolton Berhad',
    jobAreas: ['JB City', 'Iskandar Malaysia'], rentEst: 1600, emoji: '🏡',
    packages: ['SPA signed', '10% rebate', 'Stamp duty absorbed'],
  },
  {
    id: 3, name: 'Emporis Kota Damansara', location: 'Petaling Jaya, Selangor',
    price: 530000, avgArea: 650000, type: 'Undercon', layout: 'Serviced Apartment',
    sqft: 900, rooms: '3', status: 'limited', score: { price: 88, location: 96, layout: 82 },
    completionYear: 2025, developer: 'Nusmetro Group',
    jobAreas: ['One Utama', 'Curve', 'Damansara'], rentEst: 2800, emoji: '🌆',
    packages: ['2-year rental guarantee', 'Fully furnished option'],
  },
  {
    id: 4, name: 'Setia Alam Residences', location: 'Shah Alam, Selangor',
    price: 380000, avgArea: 450000, type: 'Undercon', layout: 'Intermediate',
    sqft: 1350, rooms: '4', status: 'available', score: { price: 92, location: 80, layout: 96 },
    completionYear: 2027, developer: 'SP Setia',
    jobAreas: ['Shah Alam', 'Klang', 'Subang'], rentEst: 1800, emoji: '🌳',
    packages: ['Low density', 'Gated & guarded', 'Smart home ready'],
  },
  {
    id: 5, name: 'Medini Signature', location: 'Nusajaya, Johor',
    price: 480000, avgArea: 570000, type: 'Undercon', layout: 'Serviced Apartment',
    sqft: 780, rooms: '2', status: 'limited', score: { price: 86, location: 90, layout: 80 },
    completionYear: 2026, developer: 'Medini Iskandar',
    jobAreas: ['Legoland', 'Medini Hub', 'Pinewood Studios'], rentEst: 2400, emoji: '🏝️',
    packages: ['Foreign buyer eligible', 'Leaseback program'],
  },
  {
    id: 6, name: 'Wangsa 118 Residences', location: 'Wangsa Maju, KL',
    price: 610000, avgArea: 720000, type: 'Undercon', layout: 'Serviced Apartment',
    sqft: 950, rooms: '3', status: 'available', score: { price: 84, location: 94, layout: 85 },
    completionYear: 2026, developer: 'KL118 Development',
    jobAreas: ['KLCC', 'Ampang', 'Wangsa Maju'], rentEst: 3200, emoji: '🌃',
    packages: ['MRT-connected', 'Premium facilities'],
  },
];

const LOCATION_FILTER = ['All', 'Selangor', 'Johor', 'Kuala Lumpur'];
const PRICE_RANGE = ['All', '< RM400k', 'RM400k–600k', '> RM600k'];
const STATUS_FILTER = ['All', 'available', 'limited'];

function trinityScore(p) {
  return Math.round((p.score.price + p.score.location + p.score.layout) / 3);
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
        <span style={{ color: 'var(--stone)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color }}>{value}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function PropertyCard({ prop, onClick, selected }) {
  const trinity = trinityScore(prop);
  const below = ((prop.avgArea - prop.price) / prop.avgArea * 100).toFixed(0);

  return (
    <div
      className={`property-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(prop)}
    >
      <div className="property-img" style={{ fontSize: '3.5rem' }}>
        {prop.emoji}
        <div className="prop-status-badge">
          <span className={`status-dot status-${prop.status}`} />
          {prop.status === 'available' ? 'Available' : 'Limited Units'}
        </div>
      </div>
      <div className="property-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '6px' }}>{prop.type}</div>
            <h3 className="prop-name">{prop.name}</h3>
            <div className="prop-location">
              <MapPin size={12} /> {prop.location}
            </div>
          </div>
          <div className="trinity-badge" style={{ '--tc': trinity >= 90 ? 'var(--accent-sage)' : trinity >= 80 ? 'var(--accent-gold)' : 'var(--stone)' }}>
            <Star size={12} />
            <span>{trinity}</span>
          </div>
        </div>

        <div className="prop-price-row">
          <div>
            <div className="prop-price">RM {(prop.price / 1000).toFixed(0)}k</div>
            <div className="prop-avg">{below}% below avg</div>
          </div>
          <div className="prop-specs">
            <span>{prop.sqft} sqft</span>
            <span>·</span>
            <span>{prop.rooms} rooms</span>
            <span>·</span>
            <span>{prop.layout}</span>
          </div>
        </div>

        <div className="trinity-bars">
          <ScoreBar label="Price" value={prop.score.price} color="var(--accent-sage)" />
          <ScoreBar label="Location" value={prop.score.location} color="var(--accent-blue)" />
          <ScoreBar label="Layout" value={prop.score.layout} color="var(--accent-gold)" />
        </div>

        <div className="prop-packages">
          {prop.packages.slice(0, 2).map((pkg, i) => (
            <span key={i} className="chip" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>✓ {pkg}</span>
          ))}
        </div>

        <div className="prop-completion">
          🗓️ Completion: {prop.completionYear} · Est. rent: RM {prop.rentEst.toLocaleString()}/mo
        </div>
      </div>
    </div>
  );
}

export default function PropertyFilter() {
  const [locFilter, setLocFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('score');

  const filtered = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (locFilter !== 'All' && !p.location.includes(locFilter)) return false;
      if (priceFilter === '< RM400k' && p.price >= 400000) return false;
      if (priceFilter === 'RM400k–600k' && (p.price < 400000 || p.price > 600000)) return false;
      if (priceFilter === '> RM600k' && p.price <= 600000) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') return trinityScore(b) - trinityScore(a);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rent') return b.rentEst - a.rentEst;
      return 0;
    });
  }, [locFilter, priceFilter, statusFilter, sortBy]);

  return (
    <div className="page filter-page">
      <div className="container">
        <div className="page-header animate-fadeUp">
          <div className="overline">Step 02 — Selection</div>
          <h1 className="section-title">Holy Trinity Property Filter</h1>
          <p className="section-subtitle">Every property pre-vetted on Price, Location, and Layout. Undercon-first.</p>
        </div>

        {/* Filter bar */}
        <div className="filter-bar animate-fadeUp">
          <div className="filter-group">
            <span className="filter-label">Location</span>
            <div className="filter-chips">
              {LOCATION_FILTER.map(f => (
                <button key={f} className={`chip ${locFilter === f ? 'active' : ''}`} onClick={() => setLocFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Price Range</span>
            <div className="filter-chips">
              {PRICE_RANGE.map(f => (
                <button key={f} className={`chip ${priceFilter === f ? 'active' : ''}`} onClick={() => setPriceFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Availability</span>
            <div className="filter-chips">
              {STATUS_FILTER.map(f => (
                <button key={f} className={`chip ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>
                  {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-sort">
            <span className="filter-label">Sort by</span>
            <select className="input-field" style={{ padding: '8px 12px', fontSize: '0.85rem' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="score">Trinity Score</option>
              <option value="price">Price ↑</option>
              <option value="rent">Rental Est ↓</option>
            </select>
          </div>
        </div>

        <div className="filter-layout">
          {/* Property grid */}
          <div className="properties-grid">
            <div className="results-count">{filtered.length} properties found</div>
            <div className="props-grid">
              {filtered.map(p => (
                <PropertyCard key={p.id} prop={p} onClick={setSelected} selected={selected?.id === p.id} />
              ))}
              {filtered.length === 0 && (
                <div className="no-results">
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <p>No properties match your filters. Try adjusting the criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="detail-panel animate-fadeIn">
              <div className="card detail-card">
                <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
                <div className="detail-header">
                  <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '16px' }}>{selected.emoji}</div>
                  <h2 className="detail-name">{selected.name}</h2>
                  <div className="prop-location"><MapPin size={13} /> {selected.location}</div>
                </div>

                <div className="detail-trinity">
                  <div className="trinity-score-large">
                    <Star size={16} color="var(--accent-gold)" />
                    <span>{trinityScore(selected)}</span>
                    <span className="ts-label">Trinity Score</span>
                  </div>
                  <div className="trinity-detail-bars">
                    <ScoreBar label="Price Score" value={selected.score.price} color="var(--accent-sage)" />
                    <ScoreBar label="Location Score" value={selected.score.location} color="var(--accent-blue)" />
                    <ScoreBar label="Layout Score" value={selected.score.layout} color="var(--accent-gold)" />
                  </div>
                </div>

                <div className="detail-info">
                  <div className="stat-row">
                    <span className="stat-label">Asking Price</span>
                    <span className="stat-value" style={{ color: 'var(--accent-sage)' }}>RM {selected.price.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Area Average</span>
                    <span className="stat-value">RM {selected.avgArea.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Discount vs Market</span>
                    <span className="stat-value" style={{ color: 'var(--accent-sage)' }}>
                      {((selected.avgArea - selected.price)/selected.avgArea*100).toFixed(1)}% below
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Size</span>
                    <span className="stat-value">{selected.sqft} sqft · {selected.rooms} rooms</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Developer</span>
                    <span className="stat-value">{selected.developer}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Expected Completion</span>
                    <span className="stat-value">{selected.completionYear}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Estimated Rental</span>
                    <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>RM {selected.rentEst.toLocaleString()}/mo</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Gross Rental Yield</span>
                    <span className="stat-value">
                      {((selected.rentEst * 12 / selected.price) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div className="filter-label" style={{ marginBottom: '8px' }}>Job Catchment Areas</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selected.jobAreas.map((a, i) => <span key={i} className="badge badge-blue">{a}</span>)}
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div className="filter-label" style={{ marginBottom: '8px' }}>Developer Packages</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selected.packages.map((pkg, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--charcoal)' }}>
                        <span style={{ color: 'var(--accent-sage)' }}>✓</span> {pkg}
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/60123456789?text=Hi! I'm interested in ${encodeURIComponent(selected.name)} (${encodeURIComponent(selected.location)}). Price: RM${selected.price.toLocaleString()}. Can you share more details?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '20px', borderRadius: 'var(--radius-sm)' }}
                >
                  <span>📱</span> Book a Site Visit
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
