import React, { Suspense } from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import RegistrationScreen from './components/RegistrationScreen/RegistrationScreen';
import LoginScreen from './components/LoginScreen/LoginScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import Navbar from './components/Navbar/Navbar';
import EditProfileScreen from './components/EditProfileScreen/EditProfileScreen';
import FeedScreen from './components/FeedScreen/FeedScreen';
import CreatePostScreen from './components/CreatePostScreen/CreatePostScreen';
import LoggedInUserGuard from './components/LoggedInUserGuard/LoggedInUserGuard';
import './styles/globalStyles.scss';
import { Provider, createStore } from 'jotai';
// import { DevTools } from 'jotai-devtools';
// import 'jotai-devtools/styles.css';

const customStore = createStore();

function App() {
  return (
    <Provider store={customStore}>
      <div className="App">
        <LoggedInUserGuard>
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegistrationScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/post/create" element={<CreatePostScreen />} />
              <Route path="/feed" element={<FeedScreen />} />
              {/*<Route path="/post/:id" element={<PostDetailScreen />} />*/}
              <Route path="/profile/edit" element={<EditProfileScreen />} />
            </Routes>
          </Suspense>
        </LoggedInUserGuard>
      </div>
    </Provider>
  );
}

export default App;
