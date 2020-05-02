import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  RouteChildrenProps,
} from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Registration } from "./components/Registration/Registration";
import { paths } from "./paths";
import { Authorization } from "./components/Authorization/Authorization";
import { ChatList } from "./components/ChatList/ChatList";
import { TUserDataFromServer, AuthService } from "./services/api/auth.service";
import { ChatService } from "./services/api/chat.service";

type TPrivateRoute = {
  path: string;
  to: string;
  render: (props: RouteChildrenProps<any>) => React.ReactNode;
  shouldRedirect: boolean;
};

function ExtendedRoute(props: TPrivateRoute) {
  return (
    <Route path={props.path}>
      {(routerProps: RouteChildrenProps) =>
        !props.shouldRedirect ? (
          props.render(routerProps)
        ) : (
          <Redirect to={props.to} />
        )
      }
    </Route>
  );
}

function App() {
  const [userData, setUserData] = useState<TUserDataFromServer | null>(null);

  useEffect(() => {
    AuthService.getAuthUserData().then(handleLogin);
  }, []);

  function handleLogin(userData: TUserDataFromServer | null) {
    if (userData !== null) {
      ChatService.setConnection();
    }
    setUserData(userData);
  }

  function handleLogOut() {
    ChatService.destroyConnection();
    setUserData(null);
  }

  return (
    <Router>
      <Header onLogOut={handleLogOut} userData={userData} />
      <div className="switch">
        <Switch>
          <ExtendedRoute
            path={paths.CHATS}
            to={paths.AUTHORIZATION}
            shouldRedirect={!AuthService.isUserAuth}
            render={(props: RouteChildrenProps) => (
              <ChatList userData={userData as TUserDataFromServer} {...props} />
            )}
          />
          <ExtendedRoute
            path={paths.REGISTRATION}
            to={paths.CHATS}
            shouldRedirect={AuthService.isUserAuth}
            render={(props: RouteChildrenProps) => (
              <Registration onUserAuth={handleLogin} {...props} />
            )}
          />

          <ExtendedRoute
            path={paths.AUTHORIZATION}
            to={paths.CHATS}
            shouldRedirect={AuthService.isUserAuth}
            render={(props: RouteChildrenProps) => (
              <Authorization onUserAuth={handleLogin} {...props} />
            )}
          />
          <Route path="/">
            <Redirect to={paths.AUTHORIZATION} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
