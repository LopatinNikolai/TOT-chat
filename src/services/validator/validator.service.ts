import { TValidationRules, TErrorMessages } from "./types";

export class ValidatorService<T extends object> {
  constructor(
    private rules: TValidationRules<T>,
    private errorMessage: TErrorMessages<T>
  ) {}

  public validate(data: T): TErrorMessages<T> {
    const validationStatuses = Object.entries(data).reduce(
      //@ts-ignore
      (acc, [key, value]) => {
        //@ts-ignore
        const validationResult = this.rules[key](value);
        if ( !validationResult) {
            //@ts-ignore
          acc[key] = validationResult;
        }
        return acc;
      },
      {} as Record<keyof T, boolean>
    );

    return this.mapErrorMessages(validationStatuses);
  }

  private mapErrorMessages(
    errorStatuses: Record<keyof T, boolean>
  ): TErrorMessages<T> {
    return Object.keys(errorStatuses).reduce(
      (acc, key) =>{
           //@ts-ignore
        (acc[key] = this.errorMessage[key])
        //@ts-ignore
        return acc},
      {} as TErrorMessages<T>
    );
  }
}
