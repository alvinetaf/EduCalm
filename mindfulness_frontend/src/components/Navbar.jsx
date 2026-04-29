import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Smile, Headphones, User, Leaf } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/humeur', icon: Smile, label: 'Humeur' },
    { path: '/exercices', icon: Headphones, label: 'Exercices' },
    { path: '/profil', icon: User, label: 'Profil' },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoWrapper}>
        <div style={styles.logoIcon}>
          <Leaf size={20} color="#FFFFFF" />
        </div>
        <h2 style={styles.logoText}>
          Edu<span style={{ color: '#D97706' }}>Calm</span>
        </h2>
      </div>

      {/* Navigation links */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? '#D1FAE5' : 'transparent',
              }}
            >
              <div style={{
                ...styles.iconWrapper,
                backgroundColor: isActive ? '#A7F3D0' : 'transparent',
              }}>
                <Icon size={20} color={isActive ? '#14532D' : '#94A3B8'} />
              </div>
              <span style={{
                ...styles.navLabel,
                color: isActive ? '#14532D' : '#64748B',
                fontWeight: isActive ? '700' : '500',
              }}>
                {item.label}
              </span>
              {isActive && <div style={styles.activeDot} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.sidebarFooter}>
        <p style={styles.footerText}>Ton espace sérénité 🌿</p>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '240px',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #FEF3C7',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    boxShadow: '2px 0 12px rgba(20, 83, 45, 0.06)',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '28px 20px 24px',
    borderBottom: '1px solid #FEF3C7',
    marginBottom: '12px',
  },
  logoIcon: {
    backgroundColor: '#14532D',
    padding: '8px',
    borderRadius: '10px',
    display: 'flex',
  },
  logoText: {
    margin: 0,
    color: '#14532D',
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
  },
  navLabel: {
    fontSize: '15px',
    transition: 'color 0.2s ease',
  },
  activeDot: {
    position: 'absolute',
    right: '14px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#14532D',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #FEF3C7',
  },
  footerText: {
    margin: 0,
    fontSize: '12px',
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
};

export default Navbar;
