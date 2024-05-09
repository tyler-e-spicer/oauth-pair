import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import { AuthContextProvider } from './providers/AuthContextProvider';

import Home from './components/Home';
import Callback from './components/Callback';

// Ensures cookie is sent
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <AuthContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/callback" element={<Callback />} />
            </Routes>
          </Router>
        </AuthContextProvider>
      </header>
    </div>
  );
}

export default App;
