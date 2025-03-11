import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Carregando...</p>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/favorites"
          element={<ProtectedRoute><Favorites /></ProtectedRoute>}
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;