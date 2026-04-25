import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Connexion = () => {
  const [formData, setFormData] = useState({ pseudo: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost/mindfulness_backend/login.php', formData);
      
      if (response.data.success) {
        setIsError(false);
        setMessage("Connexion réussie ! Redirection...");
        
        // 💾 On sauvegarde le pseudo et la classe de l'élève dans la mémoire du navigateur !
        localStorage.setItem('userPseudo', response.data.user.pseudo);
        localStorage.setItem('userClasse', response.data.user.classe);
        localStorage.setItem('userId', response.data.user.id);
        
        // On l'envoie vers la page d'accueil après 1.5 seconde
        setTimeout(() => navigate('/'), 1500);
      } else {
        setIsError(true);
        setMessage(response.data.message); // Affiche "Mot de passe incorrect" ou "Pseudo n'existe pas"
      }
    } catch (error) {
      console.error("Erreur:", error);
      setIsError(true);
      setMessage("Impossible de joindre le serveur. XAMPP est-il allumé ?");
    }
  };

  return (
    <div style={styles.container}>
      {/* Le fond d'écran apaisant */}
      <img 
        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop" 
        alt="Fond Brume" 
        style={styles.bgImage} 
      />

      <div style={styles.formCard}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <div style={{ backgroundColor: '#14532D', padding: '10px', borderRadius: '12px' }}>
            <Leaf size={24} color="#FFFFFF" />
          </div>
        </div>
        
        <h1 style={styles.title}>Bon retour !</h1>
        <p style={styles.subtitle}>Connecte-toi à ton espace EduCalm.</p>

        {message && (
          <div style={{ 
            ...styles.messageBox, 
            backgroundColor: isError ? '#FEE2E2' : '#D1FAE5',
            color: isError ? '#991B1B' : '#14532D',
            borderColor: isError ? '#FCA5A5' : '#A7F3D0'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            name="pseudo" 
            placeholder="Ton Pseudo" 
            value={formData.pseudo} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />

          <button type="submit" style={styles.submitButton}>
            Me connecter
          </button>
        </form>

        <p style={styles.footerText}>
          Nouveau ici ? <Link to="/inscription" style={styles.link}>Crée ton compte</Link>
        </p>
      </div>
    </div>
  );
};

// Styles CSS
const styles = {
  container: { position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#14532D', padding: '20px' },
  bgImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, zIndex: 0 },
  formCard: { zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px 20px', borderRadius: '24px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', textAlign: 'center', backdropFilter: 'blur(10px)' },
  title: { margin: '0 0 5px 0', color: '#14532D', fontSize: '24px', fontWeight: '800' },
  subtitle: { margin: '0 0 20px 0', color: '#78350F', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' },
  input: { width: '100%', boxSizing: 'border-box', padding: '15px', borderRadius: '12px', border: '1px solid #D1FAE5', backgroundColor: '#FAFAF9', fontSize: '15px', outline: 'none', color: '#422006' },
  submitButton: { width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#14532D', color: '#FFFFFF', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px', boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)' },
  messageBox: { padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', border: '1px solid' },
  footerText: { marginTop: '20px', fontSize: '14px', color: '#52525B' },
  link: { color: '#14532D', fontWeight: 'bold', textDecoration: 'none' }
};

export default Connexion;