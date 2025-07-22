import generator from "generate-password-browser";
import { SnackBarProps } from "../Types/ComponentProps/SnackBarProps";

export const generatePassword = (): string => {
  return generator.generate({
    length: 8,
    symbols: true,
    numbers: true,
    uppercase: true,
    lowercase: true,
    strict: true,
  });
};

export const copyToClipboard = (
  message: string,
  updateSnackBarProps: React.Dispatch<React.SetStateAction<SnackBarProps>>,
) => {
  navigator.clipboard
    .writeText(message)
    .then(() => {
      updateSnackBarProps({
        isOpen: true,
        message: "Copied to clipboard",
      });
    })
    .catch(() => {
      updateSnackBarProps({
        isOpen: true,
        message: "Failed to copy to clipboard",
      });
    });
};
