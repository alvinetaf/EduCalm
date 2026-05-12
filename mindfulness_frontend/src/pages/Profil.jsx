// src/pages/Profil.jsx — EduCalm
// Modification : URLs via API centralisée (api.js)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, BookOpen, Award, Activity, Calendar, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { API } from '../config/api'; // ✅

// ─── Graphique SVG léger ──────────────────────────────────────────────────────
const StressGraph = ({ data }) => {
  if (!data || data.length < 2) return (
    <div style={{ textAlign:'center', padding:'32px 0', color:'#94A3B8', fontSize:'14px' }}>
      Fais au moins 2 bilans pour voir ton graphique d'évolution.
    </div>
  );

  const W=500, H=160, PAD={ top:16, right:16, bottom:32, left:32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;

  const points = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top  + innerH - (parseInt(d.score) / 12) * innerH,
    label: d.label, score: d.score, niveau: parseInt(d.stress_level),
  }));

  const pathD = points.map((p, i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${points[points.length-1].x},${PAD.top+innerH} L${points[0].x},${PAD.top+innerH} Z`;
  const dotColor = n => n===1 ? '#14532D' : n===2 ? '#D97706' : '#DC2626';

  const gridLines = [0,4,8,12].map(v => ({
    val: v,
    y: PAD.top + innerH - (v/12)*innerH,
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', overflow:'visible' }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#14532D" />
          <stop offset="100%" stopColor="#14532D" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map(g => (
        <g key={g.val}>
          <line x1={PAD.left} y1={g.y} x2={W-PAD.right} y2={g.y} stroke="#F1F5F9" strokeWidth="1" />
          <text x={PAD.left-6} y={g.y} textAnchor="end" dominantBaseline="central" fontSize="10" fill="#94A3B8">{g.val}</text>
        </g>
      ))}
      <path d={areaD} fill="url(#grad)" opacity="0.15" />
      <path d={pathD} fill="none" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill={dotColor(p.niveau)} stroke="white" strokeWidth="2" />
          <text x={p.x} y={p.y-12} textAnchor="middle" fontSize="10" fill="#422006" fontWeight="700">{p.score}</text>
          <text x={p.x} y={PAD.top+innerH+18} textAnchor="middle" fontSize="9" fill="#94A3B8">{p.label}</text>
        </g>
      ))}
    </svg>
  );
};

const StatBox = ({ label, value, sub, color }) => (
  <div style={{ flex:1, textAlign:'center', padding:'16px 12px', backgroundColor:'#FAFAF9', borderRadius:'14px', border:'1px solid #F3F4F6', minWidth:'80px' }}>
    <p style={{ margin:'0 0 4px 0', fontSize:'24px', fontWeight:'800', color: color||'#422006' }}>{value}</p>
    <p style={{ margin:'0 0 2px 0', fontSize:'12px', color:'#71717A', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</p>
    {sub && <p style={{ margin:0, fontSize:'11px', color:'#94A3B8' }}>{sub}</p>}
  </div>
);

const Profil = () => {
  const [pseudo, setPseudo]       = useState('Élève');
  const [classe, setClasse]       = useState('Non renseignée');
  const [historique, setHistorique] = useState([]);
  const [stats, setStats]         = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const nom   = localStorage.getItem('userPseudo');
    const cl    = localStorage.getItem('userClasse');
    const id    = localStorage.getItem('userId');
    if (nom) setPseudo(nom);
    if (cl && !['undefined','null',''].includes(cl)) setClasse(cl);

    const fetchStats = async () => {
      if (!id) { setChargement(false); return; }
      try {
        // ✅ URL via API centralisée
        const res = await axios.post(API.GET_PROFIL_STAT, { user_id: id });
        if (res.data.success) {
          setHistorique(res.data.historique);
          setStats(res.data.stats);
          setGraphData(res.data.graphData);
        }
      } catch (err) {
        console.error('Erreur stats profil :', err);
      } finally {
        setChargement(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/connexion'); };

  const getStressInfo = (level) => {
    switch (parseInt(level)) {
      case 1: return { texte:'Faible', couleurBg:'#D1FAE5', couleurTexte:'#14532D', dot:'#14532D' };
      case 2: return { texte:'Modéré', couleurBg:'#FEF3C7', couleurTexte:'#D97706', dot:'#D97706' };
      case 3: return { texte:'Élevé',  couleurBg:'#FEE2E2', couleurTexte:'#991B1B', dot:'#991B1B' };
      default: return { texte:'Inconnu', couleurBg:'#F3F4F6', couleurTexte:'#4B5563', dot:'#94A3B8' };
    }
  };

  const tendanceConfig = {
    amelioration: { icon:<TrendingDown size={16} color="#14532D"/>, texte:'En amélioration', color:'#14532D' },
    stable:       { icon:<Minus        size={16} color="#D97706"/>, texte:'Stable',           color:'#D97706' },
    degradation:  { icon:<TrendingUp   size={16} color="#DC2626"/>, texte:'En hausse',        color:'#DC2626' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Mon Profil</h1>
        <p style={styles.pageSubtitle}>Suis ton évolution et gère ton compte.</p>
      </div>

      <div style={styles.twoColumns}>
        {/* GAUCHE */}
        <div style={styles.leftColumn}>
          <div style={styles.avatarCard}>
            <div style={styles.avatarCircle}>
              <span style={styles.avatarInitials}>{pseudo.substring(0,2).toUpperCase()}</span>
            </div>
            <h2 style={styles.name}>{pseudo}</h2>
            <span style={styles.statusBadge}>{stats?.badge || 'Apprenti(e) Jedi de la détente'}</span>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>Mes informations</h3>
            <div style={styles.infoRow}>
              <div style={styles.infoIconWrapper}><BookOpen size={20} color="#D97706" /></div>
              <div style={styles.infoText}>
                <p style={styles.infoLabel}>Classe actuelle</p>
                <p style={styles.infoValue}>{classe}</p>
              </div>
            </div>
            <div style={{ ...styles.infoRow, borderBottom:'none', paddingBottom:0, marginBottom:0 }}>
              <div style={styles.infoIconWrapper}><Award size={20} color="#D97706" /></div>
              <div style={styles.infoText}>
                <p style={styles.infoLabel}>Statut</p>
                <p style={styles.infoValue}>Élève Actif</p>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} /> Me déconnecter
          </button>
        </div>

        {/* DROITE */}
        <div style={styles.rightColumn}>
          {/* Stats rapides */}
          {stats && stats.total_bilans > 0 && (
            <div style={styles.card}>
              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                <StatBox label="Bilans" value={stats.total_bilans} sub="réalisés" />
                <StatBox label="Score moyen" value={stats.score_moyen} sub="sur 12"
                  color={stats.score_moyen<=4?'#14532D':stats.score_moyen<=8?'#D97706':'#DC2626'} />
                <StatBox label="Meilleur score" value={stats.score_min} sub="plus bas = mieux" color="#14532D" />
                {stats.tendance && (
                  <div style={{ flex:1, textAlign:'center', padding:'16px 12px', backgroundColor:'#FAFAF9', borderRadius:'14px', border:'1px solid #F3F4F6', minWidth:'80px' }}>
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:'6px' }}>{tendanceConfig[stats.tendance]?.icon}</div>
                    <p style={{ margin:'0 0 2px 0', fontSize:'13px', fontWeight:'700', color:tendanceConfig[stats.tendance]?.color }}>{tendanceConfig[stats.tendance]?.texte}</p>
                    <p style={{ margin:0, fontSize:'11px', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.4px' }}>Tendance</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Graphique */}
          <div style={styles.card}>
            <div style={styles.historyHeader}>
              <Activity size={22} color="#14532D" />
              <h3 style={styles.sectionTitle}>Mon évolution émotionnelle</h3>
            </div>
            {chargement ? <p style={styles.emptyText}>Chargement...</p> : <StressGraph data={graphData} />}
            {graphData.length >= 2 && (
              <div style={{ display:'flex', gap:'16px', marginTop:'12px', flexWrap:'wrap' }}>
                {[{color:'#14532D',label:'Faible (0–4)'},{color:'#D97706',label:'Modéré (5–8)'},{color:'#DC2626',label:'Élevé (9–12)'}].map(l => (
                  <div key={l.label} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:l.color }} />
                    <span style={{ fontSize:'12px', color:'#71717A' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historique */}
          <div style={styles.card}>
            <div style={styles.historyHeader}>
              <Calendar size={22} color="#14532D" />
              <h3 style={styles.sectionTitle}>Historique des bilans</h3>
            </div>
            {chargement ? (
              <p style={styles.emptyText}>Chargement de ton historique...</p>
            ) : historique.length > 0 ? (
              <div style={styles.historyList}>
                {historique.map((log, i) => {
                  const s = getStressInfo(log.stress_level);
                  return (
                    <div key={i} style={styles.historyItem}>
                      <div style={styles.historyLeft}>
                        <div style={{ ...styles.stressDot, backgroundColor:s.dot }} />
                        <div>
                          <div style={styles.historyDate}><Calendar size={13} style={{ marginRight:'5px' }} />{log.date_fr}</div>
                          <div style={styles.historyScore}>Score : {log.score}/12</div>
                        </div>
                      </div>
                      <span style={{ ...styles.stressBadge, backgroundColor:s.couleurBg, color:s.couleurTexte }}>{s.texte}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>Tu n'as pas encore fait de bilan émotionnel.</p>
                <button onClick={() => navigate('/humeur')} style={styles.linkButton}>Faire mon premier test →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container:      { padding:'40px 48px', backgroundColor:'#FAFAF9', minHeight:'100vh', animation:'fadeIn 0.4s ease' },
  pageHeader:     { marginBottom:'36px' },
  pageTitle:      { fontSize:'32px', color:'#422006', margin:'0 0 8px 0', fontWeight:'800' },
  pageSubtitle:   { fontSize:'15px', color:'#78350F', margin:0, fontWeight:'500' },
  twoColumns:     { display:'grid', gridTemplateColumns:'300px 1fr', gap:'28px', alignItems:'start' },
  leftColumn:     { display:'flex', flexDirection:'column', gap:'20px' },
  rightColumn:    { display:'flex', flexDirection:'column', gap:'20px' },
  avatarCard:     { backgroundColor:'#FFFFFF', borderRadius:'24px', padding:'32px 24px', display:'flex', flexDirection:'column', alignItems:'center', border:'1px solid #FEF3C7', boxShadow:'0 4px 15px rgba(217,119,6,0.06)' },
  avatarCircle:   { width:'96px', height:'96px', borderRadius:'50%', backgroundColor:'#14532D', display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'16px', boxShadow:'0 8px 20px rgba(20,83,45,0.2)', border:'4px solid #D1FAE5' },
  avatarInitials: { fontSize:'32px', color:'#FFFFFF', fontWeight:'800' },
  name:           { fontSize:'24px', color:'#422006', margin:'0 0 10px 0', fontWeight:'800' },
  statusBadge:    { fontSize:'13px', color:'#D97706', fontWeight:'600', backgroundColor:'#FEF3C7', padding:'6px 16px', borderRadius:'20px', textAlign:'center' },
  infoCard:       { backgroundColor:'#FFFFFF', borderRadius:'20px', padding:'24px', border:'1px solid #FEF3C7', boxShadow:'0 4px 15px rgba(217,119,6,0.06)' },
  sectionTitle:   { fontSize:'16px', color:'#14532D', fontWeight:'700', margin:'0 0 20px 0' },
  infoRow:        { display:'flex', alignItems:'center', marginBottom:'16px', borderBottom:'1px solid #F3F4F6', paddingBottom:'16px' },
  infoIconWrapper:{ width:'42px', height:'42px', borderRadius:'12px', backgroundColor:'#FEF3C7', display:'flex', justifyContent:'center', alignItems:'center', marginRight:'14px', flexShrink:0 },
  infoText:       { display:'flex', flexDirection:'column' },
  infoLabel:      { margin:'0 0 2px 0', fontSize:'11px', color:'#71717A', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px' },
  infoValue:      { margin:0, fontSize:'15px', color:'#422006', fontWeight:'700' },
  logoutButton:   { width:'100%', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', padding:'16px', borderRadius:'14px', backgroundColor:'#FEE2E2', color:'#991B1B', border:'2px solid #FCA5A5', fontSize:'15px', fontWeight:'700', cursor:'pointer' },
  card:           { backgroundColor:'#FFFFFF', borderRadius:'24px', padding:'28px', border:'1px solid #FEF3C7', boxShadow:'0 4px 15px rgba(217,119,6,0.06)' },
  historyHeader:  { display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' },
  historyList:    { display:'flex', flexDirection:'column', gap:'10px' },
  historyItem:    { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', backgroundColor:'#FAFAF9', borderRadius:'12px', border:'1px solid #F3F4F6' },
  historyLeft:    { display:'flex', alignItems:'center', gap:'14px' },
  stressDot:      { width:'10px', height:'10px', borderRadius:'50%', flexShrink:0 },
  historyDate:    { fontSize:'13px', color:'#52525B', display:'flex', alignItems:'center', fontWeight:'500', marginBottom:'2px' },
  historyScore:   { fontSize:'13px', color:'#422006', fontWeight:'700' },
  stressBadge:    { padding:'5px 12px', borderRadius:'12px', fontSize:'12px', fontWeight:'700' },
  emptyState:     { textAlign:'center', padding:'24px 0' },
  emptyText:      { color:'#71717A', fontSize:'14px', marginBottom:'16px' },
  linkButton:     { backgroundColor:'transparent', border:'none', color:'#D97706', fontWeight:'700', fontSize:'14px', textDecoration:'underline', cursor:'pointer' },
};

export default Profil;