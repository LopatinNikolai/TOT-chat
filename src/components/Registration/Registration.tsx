import React, { useState } from "react";
import "./Registration.css";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { TErrorMessages } from "../../services/validator/types";
import { ValidatorService } from "../../services";
import { registrationRules } from "../../services/validator/rules/regisration.rule";
import { registrationErrorMessages } from "../../services/validator/errorMessages/registration.messages";
import { TRegistrationData } from "../../services/api/request.types";
import { AuthService, TUserDataFromServer } from "../../services/api/auth.service";
import { paths } from "../../paths";
import { RouteChildrenProps } from "react-router-dom";

type TRegistrationProps =RouteChildrenProps & {
  onUserAuth: (userData: TUserDataFromServer) => void;
};

const validator: ValidatorService<TRegistrationData> = new ValidatorService(
  registrationRules,
  registrationErrorMessages
);

const defaultErrorsState: TErrorMessages<TRegistrationData> = { };

export const Registration: React.FC<TRegistrationProps> = ({onUserAuth,history}) => {
  const [errors, setErrors] = useState<TErrorMessages<TRegistrationData>>(
    defaultErrorsState
  );

  const [errorsDB, setErrorsDB] = useState<Array<string>>([]);

  const [data, setData] = useState({
    login: "",
    password: "",
    name: "",
    surname: "",
  });

  function onClick() {
    const possibleErrors = validator.validate(data);
    if (Object.keys(possibleErrors).length === 0) {
      AuthService.registerUser(data).then((data) => {
        if (data.status === "ok") {
          onUserAuth(data.userData);
          history.push(paths.CHATS);
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
  function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, name: event.target.value });
  }
  function onChangeSurname(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, surname: event.target.value });
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
        <p className="logpas">
          <Input onChange={onChangeName} placeholder="Имя"></Input>
        </p>
        <p className="logpas">
          <Input onChange={onChangeSurname} placeholder="Фамилия"></Input>
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
        <Button onClick={onClick}>зарегистрироваться</Button>
      </div>
    </div>
  );
};
