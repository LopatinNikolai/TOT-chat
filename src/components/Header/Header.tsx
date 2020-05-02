import React from "react";
import "./Header.css";
import { Button } from "../Button/Button";
import { Link } from "react-router-dom";
import { paths } from "../../paths";
import {
  AuthService,
  TUserDataFromServer,
} from "../../services/api/auth.service";

type HeaderProps = {
  onLogOut: VoidFunction;
  userData: TUserDataFromServer | null;
};

export const Header: React.FC<HeaderProps> = ({ onLogOut, userData }) => {
  function onClickExit() {
    AuthService.deAuthUser().then((res) => {
      if (res) {
        onLogOut();
      }
    });
  }

  const headerContent =
    userData !== null ? (
      <div>
        <span>{userData.name} {userData.surname}</span>
        <Button onClick={onClickExit}>
          <Link className="link" to={paths.AUTHORIZATION}>
            выход
          </Link>
        </Button>
      </div>
    ) : (
      <div>
        <Button>
          <Link className="link" to={paths.REGISTRATION}>
            регистрация
          </Link>
        </Button>
        <Button>
          <Link className="link" to={paths.AUTHORIZATION}>
            вход
          </Link>
        </Button>
      </div>
    );

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <p className="tot">TOT-</p>
          <p className="chat">chat</p>
        </div>
        {headerContent}
      </div>
    </header>
  );
};
