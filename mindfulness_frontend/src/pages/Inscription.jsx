import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Inscription = () => {
  const [formData, setFormData] = useState({ pseudo: '', password: '', age: '', classe: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost/mindfulness_backend/register.php', formData);
      setMessage(response.data.message);
      
      if (response.data.success) {
        setIsSuccess(true);
        // Si ça marche, on le redirige vers la connexion après 2 secondes
        setTimeout(() => navigate('/connexion'), 2000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Impossible de joindre le serveur. XAMPP est-il allumé ?");
      setIsSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Le fond d'écran apaisant */}
      <img 
        src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1000&auto=format&fit=crop" 
        alt="Fond Forêt" 
        style={styles.bgImage} 
      />

      <div style={styles.formCard}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <div style={{ backgroundColor: '#14532D', padding: '10px', borderRadius: '12px' }}>
            <Leaf size={24} color="#FFFFFF" />
          </div>
        </div>
        
        <h1 style={styles.title}>Rejoins EduCalm</h1>
        <p style={styles.subtitle}>Crée ton espace de sérénité.</p>

        {message && (
          <div style={{ 
            ...styles.messageBox, 
            backgroundColor: isSuccess ? '#D1FAE5' : '#FEE2E2',
            color: isSuccess ? '#14532D' : '#991B1B',
            borderColor: isSuccess ? '#A7F3D0' : '#FCA5A5'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="pseudo" placeholder="Ton Pseudo (obligatoire)" value={formData.pseudo} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Mot de passe (obligatoire)" value={formData.password} onChange={handleChange} required style={styles.input} />
          
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input type="number" name="age" placeholder="Âge" value={formData.age} onChange={handleChange} style={{...styles.input, flex: 1}} />
            <input type="text" name="classe" placeholder="Classe (ex: 3ème A)" value={formData.classe} onChange={handleChange} style={{...styles.input, flex: 2}} />
          </div>

          <button type="submit" style={styles.submitButton}>
            Créer mon compte
          </button>
        </form>

        <p style={styles.footerText}>
          Tu as déjà un compte ? <Link to="/connexion" style={styles.link}>Connecte-toi ici</Link>
        </p>
      </div>
    </div>
  );
};

// Styles CSS de la page d'inscription
const styles = {
  container: { position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#14532D', padding: '20px' },
  bgImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, zIndex: 0 },
  formCard: { zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px 20px', borderRadius: '24px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', textAlign: 'center', backdropFilter: 'blur(10px)' },
  title: { margin: '0 0 5px 0', color: '#14532D', fontSize: '24px', fontWeight: '800' },
  subtitle: { margin: '0 0 20px 0', color: '#78350F', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' },
  input: { width: '100%', boxSizing: 'border-box', padding: '15px', borderRadius: '12px', border: '1px solid #D1FAE5', backgroundColor: '#FAFAF9', fontSize: '14px', outline: 'none', color: '#422006' },
  submitButton: { width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#D97706', color: '#FFFFFF', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)' },
  messageBox: { padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', border: '1px solid' },
  footerText: { marginTop: '20px', fontSize: '13px', color: '#52525B' },
  link: { color: '#D97706', fontWeight: 'bold', textDecoration: 'none' }
};

export default Inscription;