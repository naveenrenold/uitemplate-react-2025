import { ReactNode } from "react";
import { UserDetails } from "../Component/UserDetails";
import { AlertProps } from "../ComponentProps/AlertProps";
import { AccountInfo } from "@azure/msal-browser";
import { Role } from "../Component/Role";
import { SnackBarProps } from "../ComponentProps/SnackBarProps";

export type LoginContextProviderProps = {
  children: ReactNode;
  loginContextProvider: LoginContextType;
};
export type LoginContextType = {
  user: UserDetails | null;
  updateUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  accountInfo: AccountInfo | null;
  updateAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo | null>>;
  role: Role;
  updateRole: React.Dispatch<React.SetStateAction<Role>>;
};

export type MainContextProviderProps = {
  children: ReactNode;
  mainContext: MainContextType;
};

export type MainContextType = {
  isDrawerOpen: boolean;
  updateIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  alertProps: AlertProps;
  updateAlertProps: React.Dispatch<React.SetStateAction<AlertProps>>;
  setAlerts: (
    alertProps: AlertProps,
    setAlerts: React.Dispatch<React.SetStateAction<AlertProps>>,
    timeOut?: number,
  ) => void;
  isLoading: boolean;
  updateIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  snackBarProps: SnackBarProps;
  updateSnackBarProps: React.Dispatch<React.SetStateAction<SnackBarProps>>;
  isMobile?: boolean;
};
