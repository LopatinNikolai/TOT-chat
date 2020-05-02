import { TValidationRules } from "../types";
import { TAuthData } from "../../api/request.types";

const baseValidationRule = (value: string | undefined): boolean =>
  value !== "" && value !== undefined;

export const authRules: TValidationRules<TAuthData> = {
  login: baseValidationRule,
  password: baseValidationRule,
};
