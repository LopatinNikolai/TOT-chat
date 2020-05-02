export type TValidationRules<T extends object> = {
  [key in keyof T]: (value: any) => boolean;
};

  export type TErrorMessages<T extends object> = {
    [key in keyof T]?: string;
  };