import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
  email: string;
  profilePicture: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setEmail = (email: string) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, email } : { email, username: '', profilePicture: '' }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};