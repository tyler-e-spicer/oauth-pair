import React from 'react';
import axios from 'axios';

import config from '../util/config';

const BadLogin = () => {
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

export default BadLogin;
