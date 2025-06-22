import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await axios.post('/login', { email, password });
    setUser(data.user);
    return data.token; 
  };

 const logout = async () => {
  await axios.post('/logout');
  localStorage.removeItem('token'); 
  setUser(null);
 };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
