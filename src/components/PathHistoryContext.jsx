import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PathHistoryContext = createContext();

export const PathHistoryProvider = ({ children }) => {
  const location = useLocation();
  const [pathHistory, setPathHistory] = useState([]);

  useEffect(() => {
    setPathHistory((prev) => [...prev, location.pathname]);
  }, [location]);

  return (
    <PathHistoryContext.Provider value={{ pathHistory }}>
      {children}
    </PathHistoryContext.Provider>
  );
};
