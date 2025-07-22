import { severity } from "../../Types/ComponentProps/ButtonProps";
import {
  validateEmail,
  validatePhoneNumber,
} from "../../component/Admin/Admin";

export interface textFieldString {
  value: string | null;
  error: boolean;
  helperText: string | null;
  name?: string;
  type?: "text" | "password" | "email" | "phone" | "number";
  required?: boolean;
}

export const defaultTextFieldString: textFieldString = {
  value: "",
  error: false,
  helperText: "",
};

export const updateTextField = (
  updateTextField: React.Dispatch<React.SetStateAction<textFieldString>>,
  value: string,
): void => {
  updateTextField((prev) => ({
    ...prev,
    value: value,
    error: false,
    helperText: "",
  }));
};

export const validateTextField = (
  textField: textFieldString,
  updateTextField: React.Dispatch<React.SetStateAction<textFieldString>>,
  min?: number,
  max?: number,
  setAlert?: (
    alertMessage: string,
    severity: severity,
    timeout: number,
  ) => void,
): boolean => {
  let required = textField.required ?? false;
  if (!required && (!textField.value || textField.value?.trim() === "")) {
    return true; // If not required and empty, skip validation
  }
  if (required && (!textField.value || textField.value?.trim() === "")) {
    updateTextField((prev) => ({
      ...prev,
      error: true,
      helperText: `${textField.name ?? "Field"} is required.`,
    }));
    if (setAlert) {
      setAlert(`${textField.name ?? "Field"} is required.`, "error", 5000);
    }
    return false;
  }
  if (max && textField.value && textField.value.length > max) {
    updateTextField((prev) => ({
      ...prev,
      error: true,
      helperText: `${textField.name ?? "Field"} cannot exceed ${max} characters.`,
    }));
    if (setAlert) {
      setAlert(
        `${textField.name ?? "Field"} cannot exceed ${max} characters.`,
        "error",
        5000,
      );
    }
    return false;
  }
  if (min && textField.value && textField.value.length < min) {
    updateTextField((prev) => ({
      ...prev,
      error: true,
      helperText: `${textField.name ?? "Field"} must be at least ${min} characters.`,
    }));
    if (setAlert) {
      setAlert(
        `${textField.name ?? "Field"} must be at least ${min} characters.`,
        "error",
        5000,
      );
    }
    return false;
  }
  if (
    textField.type === "phone" &&
    !validatePhoneNumber(textField.value ?? "")
  ) {
    updateTextField((prev) => ({
      ...prev,
      error: true,
      helperText: `${textField.name ?? "Field"} is not a valid phone number.`,
    }));
    if (setAlert) {
      setAlert(
        `${textField.name ?? "Field"} is not a valid phone number.`,
        "error",
        5000,
      );
    }
    return false;
  }
  if (textField.type === "email" && !validateEmail(textField.value ?? "")) {
    updateTextField((prev) => ({
      ...prev,
      error: true,
      helperText: `${textField.name ?? "Field"} is not a valid email.`,
    }));
    if (setAlert) {
      setAlert(
        `${textField.name ?? "Field"} is not a valid email.`,
        "error",
        5000,
      );
    }
    return false;
  }
  if (textField.type === "number" && isNaN(Number(textField.value))) {
    updateTextField((prev) => ({
      ...prev,
      error: true,
      helperText: `${textField.name ?? "Field"} must be a valid number.`,
    }));
    if (setAlert) {
      setAlert(
        `${textField.name ?? "Field"} must be a valid number.`,
        "error",
        5000,
      );
    }
    return false;
  }
  return true;
};
