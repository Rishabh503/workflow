'use client'; 

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/subjects/user');
        const data = await res.json();
        setUser(data);
        console.log("user ka data",data)
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
