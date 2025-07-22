import { createContext, use } from "react";
import {
  LoginContextProviderProps,
  LoginContextType,
} from "../Types/Context/ContextTypes";

export const loginContext = createContext<LoginContextType | null>(null);
function LoginContextProvider({
  children,
  loginContextProvider,
}: LoginContextProviderProps) {
  return (
    <>
      <loginContext.Provider value={loginContextProvider}>
        {children}
      </loginContext.Provider>
    </>
  );
}

export default LoginContextProvider;

export function useLoginContext() {
  let context = use(loginContext);
  if (!context) {
    throw new Error("Error at useLoginContext: null Context");
  }
  return context;
}
