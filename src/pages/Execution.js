import React, { useState } from 'react';
import { Phone, MapPin, CheckCircle, Clock, ChevronRight, Star } from 'lucide-react';
import './Execution.css';

const BANKERS = [
  {
    id: 1, name: 'Ahmad Razif', bank: 'Maybank', speciality: 'Under-Construction Projects',
    phone: '0123456789', rating: 4.9, deals: 234, avatar: '👨‍💼',
    notes: 'Specialist in developer packages, first-timer loans. Fast approval track record.',
    expertise: ['Undercon', 'First Timers', 'High LTV'],
  },
  {
    id: 2, name: 'Sarah Chen', bank: 'CIMB Bank', speciality: 'Investment Properties',
    phone: '0198765432', rating: 4.8, deals: 187, avatar: '👩‍💼',
    notes: 'Expert in multi-property investors, refinancing, and equity recycling strategies.',
    expertise: ['Refinancing', 'Portfolio', 'Co-living'],
  },
  {
    id: 3, name: 'Ravi Kumar', bank: 'RHB Bank', speciality: 'Foreign Workers & Expats',
    phone: '0167894321', rating: 4.7, deals: 156, avatar: '🧑‍💼',
    notes: 'Handles complex income structures, commission-based earners, and expat financing.',
    expertise: ['Complex Income', 'Expats', 'Flexible DSR'],
  },
  {
    id: 4, name: 'Amirah Yusoff', bank: 'Bank Islam', speciality: 'Islamic Financing',
    phone: '0111234567', rating: 4.9, deals: 201, avatar: '👩‍💼',
    notes: 'Murabahah & Musharakah financing. Excellent rates for civil servants & Government staff.',
    expertise: ['Islamic Finance', 'Civil Servant', 'Tabung Haji'],
  },
];

const LOAN_STAGES = [
  { id: 1, status: 'completed', label: 'Documents Submitted', date: 'Feb 10, 2025', icon: CheckCircle, color: 'var(--accent-sage)' },
  { id: 2, status: 'completed', label: 'Credit Checking', date: 'Feb 12, 2025', icon: CheckCircle, color: 'var(--accent-sage)' },
  { id: 3, status: 'active', label: 'Valuation in Progress', date: 'Est. Feb 24, 2025', icon: Clock, color: 'var(--accent-gold)' },
  { id: 4, status: 'pending', label: 'Letter of Offer', date: '—', icon: Clock, color: 'var(--stone)' },
  { id: 5, status: 'pending', label: 'Loan Disbursement', date: '—', icon: Clock, color: 'var(--stone)' },
];

const CHECKLIST = [
  { category: 'Before Viewing', items: [
    { label: 'Check DSR using Bankability Scanner', done: true },
    { label: 'Set max budget based on loan eligibility', done: true },
    { label: 'Identify target location based on job catchment', done: false },
    { label: 'Shortlist 3–5 Undercon projects', done: false },
  ]},
  { category: 'During Process', items: [
    { label: 'Attend developer briefing', done: false },
    { label: 'Review SPA terms with lawyer', done: false },
    { label: 'Apply to 3 banks simultaneously', done: false },
    { label: 'Choose best LOO', done: false },
  ]},
  { category: 'Post-Purchase', items: [
    { label: 'Set up rental management', done: false },
    { label: 'Monitor VP date (vacant possession)', done: false },
    { label: 'Plan refinancing at 3-year mark', done: false },
    { label: 'Review portfolio for next purchase', done: false },
  ]},
];

