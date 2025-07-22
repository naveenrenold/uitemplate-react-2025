import { createContext, ReactNode, use } from "react";
import {
  MainContextProviderProps,
  MainContextType,
} from "../Types/Context/ContextTypes";
import { AlertProps } from "../Types/ComponentProps/AlertProps";

export let MainContext = createContext<MainContextType | null>(null);
function MainContextProvider({
  children,
  mainContext,
}: MainContextProviderProps) {
  return (
    <>
      <MainContext.Provider value={mainContext}>
        {children}
      </MainContext.Provider>
    </>
  );
}

export default MainContextProvider;

export function useMainContext() {
  let context = use(MainContext);
  if (!context) {
    throw new Error("Error at useMainContext: null Context");
  }
  return context;
}

export const setAlerts = (
  alertProps: AlertProps,
  updateAlertProps: React.Dispatch<React.SetStateAction<AlertProps>>,
  timeOut = 5000,
) => {
  updateAlertProps(alertProps);
  window.scrollTo(0, 0);
  setTimeout(() => {
    updateAlertProps({
      message: "",
      severity: "info",
      show: false,
    });
  }, timeOut);
};
