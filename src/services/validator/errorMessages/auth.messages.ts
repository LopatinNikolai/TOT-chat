import { TErrorMessages } from "../types";
import { TAuthData } from "../../api/request.types";

export const authErrorMessages: TErrorMessages<TAuthData> = {
  login: "Пожалуйста, укажите логин",
  password: "Пожалуйста, укажите пароль",
};
