import { auth } from '../firebase'; // Importa o auth inicializado
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuário registrado:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao registrar:', error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário logado:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao logar:', error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('Usuário deslogado');
  } catch (error) {
    console.error('Erro ao deslogar:', error.message);
    throw error;
  }
};

export { auth }; // Exporta para o AuthContext