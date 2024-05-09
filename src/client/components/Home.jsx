import React, { useContext } from 'react';

import { AuthContext } from '../providers/AuthContextProvider';
import Dashboard from './Dashboard';
import BadLogin from './BadLogin';

export default function Home() {
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn === true) return <Dashboard />;
  if (loggedIn === false) return <BadLogin />;
  return <></>;
}
