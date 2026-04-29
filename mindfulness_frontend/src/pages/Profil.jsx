import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, BookOpen, Award, Activity, Calendar } from 'lucide-react';

const Profil = () => {
  const [pseudo, setPseudo] = useState('Élève');
  const [classe, setClasse] = useState('Non renseignée');
  const [historique, setHistorique] = useState([]);
  const [chargementStats, setChargementStats] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const nomSauvegarde = localStorage.getItem('userPseudo');
    const classeSauvegarde = localStorage.getItem('userClasse');
    const idSauvegarde = localStorage.getItem('userId');

    if (nomSauvegarde) setPseudo(nomSauvegarde);
    if (classeSauvegarde && classeSauvegarde !== 'undefined' && classeSauvegarde !== 'null' && classeSauvegarde !== '') {
      setClasse(classeSauvegarde);
    }

    const fetchStats = async () => {
      if (idSauvegarde) {
        try {
          const response = await axios.post('http://localhost/mindfulness_backend/get_profil_stat.php', {
            user_id: idSauvegarde,
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

  const getStressInfo = (level) => {
    switch (parseInt(level)) {
      case 1: return { texte: 'Faible', couleurBg: '#D1FAE5', couleurTexte: '#14532D', dot: '#14532D' };
      case 2: return { texte: 'Modéré', couleurBg: '#FEF3C7', couleurTexte: '#D97706', dot: '#D97706' };
      case 3: return { texte: 'Élevé', couleurBg: '#FEE2E2', couleurTexte: '#991B1B', dot: '#991B1B' };
      default: return { texte: 'Inconnu', couleurBg: '#F3F4F6', couleurTexte: '#4B5563', dot: '#94A3B8' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Mon Profil</h1>
        <p style={styles.pageSubtitle}>Suis ton évolution et gère ton compte.</p>
      </div>

      <div style={styles.twoColumns}>

        {/* COLONNE GAUCHE */}
        <div style={styles.leftColumn}>

          {/* Avatar card */}
          <div style={styles.avatarCard}>
            <div style={styles.avatarCircle}>
              <span style={styles.avatarInitials}>
                {pseudo.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <h2 style={styles.name}>{pseudo}</h2>
            <span style={styles.statusBadge}>Apprenti(e) Jedi de la détente</span>
          </div>

          {/* Info card */}
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

            <div style={{ ...styles.infoRow, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
              <div style={styles.infoIconWrapper}>
                <Award size={20} color="#D97706" />
              </div>
              <div style={styles.infoText}>
                <p style={styles.infoLabel}>Statut</p>
                <p style={styles.infoValue}>Élève Actif</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} />
            Me déconnecter
          </button>
        </div>

        {/* COLONNE DROITE */}
        <div style={styles.rightColumn}>
          <div style={styles.historyCard}>
            <div style={styles.historyHeader}>
              <Activity size={22} color="#14532D" />
              <h3 style={styles.sectionTitle}>Mon évolution émotionnelle</h3>
            </div>

            {chargementStats ? (
              <p style={styles.emptyText}>Chargement de ton historique...</p>
            ) : historique.length > 0 ? (
              <div style={styles.historyList}>
                {historique.map((log, index) => {
                  const stressStyle = getStressInfo(log.stress_level);
                  return (
                    <div key={index} style={styles.historyItem}>
                      <div style={styles.historyLeft}>
                        <div style={{ ...styles.stressDot, backgroundColor: stressStyle.dot }} />
                        <div>
                          <div style={styles.historyDate}>
                            <Calendar size={13} style={{ marginRight: '5px' }} />
                            {log.date_fr}
                          </div>
                          <div style={styles.historyScore}>Score : {log.score}/12</div>
                        </div>
                      </div>
                      <span style={{
                        ...styles.stressBadge,
                        backgroundColor: stressStyle.couleurBg,
                        color: stressStyle.couleurTexte,
                      }}>
                        {stressStyle.texte}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>Tu n'as pas encore fait de bilan émotionnel.</p>
                <button onClick={() => navigate('/humeur')} style={styles.linkButton}>
                  Faire mon premier test →
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 48px',
    backgroundColor: '#FAFAF9',
    minHeight: '100vh',
    animation: 'fadeIn 0.4s ease',
  },
  pageHeader: {
    marginBottom: '36px',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#422006',
    margin: '0 0 8px 0',
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#78350F',
    margin: 0,
    fontWeight: '500',
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '28px',
    alignItems: 'start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  /* Avatar */
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #FEF3C7',
    boxShadow: '0 4px 15px rgba(217, 119, 6, 0.06)',
  },
  avatarCircle: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: '#14532D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
    boxShadow: '0 8px 20px rgba(20, 83, 45, 0.2)',
    border: '4px solid #D1FAE5',
  },
  avatarInitials: {
    fontSize: '32px',
    color: '#FFFFFF',
    fontWeight: '800',
  },
  name: {
    fontSize: '24px',
    color: '#422006',
    margin: '0 0 10px 0',
    fontWeight: '800',
  },
  statusBadge: {
    fontSize: '13px',
    color: '#D97706',
    fontWeight: '600',
    backgroundColor: '#FEF3C7',
    padding: '6px 16px',
    borderRadius: '20px',
  },

  /* Info card */
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #FEF3C7',
    boxShadow: '0 4px 15px rgba(217, 119, 6, 0.06)',
  },
  sectionTitle: {
    fontSize: '16px',
    color: '#14532D',
    fontWeight: '700',
    margin: '0 0 20px 0',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #F3F4F6',
    paddingBottom: '16px',
  },
  infoIconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#FEF3C7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '14px',
    flexShrink: 0,
  },
  infoText: { display: 'flex', flexDirection: 'column' },
  infoLabel: {
    margin: '0 0 2px 0',
    fontSize: '11px',
    color: '#71717A',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    margin: 0,
    fontSize: '15px',
    color: '#422006',
    fontWeight: '700',
  },

  /* Logout */
  logoutButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    padding: '16px',
    borderRadius: '14px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    border: '2px solid #FCA5A5',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },

  /* History */
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid #FEF3C7',
    boxShadow: '0 4px 15px rgba(217, 119, 6, 0.06)',
  },
  historyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    backgroundColor: '#FAFAF9',
    borderRadius: '12px',
    border: '1px solid #F3F4F6',
  },
  historyLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  stressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  historyDate: {
    fontSize: '13px',
    color: '#52525B',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    marginBottom: '2px',
  },
  historyScore: {
    fontSize: '13px',
    color: '#422006',
    fontWeight: '700',
  },
  stressBadge: {
    padding: '5px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px 0',
  },
  emptyText: {
    color: '#71717A',
    fontSize: '14px',
    marginBottom: '16px',
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#D97706',
    fontWeight: '700',
    fontSize: '14px',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default Profil;
