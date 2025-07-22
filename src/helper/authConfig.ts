import * as msal from "@azure/msal-browser";

const msalConfig: msal.Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AppId,
    authority:
      "https://login.microsoftonline.com/" + import.meta.env.VITE_TenantId,
    redirectUri: import.meta.env.VITE_BaseURL,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

const graphApiScopes = {
  scopes: [
    "Directory.ReadWrite.All",
    "GroupMember.ReadWrite.All",
    "User.ReadWrite.All",
    "UserAuthenticationMethod.ReadWrite.All",
    "AuditLog.Read.All",
  ],
};

const webApiScopes = {
  scopes: ["api://172d1695-b52e-45ae-88ae-acbbad8c34ee/.default"],
};

export { msalConfig, graphApiScopes, webApiScopes };
