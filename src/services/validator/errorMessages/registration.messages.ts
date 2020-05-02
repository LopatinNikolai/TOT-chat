import { TErrorMessages } from "../types";
import { TRegistrationData } from "../../api/request.types";

export const registrationErrorMessages: TErrorMessages<TRegistrationData> = {
  login: "Пожалуйста, укажите логин",
  password: "Пожалуйста, укажите пароль",
  name: "Пожалуйста, укажите имя",
  surname: "Пожалуйста, укажите фамилию",
};
