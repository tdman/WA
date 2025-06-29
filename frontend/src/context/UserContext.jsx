// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { userId, name, token }
  const [isLoggedIn , setIsLoggedIn ] = useState(false); // { userId, name, token }
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    console.log('storedUser', storedUser);
    setIsLoading(false);
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
    
  }, []);

  const login = (userData) => {

    console.log('userData', userData);
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoggedIn, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
