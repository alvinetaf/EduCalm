import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, LogOut, BookOpen, Award, Activity, Calendar } from 'lucide-react';

const Profil = () => {
  const [pseudo, setPseudo] = useState('Élève');
  const [classe, setClasse] = useState('Non renseignée');
  const [historique, setHistorique] = useState([]);
  const [chargementStats, setChargementStats] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Récupération des infos de base
    const nomSauvegarde = localStorage.getItem('userPseudo');
    const classeSauvegarde = localStorage.getItem('userClasse');
    const idSauvegarde = localStorage.getItem('userId');
    
    if (nomSauvegarde) setPseudo(nomSauvegarde);
    if (classeSauvegarde && classeSauvegarde !== 'undefined' && classeSauvegarde !== 'null' && classeSauvegarde !== '') {
      setClasse(classeSauvegarde);
    }

    // 2. Récupération de l'historique depuis PHP
    const fetchStats = async () => {
      if (idSauvegarde) {
        try {
          const response = await axios.post('http://localhost/mindfulness_backend/get_profil_stat.php', {
            user_id: idSauvegarde
          });
          
          if (response.data.success) {
            setHistorique(response.data.historique);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des stats :", error);
        } finally {
          setChargementStats(false);
        }
      } else {
        setChargementStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/connexion');
  };

  // Fonction pour donner un style et un texte selon le niveau de stress
  const getStressInfo = (level) => {
    switch(parseInt(level)) {
      case 1: return { texte: 'Faible', couleurBg: '#D1FAE5', couleurTexte: '#14532D' };
      case 2: return { texte: 'Modéré', couleurBg: '#FEF3C7', couleurTexte: '#D97706' };
      case 3: return { texte: 'Élevé', couleurBg: '#FEE2E2', couleurTexte: '#991B1B' };
      default: return { texte: 'Inconnu', couleurBg: '#F3F4F6', couleurTexte: '#4B5563' };
    }
  };

  return (
    <div style={styles.container}>
      {/* L'en-tête du profil */}
      <div style={styles.header}>
        <div style={styles.avatarCircle}>
          <User size={50} color="#FFFFFF" />
        </div>
        <h1 style={styles.name}>{pseudo}</h1>
        <p style={styles.status}>Apprenti(e) Jedi de la détente</p>
      </div>

      {/* Les informations de l'élève */}
      <div style={styles.infoCard}>
        <h3 style={styles.sectionTitle}>Mes informations</h3>
        
        <div style={styles.infoRow}>
          <div style={styles.infoIconWrapper}>
            <BookOpen size={20} color="#D97706" />
          </div>
          <div style={styles.infoText}>
            <p style={styles.infoLabel}>Classe actuelle</p>
            <p style={styles.infoValue}>{classe}</p>
          </div>
        </div>

        <div style={{...styles.infoRow, borderBottom: 'none', paddingBottom: 0, marginBottom: 0}}>
          <div style={styles.infoIconWrapper}>
            <Award size={20} color="#D97706" />
          </div>
          <div style={styles.infoText}>
            <p style={styles.infoLabel}>Statut</p>
            <p style={styles.infoValue}>Élève Actif</p>
          </div>
        </div>
      </div>

      {/* L'Historique Émotionnel */}
      <div style={styles.infoCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Activity size={22} color="#14532D" />
          <h3 style={{...styles.sectionTitle, margin: 0}}>Mon évolution</h3>
        </div>

        {chargementStats ? (
          <p style={styles.emptyText}>Chargement de ton historique...</p>
        ) : historique.length > 0 ? (
          <div style={styles.historyList}>
            {historique.map((log, index) => {
              const stressStyle = getStressInfo(log.stress_level);
              return (
                <div key={index} style={styles.historyItem}>
                  <div style={styles.historyDate}>
                    <Calendar size={14} style={{ marginRight: '5px' }} />
                    {log.date_fr}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={styles.historyScore}>Score: {log.score}/12</span>
                    <span style={{
                      ...styles.stressBadge, 
                      backgroundColor: stressStyle.couleurBg, 
                      color: stressStyle.couleurTexte
                    }}>
                      {stressStyle.texte}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Tu n'as pas encore fait de bilan émotionnel.</p>
            <button onClick={() => navigate('/humeur')} style={styles.linkButton}>
              Faire mon premier test
            </button>
          </div>
        )}
      </div>

      {/* Le bouton de déconnexion */}
      <button onClick={handleLogout} style={styles.logoutButton}>
        <LogOut size={20} />
        Me déconnecter
      </button>
    </div>
  );
};

// Styles CSS mis à jour
const styles = {
  container: { padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FAFAF9', minHeight: '100vh', paddingBottom: '100px' },
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '30px', marginTop: '10px' },
  avatarCircle: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#14532D', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', boxShadow: '0 10px 25px rgba(20, 83, 45, 0.2)', border: '4px solid #D1FAE5' },
  name: { fontSize: '28px', color: '#422006', margin: '0 0 5px 0', fontWeight: '800' },
  status: { fontSize: '14px', color: '#D97706', margin: 0, fontWeight: '600', backgroundColor: '#FEF3C7', padding: '5px 15px', borderRadius: '20px' },
  
  infoCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '25px', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.08)', border: '1px solid #FEF3C7', marginBottom: '30px', boxSizing: 'border-box' },
  sectionTitle: { fontSize: '18px', color: '#14532D', fontWeight: '700' },
  
  infoRow: { display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F3F4F6', paddingBottom: '15px' },
  infoIconWrapper: { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#FEF3C7', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px' },
  infoText: { display: 'flex', flexDirection: 'column' },
  infoLabel: { margin: '0 0 3px 0', fontSize: '12px', color: '#71717A', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { margin: 0, fontSize: '16px', color: '#422006', fontWeight: '700' },
  
  // Nouveaux styles pour l'historique
  historyList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#FAFAF9', borderRadius: '12px', border: '1px solid #F3F4F6' },
  historyDate: { fontSize: '13px', color: '#52525B', display: 'flex', alignItems: 'center', fontWeight: '500' },
  historyScore: { fontSize: '13px', color: '#422006', fontWeight: 'bold' },
  stressBadge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  emptyState: { textAlign: 'center', padding: '10px 0' },
  emptyText: { color: '#71717A', fontSize: '14px', marginBottom: '15px' },
  linkButton: { backgroundColor: 'transparent', border: 'none', color: '#D97706', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' },
  
  logoutButton: { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '18px', borderRadius: '16px', backgroundColor: '#FEE2E2', color: '#991B1B', border: '2px solid #FCA5A5', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }
};

export default Profil;