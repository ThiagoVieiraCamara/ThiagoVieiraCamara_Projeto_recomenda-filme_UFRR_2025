import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import '../styles.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erro anterior
    try {
      await register(email, password);
      navigate('/login'); // Redireciona para login após sucesso
    } catch (err) {
      setError(err.message || 'Falha no registro. Tente novamente.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Registrar</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            placeholder="Digite seu email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
            placeholder="Crie uma senha"
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-btn">Registrar</button>
      </form>
      <p className="auth-link">
        Já tem uma conta? <a href="/login" className="link">Faça login</a>
      </p>
    </div>
  );
}

export default Register;