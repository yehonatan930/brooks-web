import React, {Suspense} from 'react';
import './App.scss';
import {Route, Routes} from "react-router-dom";
import RegistrationScreen from "./components/RegistrationScreen/RegistrationScreen";

function App() {
  const handleRegister = (email: string, password: string) => {
    // Handle registration logic here
    console.log('Registering user:', email, password);
  };

  const handleError = (error: string) => {
    // Handle error logic here
    console.error('Error occurred:', error);
  };

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/*<Route path="/" element={<HomeFeedScreen />} />*/}
          {/*<Route path="/login" element={<LoginScreen />} />*/}
          <Route path="/register" element={<RegistrationScreen onRegister={handleRegister} onError={handleError}/>} />
          {/*<Route path="/post/create" element={<PostCreationScreen />} />*/}
          {/*<Route path="/profile" element={<ProfileScreen />} />*/}
          {/*<Route path="/discover" element={<DiscoverScreen />} />*/}
          {/*<Route path="/post/:id" element={<PostDetailScreen />} />*/}
          {/*<Route path="/profile/edit" element={<EditProfileScreen />} />*/}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
