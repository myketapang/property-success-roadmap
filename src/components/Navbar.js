
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/bankability', label: 'Bankability' },
  { path: '/filter', label: 'Properties' },
  { path: '/simulator', label: 'Simulator' },
  { path: '/execute', label: 'Execute' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo">
          <div className="logo-icon">
            <Building2 size={18} />
          </div>
          <span className="logo-text">PSR</span>
        </NavLink>

        <div className="nav-links desktop">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <NavLink to="/bankability" className="nav-cta desktop">
          Get Started
        </NavLink>

        <button className="menu-btn mobile" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
