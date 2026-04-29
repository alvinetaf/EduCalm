import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import './Inscription.css'; // On importe le CSS ici !

const Inscription = () => {
  const [formData, setFormData] = useState({ pseudo: '', password: '', age: '', classe: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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
      const response = await axios.post('http://localhost/mindfulness_backend/register.php', formData);
      setMessage(response.data.message);

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/connexion'), 2000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Impossible de joindre le serveur. XAMPP est-il allumé ?");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inscription-page">
      {/* Panneau gauche — visuel (Masqué sur mobile) */}
      <div className="left-panel">
        <img
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop"
          alt="Fond Forêt"
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
              Rejoins des milliers d'élèves qui apprennent à gérer leur stress.
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire (Plein écran sur mobile) */}
      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="title">Rejoins EduCalm 🌿</h2>
          <p className="subtitle">Crée ton espace de sérénité en quelques secondes.</p>

          {message && (
            <div 
              className="message-box"
              style={{
                backgroundColor: isSuccess ? '#D1FAE5' : '#FEE2E2',
                color: isSuccess ? '#14532D' : '#991B1B',
                borderColor: isSuccess ? '#A7F3D0' : '#FCA5A5',
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="field-group">
              <label className="label">Pseudo *</label>
              <input
                type="text"
                name="pseudo"
                placeholder="Ton pseudo unique"
                value={formData.pseudo}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label className="label">Mot de passe *</label>
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

            <div className="form-row">
              <div className="field-group" style={{ flex: 1 }}>
                <label className="label">Âge</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Ex : 15"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="field-group" style={{ flex: 2 }}>
                <label className="label">Classe</label>
                <select
                  name="classe"
                  value={formData.classe}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="" disabled>Choisis ta classe</option>
                  
                  <option value="Seconde">Seconde</option>
                  <option value="Première">Première</option>
                  <option value="Terminale">Terminale</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              style={{ opacity: isLoading ? 0.7 : 1 }}
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="footer-text">
            Tu as déjà un compte ?{' '}
            <Link to="/connexion" className="link-text">Connecte-toi ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;