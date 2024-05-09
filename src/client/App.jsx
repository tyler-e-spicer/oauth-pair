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

import Dashboard from './components/Dashboard';

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const Login = () => {
  const handleLogin = async () => {
    console.log('firing handle login');
    try {
      // Gets authentication url from backend server
      const clientId = import.meta.env.GOOGLE_CLIENT_ID;
      console.log('clientId: ', clientId);
      const redirectURI = import.meta.env.REDIRECT_URL;
      console.log('redirectURI: ', redirectURI);
      const {
        data: { url },
      } = await axios.get(`${config.serverUrl}/auth/url`, {
        params: {
          client_id: clientId,
          redirect_uri: redirectURI,
        },
      });
      // Navigate to consent screen
      window.location.assign(url);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <h3>Login to Dashboard</h3>
      <button className="btn" onClick={handleLogin}>
        Login
      </button>
    </>
  );
};

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

const Home = () => {
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn === true) return <Dashboard />;
  if (loggedIn === false) return <Login />;
  return <></>;
};

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Home />,
//   },
//   {
//     path: '/auth/callback', // google will redirect here
//     element: <Callback />,
//   },
// ])

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
