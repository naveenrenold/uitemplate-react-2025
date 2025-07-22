/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GIT_PAT: string;
  readonly VITE_AppId: string;
  readonly VITE_TenantId: string;
  readonly VITE_BaseURL: string;
  readonly VITE_Base: string;
  readonly VITE_ApiUrl: string;
  readonly VITE_MaxFileSize: string;
  readonly VITE_EnableCustomerAccess: string;
  // more env variables...
}
