import { emailRegex, indiaPhoneRegex } from "../Constant";

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phoneNumber.search(indiaPhoneRegex) != -1;
};

export const validateEmail = (email: string): boolean => {
  return email.search(emailRegex) != -1;
};
