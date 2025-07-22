import { severity } from "./ButtonProps";
export interface AlertProps {
  show: boolean;
  severity: severity;
  message: string;
}
