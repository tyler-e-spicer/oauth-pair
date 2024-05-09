import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useRef, useContext } from 'react';

import config from './util/config';
import {
  AuthContext,
  AuthContextProvider,
} from './providers/AuthContextProvider';

// import Dashboard from './components/Dashboard';
import Home from './components/Home';

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const Callback = () => {
  const called = useRef(false);
  const { checkLoginState, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // ;
      if (loggedIn === false) {
        try {
          if (called.current) return; // prevent rerender caused by StrictMode
          called.current = true;
          const res = await axios.get(
            `${config.serverUrl}/auth/token${window.location.search}`
          );
          console.log('response: ', res);
          checkLoginState();
          navigate('/');
        } catch (err) {
          console.error(err);
          navigate('/');
        }
      } else if (loggedIn === true) {
        navigate('/');
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
};

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
