import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/auth';
import '../styles.css'; // Certifique-se de importar o CSS

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 className="logo">CineFlow</h1>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        {user ? (
          <>
            <Link to="/favorites" className="nav-link">Favoritos</Link>
            <button onClick={handleLogout} className="logout-btn">Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Registrar</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;