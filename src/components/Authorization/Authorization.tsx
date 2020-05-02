import React, { useState } from "react";
import "./Authorization.css";
import { Button } from "../Button/Button";
import { ValidatorService } from "../../services";
import { TErrorMessages } from "../../services/validator/types";
import { authRules } from "../../services/validator/rules/auth.rule";
import { authErrorMessages } from "../../services/validator/errorMessages/auth.messages";
import { Input } from "../Input/Input";
import { TAuthData } from "../../services/api/request.types";
import {
  AuthService,
  TUserDataFromServer,
} from "../../services/api/auth.service";
import { paths } from "../../paths";
import { RouteChildrenProps } from "react-router-dom";

const validator: ValidatorService<TAuthData> = new ValidatorService(
  authRules,
  authErrorMessages
);

const defaultErrorsState: TErrorMessages<TAuthData> = {};

type TAuthorizationProps = RouteChildrenProps & {
  onUserAuth: (userData: TUserDataFromServer) => void;
};

export const Authorization: React.FC<TAuthorizationProps> = (
  props: TAuthorizationProps
) => {
  const [errors, setErrors] = useState<TErrorMessages<TAuthData>>(
    defaultErrorsState
  );

  const [errorsDB, setErrorsDB] = useState<Array<string>>([]);

  const [data, setData] = useState({
    login: "",
    password: "",
  });

  function onClick() {
    const possibleErrors = validator.validate(data);
    if (Object.keys(possibleErrors).length === 0) {
      AuthService.authUser(data).then((data) => {
        if (data.status === "ok") {
          props.onUserAuth(data.userData);
          props.history.push(paths.CHATS);
        } else {
          const arrayDB = [data.message];
          setErrorsDB(arrayDB);
        }
      });
    } else {
      setErrors(possibleErrors);
    }
  }

  function onChangeLogin(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, login: event.target.value });
  }
  function onChangePass(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, password: event.target.value });
  }

  return (
    <div className="popup">
      <div className="login_details">
        <p className="logpas">
          <Input onChange={onChangeLogin} placeholder="логин"></Input>
        </p>
        <p className="logpas">
          <Input onChange={onChangePass} placeholder="пароль"></Input>
        </p>
        <div className="registration-errors">
          <ul>
            {
              //@ts-ignore
              Object.values(errors).map((value, i) => (
                <li key={i}>{value}</li>
              ))
            }
            {
              //@ts-ignore
              Object.values(errorsDB).map((value, i) => (
                <li key={i}>{value}</li>
              ))
            }
          </ul>
        </div>
        <Button onClick={onClick}>войти</Button>
      </div>
    </div>
  );
};
