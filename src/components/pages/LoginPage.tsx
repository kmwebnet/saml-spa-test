import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import { useLogin } from '../../AuthUserContext';

const url = window.location.origin;

const LoginPage = () => {

  const [userId, setUserId] = useState('');
  const login = useLogin();

  const handleLogin = () => {
    login(userId);
  };

  return (
    <div>
      <h1>ログイン</h1>
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <Button onClick={handleLogin}>送信</Button>
      <Button onClick={() => window.location.replace(url + "/slogin")}>シングルサインオン</Button>
    </div>
  );
};

export default LoginPage;
