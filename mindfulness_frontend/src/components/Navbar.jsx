import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Smile, Headphones, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Liste de nos pages avec leurs icônes
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/humeur', icon: Smile, label: 'Humeur' },
    { path: '/exercices', icon: Headphones, label: 'Exercices' },
    { path: '/profil', icon: User, label: 'Profil' }
  ];

  return (
    <nav style={styles.navbar}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path} style={styles.navItem}>
            <div style={{
              ...styles.iconWrapper,
              // Petit fond vert très clair et icône Vert Forêt si actif
              backgroundColor: isActive ? '#D1FAE5' : 'transparent',
            }}>
              <Icon 
                size={24} 
                color={isActive ? '#14532D' : '#94A3B8'} 
                style={{ transition: 'all 0.3s ease' }} 
              />
            </div>
            <span style={{ 
              ...styles.label, 
              color: isActive ? '#14532D' : '#94A3B8',
              fontWeight: isActive ? '700' : '500'
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

// --- Nouveaux Styles de la Navbar ---
const styles = {
  navbar: {
    position: 'absolute', // Reste bien en bas du conteneur principal
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 15px 0',
    boxShadow: '0 -4px 20px rgba(120, 53, 15, 0.08)', // Ombre chaleureuse
    borderTop: '1px solid #FEF3C7',
    zIndex: 1000
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    flex: 1,
    WebkitTapHighlightColor: 'transparent' // Enlève le carré bleu moche sur mobile
  },
  iconWrapper: {
    padding: '8px 16px',
    borderRadius: '20px',
    marginBottom: '4px',
    transition: 'background-color 0.3s ease'
  },
  label: {
    fontSize: '11px',
    transition: 'color 0.3s ease'
  }
};

export default Navbar;