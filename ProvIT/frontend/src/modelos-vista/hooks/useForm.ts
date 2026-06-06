import { useState } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K], allValues: T) => string | undefined;
};

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T> = {}
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setFormData = (newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  };

  const setErrorsState = (newErrors: Record<string, string>) => {
    setErrors(newErrors as any);
  };

  const clearError = (field: string) => {
    if (errors[field as keyof T]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof T];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    (Object.keys(rules) as Array<keyof T>).forEach((key) => {
      const validator = rules[key];
      if (validator) {
        const error = validator(values[key], values);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return { values, setValues, setFormData, errors, setErrorsState, clearError, validate };
};