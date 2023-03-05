import React from 'react';
import Button from '@material-ui/core/Button';

const url = window.location.origin;

const LogoutPage = () => {

  return (
    <div>
      ログアウトしました！
      <Button onClick={() => window.location.replace(url + "/slogout")}>ログインページへ戻る</Button>
    </div>
  );
};

export default LogoutPage;
