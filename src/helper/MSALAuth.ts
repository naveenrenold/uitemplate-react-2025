import * as msal from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export default class MSALAuth {
  static myMSALObj: msal.PublicClientApplication;
  constructor() {
    if (!MSALAuth.myMSALObj) {
      MSALAuth.myMSALObj = new msal.PublicClientApplication(msalConfig);
    }
  }
}
export const getBearerToken = async (
  scopes: string[],
): Promise<string | null> => {
  if (!MSALAuth?.myMSALObj || !MSALAuth.myMSALObj.getActiveAccount()) {
    return null;
  }
  const token = await MSALAuth.myMSALObj
    .acquireTokenSilent({ scopes })
    .then((tokenResponse) => {
      return tokenResponse?.accessToken ?? null;
    })
    .catch(async (err) => {
      console.log("Failed to acquire silent token with error: " + err);
      const newToken = await MSALAuth.myMSALObj
        .acquireTokenPopup({ scopes })
        .then((tokenResponse) => {
          return tokenResponse?.accessToken ?? null;
        })
        .catch((err) => {
          console.log("Failed to acquire token with popup with error: " + err);
          return null;
        });
      return newToken;
    });
  return token;
};
