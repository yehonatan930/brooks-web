import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  email: string;

}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setEmail = (email: string) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, email } : { email, username: '' }));
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