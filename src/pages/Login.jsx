import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import '../styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erro anterior
    try {
      await login(email, password);
      navigate('/'); // Redireciona para Home após sucesso
    } catch (err) {
      setError(err.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
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
            placeholder="Digite sua senha"
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-btn">Entrar</button>
      </form>
      <p className="auth-link">
        Não tem uma conta? <a href="/register" className="link">Registre-se</a>
      </p>
    </div>
  );
}

export default Login;