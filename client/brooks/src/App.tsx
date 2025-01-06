import React, { Suspense } from 'react';
import './App.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import RegistrationScreen from './components/RegistrationScreen/RegistrationScreen';
import LoginScreen from './components/LoginScreen/LoginScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar/Navbar';

function AppContent() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();


  const handleError = (error: string) => {
    // Handle error logic here
    console.error('Error occurred:', error);
  };

  const handleLogout = () => {
    setUser(null); // Clear user from context
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="App">
      {user && <Navbar onLogout={handleLogout} />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginScreen onError={handleError} />} />
          <Route path="/register" element={<RegistrationScreen onError={handleError} />} />
          <Route path="/profile" element={<ProfileScreen />} />
          {/*<Route path="/" element={<HomeFeedScreen />} />*/}
          {/*<Route path="/post/create" element={<PostCreationScreen />} />*/}
          {/*<Route path="/discover" element={<DiscoverScreen />} />*/}
          {/*<Route path="/post/:id" element={<PostDetailScreen />} />*/}
          {/*<Route path="/profile/edit" element={<EditProfileScreen />} />*/}
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
