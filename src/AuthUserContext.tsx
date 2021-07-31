/* eslint-disable no-console */
import React, { createContext, useContext, useState } from 'react';
import AuthUser from './models/auth';
import axios from "axios";

type OperationType = {
  login: (userId: string) => void
  logout: () => void
}

const AuthUserContext = createContext<AuthUser | null>(null);
const AuthOperationContext = createContext<OperationType>({
  // eslint-disable-next-line no-unused-vars
  login: (_) => console.error('Providerが設定されていません'),
  logout: () => console.error('Providerが設定されていません'),
});

// eslint-disable-next-line react/prop-types
const AuthUserProvider: React.FC = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const login = async (userId: string) => {
    // await login() 
    setAuthUser({ userId });
  };

  const logout = async () => {
    // await login() 
    setAuthUser(null);
  };

  React.useEffect(() => {
    console.log("checking authentication by calling /whoami");

    axios
      .get("http://example.com:4000/whoami", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.user);

        if (res.data.user.nameID) {
          if (authUser && authUser.userId && authUser.userId === res.data.user.nameID) {
          } else{
            login(res.data.user.nameID);
          }
        } else {
          logout();
        }
      })
      .catch((err) => {
        console.log(err);
        logout();
      });
  });

  return (
    <AuthOperationContext.Provider value={{ login, logout }}>
      <AuthUserContext.Provider value={authUser}>
        { children }
      </AuthUserContext.Provider>
    </AuthOperationContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthUserContext);
export const useLogin = () => useContext(AuthOperationContext).login;
export const useLogout = () => useContext(AuthOperationContext).logout;

export default AuthUserProvider;