export default function Execution() {
  const [checklist, setChecklist] = useState(CHECKLIST);
  const [activeTab, setActiveTab] = useState('bankers');
  const [loanReference, setLoanReference] = useState('MY-2025-004821');

  const toggleCheck = (catIdx, itemIdx) => {
    const updated = checklist.map((cat, ci) =>
      ci === catIdx
        ? { ...cat, items: cat.items.map((item, ii) => ii === itemIdx ? { ...item, done: !item.done } : item) }
        : cat
    );
    setChecklist(updated);
  };

  const totalItems = checklist.flatMap(c => c.items).length;
  const doneItems = checklist.flatMap(c => c.items).filter(i => i.done).length;
  const progress = (doneItems / totalItems) * 100;

  return (
    <div className="page execution-page">
      <div className="container">
        <div className="page-header animate-fadeUp">
          <div className="overline">Step 04 — Action</div>
          <h1 className="section-title">Guided Execution</h1>
          <p className="section-subtitle">From decision to keys in hand. Your complete action hub.</p>
        </div>

        {/* Overall progress */}
        <div className="card progress-overview animate-fadeUp">
          <div className="po-left">
            <h3 className="card-title">Your Roadmap Progress</h3>
            <p className="card-sub">{doneItems} of {totalItems} steps completed</p>
            <div className="progress-bar" style={{ marginTop: '12px' }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--accent-gold)' }} />
            </div>
          </div>
          <div className="po-pct">
            <div className="pct-value">{Math.round(progress)}%</div>
            <div className="pct-label">Complete</div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="tab-nav animate-fadeUp" style={{ marginBottom: '28px', marginTop: '32px' }}>
          {[
            { id: 'bankers', label: '🏦 Specialist Bankers' },
            { id: 'tracker', label: '📊 Loan Tracker' },
            { id: 'checklist', label: '✅ Action Checklist' },
          ].map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Bankers */}
        {activeTab === 'bankers' && (
          <div className="exec-grid animate-fadeUp">
            {BANKERS.map(banker => (
              <div key={banker.id} className="banker-card card">
                <div className="banker-header">
                  <div className="banker-avatar">{banker.avatar}</div>
                  <div className="banker-info">
                    <h3 className="banker-name">{banker.name}</h3>
                    <div className="banker-bank">{banker.bank}</div>
                    <div className="banker-specialty">{banker.speciality}</div>
                  </div>
                  <div className="banker-rating">
                    <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
                    <span>{banker.rating}</span>
                    <div className="banker-deals">{banker.deals} deals</div>
                  </div>
                </div>

                <p className="banker-notes">{banker.notes}</p>

                <div className="banker-tags">
                  {banker.expertise.map((tag, i) => (
                    <span key={i} className="badge badge-gold">{tag}</span>
                  ))}
                </div>

                <div className="banker-actions">
                  <a
                    href={`https://wa.me/${banker.phone.replace(/\D/g, '')}?text=Hi ${banker.name}, I got your contact from the Property Success Roadmap app. I'd like to discuss my property loan options.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', borderRadius: '8px' }}
                  >
                    <span>💬</span> WhatsApp
                  </a>
                  <a
                    href={`tel:+6${banker.phone}`}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', borderRadius: '8px' }}
                  >
                    <Phone size={15} /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loan tracker */}
        {activeTab === 'tracker' && (
          <div className="animate-fadeIn">
            <div className="card loan-ref-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title">Loan Application Tracker</h3>
                  <div className="ref-num">Ref: {loanReference}</div>
                </div>
                <div className="loan-status-badge">
                  <div className="pulse-dot" />
                  In Progress
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Application Status</h3>
              <div className="loan-timeline">
                {LOAN_STAGES.map((stage, i) => {
                  const Icon = stage.icon;
                  return (
                    <div key={i} className={`loan-stage ${stage.status}`}>
                      <div className="ls-icon-wrap" style={{ '--lc': stage.color }}>
                        <Icon size={18} color={stage.color} />
                      </div>
                      <div className="ls-content">
                        <div className="ls-label">{stage.label}</div>
                        <div className="ls-date">{stage.date}</div>
                      </div>
                      <div className={`ls-status-badge status-${stage.status}`}>
                        {stage.status === 'completed' ? 'Done' : stage.status === 'active' ? 'In Progress' : 'Pending'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unit availability tracker */}
            <div className="card" style={{ marginTop: '24px' }}>
              <h3 className="card-title">Live Unit Availability</h3>
              <p className="card-sub">Real-time status of your shortlisted units</p>
              <div className="unit-grid">
                {[
                  { unit: 'A-12-03', floor: '12', type: '2+1 Bed', status: 'available', price: 'RM 450,000' },
                  { unit: 'A-15-05', floor: '15', type: '2+1 Bed', status: 'reserved', price: 'RM 465,000' },
                  { unit: 'B-08-01', floor: '8', type: '3 Bed', status: 'available', price: 'RM 520,000' },
                  { unit: 'B-20-04', floor: '20', type: '2+1 Bed', status: 'sold', price: 'RM 490,000' },
                  { unit: 'A-18-07', floor: '18', type: '3 Bed', status: 'available', price: 'RM 535,000' },
                  { unit: 'C-05-02', floor: '5', type: '2 Bed', status: 'available', price: 'RM 380,000' },
                ].map((u, i) => (
                  <div key={i} className={`unit-card unit-${u.status}`}>
                    <div className="unit-num">{u.unit}</div>
                    <div className="unit-floor">Floor {u.floor}</div>
                    <div className="unit-type">{u.type}</div>
                    <div className="unit-price">{u.price}</div>
                    <div className={`unit-status-label ${u.status}`}>
                      <span className={`status-dot status-${u.status === 'available' ? 'available' : u.status === 'reserved' ? 'limited' : 'sold'}`} />
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book session */}
            <div className="card cta-booking" style={{ marginTop: '24px' }}>
              <div className="booking-inner">
                <div>
                  <h3 className="card-title">Book a 1-on-1 Strategy Session</h3>
                  <p style={{ color: 'var(--stone)', fontSize: '0.9rem', marginTop: '4px' }}>
                    Get personalized guidance from a property investment expert. 45 minutes, no obligations.
                  </p>
                </div>
                <div className="booking-actions">
                  <a
                    href="https://wa.me/60123456789?text=Hi! I'd like to book a 1-on-1 property strategy session through the Property Success Roadmap."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    <span>📱</span> Book via WhatsApp
                  </a>
                  <a
                    href="https://wa.me/60123456789?text=Hi! I'd like to schedule a project site visit."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <MapPin size={15} /> Site Visit
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checklist */}
        {activeTab === 'checklist' && (
          <div className="animate-fadeIn">
            {checklist.map((category, catIdx) => (
              <div key={catIdx} className="card checklist-card" style={{ marginBottom: '20px' }}>
                <div className="cl-header">
                  <h3 className="card-title">{category.category}</h3>
                  <div className="cl-count">
                    {category.items.filter(i => i.done).length}/{category.items.length}
                  </div>
                </div>
                <div className="cl-items">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={`cl-item ${item.done ? 'done' : ''}`}
                      onClick={() => toggleCheck(catIdx, itemIdx)}
                    >
                      <div className={`cl-checkbox ${item.done ? 'checked' : ''}`}>
                        {item.done && <CheckCircle size={14} />}
                      </div>
                      <span className="cl-label">{item.label}</span>
                      <ChevronRight size={14} color="var(--sand)" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
