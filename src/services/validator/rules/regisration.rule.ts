import { TValidationRules } from "../types";
import { TRegistrationData } from "../../api/request.types";

const baseValidationRule = (value: string | undefined): boolean =>
  value !== "" && value !== undefined;

export const registrationRules: TValidationRules<TRegistrationData> = {
  login: baseValidationRule,
  password: baseValidationRule,
  name: baseValidationRule,
  surname: baseValidationRule,
};
