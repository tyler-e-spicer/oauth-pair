import React, { useState } from 'react';
import './Login.css';
import useFetch from './useFetch';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, error, data, sendRequest } = useFetch();
  const serverURL = 'http://localhost:3001'

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(serverURL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    console.log('response', data.message);
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  const handleOAuth = (e) => {
    e.preventDefault();
    console.log('OAuth Activate!')
  }

return (
  <div className="login-container">
    <h1>Login</h1>
    <form onSubmit={handleLogin} className="form">
      <label className="label">
        Username:
        <input
          className="input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="label">
        Password:
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="button" type="submit">Login</button>
    </form>
    <button className="oauth-button" onClick={handleOAuth} type="submit">Login With Google!</button>
  </div>
);
}

export default Login;
