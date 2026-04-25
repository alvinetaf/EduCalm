import React, { useState, useEffect } from 'react';
import { Leaf, BrainCircuit, HeartHandshake } from 'lucide-react';
// Ton image locale est bien conservée !
import monImageAccueil from '../images/app_illustration_home.jpg';

const Accueil = () => {
  // 1. On prépare une variable pour le pseudo
  const [pseudo, setPseudo] = useState('Élève');

  // 2. Quand la page s'allume, on va chercher le vrai nom dans la mémoire du téléphone
  useEffect(() => {
    const nomSauvegarde = localStorage.getItem('userPseudo');
    if (nomSauvegarde) {
      setPseudo(nomSauvegarde);
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* LA MAGNIFIQUE IMAGE D'ACCUEIL */}
      <div style={styles.imageWrapper}>
        <img 
          src={monImageAccueil} 
          alt="Nature apaisante du Cameroun"
          style={styles.mainImage}
        />
        <div style={styles.imageOverlay}></div>
      </div>

      <div style={styles.header}>
        {/* 👇 C'est ici que la magie opère avec {pseudo} 👇 */}
        <h1 style={styles.greeting}>Bonjour, <span style={styles.pseudo}>{pseudo}</span></h1>
        <p style={styles.subtitle}>Prêt(e) pour un moment de calme ?</p>
      </div>

      <div style={styles.introBox}>
        <Leaf size={24} color="#D97706" style={{ marginBottom: '10px' }} />
        <p style={styles.introText}>
          Laisse tes soucis de classe à la porte. Ici, c'est ton refuge pour respirer et te détendre.
        </p>
      </div>

      <h3 style={styles.sectionTitle}>Tes urgences calme</h3>
      <div style={styles.quickAccess}>
        <button style={styles.quickButton}>
          <BrainCircuit size={20} color="#14532D" />
          5 min pour me concentrer
        </button>
        <button style={styles.quickButton}>
          <HeartHandshake size={20} color="#14532D" />
          Respirer avant un devoir
        </button>
      </div>
    </div>
  );
};

// Styles CSS complets de l'Accueil
const styles = {
  container: { padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FAFAF9', minHeight: '100vh' },
  imageWrapper: { width: '100%', height: '220px', borderRadius: '24px', marginBottom: '20px', marginTop: '-10px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(20, 83, 45, 0.2)', position: 'relative' },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(20,83,45,0.4) 100%)' },
  header: { textAlign: 'center', marginBottom: '25px', width: '100%' },
  greeting: { fontSize: '28px', color: '#422006', margin: '0 0 5px 0', fontWeight: '800' },
  pseudo: { color: '#D97706' },
  subtitle: { fontSize: '15px', color: '#78350F', margin: 0, fontWeight: '500' },
  introBox: { backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.08)', border: '1px solid #FEF3C7', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  introText: { color: '#52525B', fontSize: '14px', lineHeight: '1.6', margin: 0 },
  sectionTitle: { fontSize: '18px', color: '#422006', marginBottom: '15px', width: '100%', fontWeight: '700' },
  quickAccess: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', paddingBottom: '80px' },
  quickButton: { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', borderRadius: '16px', backgroundColor: '#FFFFFF', color: '#14532D', border: '2px solid #D1FAE5', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease', boxShadow: '0 2px 5px rgba(20, 83, 45, 0.05)' }
};

export default Accueil;