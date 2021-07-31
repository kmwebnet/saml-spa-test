import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useAuthUser } from '../../AuthUserContext';

const ProfilePage = () => {
  const history = useHistory();
  const authUser = useAuthUser();

  return (
    <div>
      <h1>プロフィール</h1>
      ユーザー
      {authUser?.userId}
      のプロフィールページです。ログインしていないユーザは見れません。
      <Button onClick={() => history.push('/')}>ホームへ戻る</Button>
    </div>
  );
};

export default ProfilePage;
