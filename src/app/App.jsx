import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const serverUrl = 'http://localhost:3001';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user },
      } = await axios.get(`${serverUrl}/auth/logged_in`);
      setLoggedIn(logged_in);
      user && setUser(user);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]); // add what it depends on as best practice

  return (
    <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const Dashboard = () => {
  const { user, loggedIn, checkLoginState } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      // ;
      if (loggedIn === true) {
        try {
          // Get posts from server
          const {
            data: { posts },
          } = await axios.get(`${serverUrl}/user/posts`);
          setPosts(posts);
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [loggedIn]);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/auth/logout`);
      // Check login state again
      checkLoginState();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h3>Dashboard</h3>
      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
      <h4>{user?.name}</h4>
      <br />
      <p>{user?.email}</p>
      <br />
      <img src={user?.picture} alt={user?.name} />
      <br />
      <div>
        {posts.map((post, idx) => (
          <div key={idx}>
            <h5>{post?.title}</h5>
            <p>{post?.body}</p>
          </div>
        ))}
      </div>
    </>
  );
};

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
      } = await axios.get(`${serverUrl}/auth/url`, {
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
            `${serverUrl}/auth/token${window.location.search}`
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
