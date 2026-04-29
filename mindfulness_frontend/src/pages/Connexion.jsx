import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import './Connexion.css'; 

const Connexion = () => {
  const [formData, setFormData] = useState({ pseudo: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost/mindfulness_backend/login.php', formData);

      if (response.data.success) {
        setIsError(false);
        setMessage("Connexion réussie ! Redirection...");

        localStorage.setItem('userPseudo', response.data.user.pseudo);
        localStorage.setItem('userClasse', response.data.user.classe);
        localStorage.setItem('userId', response.data.user.id);

        setTimeout(() => navigate('/'), 1500);
      } else {
        setIsError(true);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setIsError(true);
      setMessage("Impossible de joindre le serveur. XAMPP est-il allumé ?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="connexion-page">
      {/* Panneau gauche — visuel (Masqué sur mobile) */}
      <div className="left-panel">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop"
          alt="Fond Brume"
          className="bg-image"
        />
        <div className="left-overlay">
          <div className="brand-block">
            <div className="logo-icon">
              <Leaf size={28} color="#FFFFFF" />
            </div>
            <h1 className="brand-name">
              Edu<span style={{ color: '#D97706' }}>Calm</span>
            </h1>
            <p className="brand-tagline">
              Ton espace de sérénité scolaire.
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire (Plein écran sur mobile) */}
      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="title">Bon retour ! 👋</h2>
          <p className="subtitle">Connecte-toi à ton espace EduCalm.</p>

          {message && (
            <div 
              className="message-box"
              style={{
                backgroundColor: isError ? '#FEE2E2' : '#D1FAE5',
                color: isError ? '#991B1B' : '#14532D',
                borderColor: isError ? '#FCA5A5' : '#A7F3D0',
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="field-group">
              <label className="label">Pseudo</label>
              <input
                type="text"
                name="pseudo"
                placeholder="Ton pseudo"
                value={formData.pseudo}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div className="field-group">
              <label className="label">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              style={{ opacity: isLoading ? 0.7 : 1 }}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Me connecter'}
            </button>
          </form>

          <p className="footer-text">
            Nouveau ici ?{' '}
            <Link to="/inscription" className="link-text">Crée ton compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connexion;