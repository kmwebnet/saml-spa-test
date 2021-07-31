import React from 'react';
import Button from '@material-ui/core/Button';

const LogoutPage = () => {

  return (
    <div>
      ログアウトしました！
      <Button onClick={() => window.location.replace("http://example.com:4000/slogout")}>ログインページへ戻る</Button>
    </div>
  );
};

export default LogoutPage;
