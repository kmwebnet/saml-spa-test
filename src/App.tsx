import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, RouteProps, Switch, useLocation,
} from 'react-router-dom';
import './App.css';
import AuthUserProvider, { useAuthUser } from './AuthUserContext';

import NavBar from './components/drawer/NavBar';
import LoginPage from './components/pages/LoginPage';
import LogoutPage from './components/pages/LogoutPage';
import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage';

const PrivateRoute: React.FC<RouteProps> = ({ ...props }) => {
  const authUser = useAuthUser();
  const isAuthenticated = authUser != null;
  const { location } = props;
  if (isAuthenticated) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...props} />;
  // eslint-disable-next-line no-else-return
  } else {
    return <Redirect to={{ pathname: '/login', state: { from: location?.pathname } }} />;
  }
};

const UnAuthRoute: React.FC<RouteProps> = ({ ...props }) => {
  const authUser = useAuthUser();
  const isAuthenticated = authUser != null;
  const { from } = useLocation<{from: string | undefined}>().state || {};
  if (isAuthenticated) {
    return <Redirect to={from ?? '/'} />;
  // eslint-disable-next-line no-else-return
  } else {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...props} />;
  }
};

function App() {
  const [open, setopen] = React.useState<boolean>(false);

  const handleToggle = React.useCallback(() => {
    // eslint-disable-next-line no-shadow
    setopen((open) => !open);
  }, []);

  return (
    <AuthUserProvider>
      <Router>
        <NavBar show={open} drawToggleClickHandler={handleToggle} />
        <Switch>
          <UnAuthRoute exact path="/login" component={LoginPage} />
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/logout" component={LogoutPage} />
          <PrivateRoute exact path="/profile" component={ProfilePage} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </AuthUserProvider>
  );
}

export default App;
