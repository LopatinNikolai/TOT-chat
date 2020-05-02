import axios from "axios";
import { TRegistrationData, TAuthData } from "./request.types";

type TErrorResponse = {
  status: "error";
  message: string;
};
export type TUserDataFromServer = {
  userId: string;
  name: string;
  surname: string;
};
type TSuccesfulResponse = {
  userData: TUserDataFromServer;
  status: "ok";
};

type TAuthResponse = TSuccesfulResponse | TErrorResponse;

export class AuthService {
  private static REGISTER_ROUTE = "/api/register";
  private static AUTH_ROUTE = "/api/auth";
  private static LOCAL_KEY = "authUser";

  public static getAuthUserData(): Promise<TUserDataFromServer | null> {
    return Promise.resolve(
      AuthService.isUserAuth
        ? JSON.parse(localStorage.getItem(AuthService.LOCAL_KEY) as string)
        : null
    );
  }
  public static registerUser(
    registerData: TRegistrationData
  ): Promise<TAuthResponse> {
    return axios
      .post(AuthService.REGISTER_ROUTE, registerData)
      .then(({ data }) => {
        AuthService.setUserData(data.userData);
        return data;
      });
  }

  public static deAuthUser(): Promise<boolean> {
    AuthService.deleteUserData();
    return Promise.resolve(true);
  }

  public static authUser(authData: TAuthData): Promise<TAuthResponse> {
    return axios.post(AuthService.AUTH_ROUTE, authData).then(({ data }) => {
      AuthService.setUserData(data.userData);
      return data;
    });
  }

  public static get isUserAuth(): boolean {
    return Boolean(localStorage.getItem(AuthService.LOCAL_KEY));
  }

  private static setUserData(userData: TUserDataFromServer): void {
    localStorage.setItem(AuthService.LOCAL_KEY, JSON.stringify(userData));
  }

  private static deleteUserData(): void {
    localStorage.removeItem(AuthService.LOCAL_KEY);
  }
}
