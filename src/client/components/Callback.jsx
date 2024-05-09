import React, { useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import config from '../util/config';
import { AuthContext } from '../providers/AuthContextProvider';

export default function Callback() {
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
}
