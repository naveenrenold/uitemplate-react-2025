import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";
import { getBearerToken } from "./MSALAuth";
import { graphApiScopes, webApiScopes } from "./authConfig";
import { UserDetails } from "../Types/Component/UserDetails";
import { AlertProps } from "../Types/ComponentProps/AlertProps";
import { severity } from "../Types/ComponentProps/ButtonProps";
import { useMainContext } from "../context/MainContextProvider";
class httpClient {
  //base Urls
  static apiUrl = import.meta.env.VITE_ApiUrl;
  static graphApiUrl = "https://graph.microsoft.com/v1.0/";

  // api endpoints
  static GetForm = "form";
  static GetProcess = "process";
  static GetAttachments = "attachment";
  static GetActivity = "activity";
  static GetLocation = "location";

  // api defaults
  static defaultHeaders: RawAxiosRequestHeaders = {
    ConsistencyLevel: "eventual",
  };
  static defaultScope: string[] = [];

  //misc
  static setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  static setAlertProps: React.Dispatch<React.SetStateAction<AlertProps>>;

  static initializeContext(
    updateIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    updateAlertProps: React.Dispatch<React.SetStateAction<AlertProps>>,
  ) {
    httpClient.setIsLoading = updateIsLoading;
    httpClient.setAlertProps = updateAlertProps;
  }
  static sendHttpRequest = <T>(
    requestMethod: requestMethodEnum,
    url: string,
    headerConfig: AxiosRequestConfig<any>,
    request: any,
  ) => {
    if (requestMethod === "post") {
      return axios.post<T>(url, request, headerConfig);
    } else if (requestMethod === "delete") {
      return axios.delete<T>(url, headerConfig);
    } else if (requestMethod === "patch") {
      return axios.patch<T>(url, request, headerConfig);
    } else {
      return axios.get<T>(url, headerConfig);
    }
  };
  public static async apiAsync<T>(
    requestMethod: requestMethodEnum = "get",
    url: string,
    request?: any,

    apiDefaults?: apiDefaults,
    loadingAlertProps: LoadingAlertProps = {
      setAlert: true,
      successAlertMessage: undefined,
      setIsLoading: true,
    },
    //custom logic
    isGraph = false,
    formData = false,
  ) {
    let baseUrl =
      (apiDefaults?.baseUrl ?? isGraph)
        ? httpClient.graphApiUrl
        : httpClient.apiUrl;
    let scopes =
      (apiDefaults?.scopes ?? isGraph)
        ? graphApiScopes.scopes
        : webApiScopes.scopes;

    let axiosHeaders = await this.setAxiosHeaders(
      apiDefaults?.config?.headers,
      scopes,
      formData,
    );
    let headerConfig: AxiosRequestConfig = {
      headers: {
        ...axiosHeaders,
      },
      baseURL: baseUrl,
    };

    let response = httpClient.sendHttpRequest<T>(
      requestMethod,
      url,
      headerConfig,
      request,
    );
    if (loadingAlertProps?.setIsLoading) {
      httpClient.setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(
      response,
      loadingAlertProps?.setAlert,
      loadingAlertProps?.successAlertMessage,
    );
    if (loadingAlertProps?.setIsLoading) {
      httpClient.setIsLoading(false);
    }
    return result;
  }

  public static async getAsync<T>(
    url: string,
    apiDefaults?: apiDefaults,
    loadingAlertProps: LoadingAlertProps = {
      setAlert: true,
      successAlertMessage: undefined,
      setIsLoading: true,
    },

    //custom logic
    isGraph = false,
  ) {
    return await this.apiAsync<T>(
      "get",
      url,
      undefined,
      apiDefaults,
      loadingAlertProps,
      isGraph,
    );
  }

  public static async postAsync<T>(
    url: string,
    request?: any,

    apiDefaults?: apiDefaults,
    loadingAlertProps: LoadingAlertProps = {
      setAlert: true,
      successAlertMessage: undefined,
      setIsLoading: true,
    },

    //custom logic
    isGraph = false,
    formData = false,
  ) {
    return await this.apiAsync<T>(
      "post",
      url,
      request,
      apiDefaults,
      loadingAlertProps,
      isGraph,
      formData,
    );
  }

  public static async deleteAsync<T>(
    url: string,

    apiDefaults?: apiDefaults,
    loadingAlertProps: LoadingAlertProps = {
      setAlert: true,
      successAlertMessage: undefined,
      setIsLoading: true,
    },

    //custom logic
    isGraph = false,
  ) {
    return await this.apiAsync<T>(
      "delete",
      url,
      undefined,
      apiDefaults,
      loadingAlertProps,
      isGraph,
    );
  }

  public static async patchAsync<T>(
    url: string,
    request?: any,

    apiDefaults?: apiDefaults,
    loadingAlertProps: LoadingAlertProps = {
      setAlert: true,
      successAlertMessage: undefined,
      setIsLoading: true,
    },

    //custom logic
    isGraph = false,
    formData = false,
  ) {
    return await this.apiAsync<T>(
      "patch",
      url,
      request,
      apiDefaults,
      loadingAlertProps,
      isGraph,
      formData,
    );
  }

  public static async handleHttpResponse<T>(
    result: Promise<AxiosResponse<any, any>>,
    setAlert = false,
    successAlertMessage?: string,
  ): Promise<T | undefined> {
    let response: T | undefined = await result
      .then((response) => {
        if (successAlertMessage) {
          this.setAlerts(successAlertMessage, "success");
        }
        return response.data.value || (response.data as T) || true;
      })
      .catch((err: AxiosError<T>) => {
        let response = err.response?.data;
        this.setAlerts(response);
        return;
      });
    return response;
  }

  static async getBearerToken(scopes: string[] | null): Promise<string | null> {
    let bearerToken;
    if (scopes && scopes.length > 0) {
      bearerToken = await getBearerToken(scopes);
      if (!bearerToken) {
        return null;
      }
    }
    //console.log(`Bearer Token : ${bearerToken}`);
    return bearerToken ?? null;
  }
  static async fetchUsers(
    url: string,
    updateState: React.Dispatch<React.SetStateAction<UserDetails[]>>,
    filterFn: (value: UserDetails) => boolean = (value) =>
      value.officeLocation !== null,
  ) {
    const response = await httpClient.getAsync<UserDetails[]>(
      url,
      undefined,
      { setAlert: true, setIsLoading: true },
      true,
    );
    if (response && response.length > 0) {
      updateState(response.filter(filterFn));
      return;
    }
    console.log(`${url} call failed`);
    return [];
  }

  static async setAlerts(response?: any, severity: severity = "error") {
    let alertMessage = response?.error?.message || response?.message;
    if (!alertMessage) {
      console.log("Error occured with response : " + response.toString());
      return;
    }
    let alert: AlertProps = {
      message: alertMessage,
      severity: severity,
      show: true,
    };
    httpClient.setAlertProps(alert);
    alert = {
      message: "",
      severity: "info",
      show: false,
    };
    setTimeout(() => {
      httpClient.setAlertProps(alert);
    }, 5000);
  }
  static async setAxiosHeaders(
    headers: RawAxiosRequestHeaders | null = {},
    scopes: string[] | null = httpClient.defaultScope,
    formData = false,
  ) {
    let bearerToken = await this.getBearerToken(scopes);
    headers = {
      ...httpClient.defaultHeaders,
      ...(headers ?? {}),
      Authorization: bearerToken ? `Bearer ${bearerToken}` : undefined,
      "Content-Type": formData ? "multipart/form-data" : undefined,
    };
    // let bearerToken = await this.getBearerToken(scopes);
    // if(bearerToken)
    // {

    // }
    return headers;
  }
}

export default httpClient;
export interface axiosTypes<T> {
  value: T;
  message: string;
  error: {
    message: string[];
  };
}
export type requestMethodEnum = "get" | "post" | "delete" | "patch";

export type LoadingAlertProps = {
  setAlert?: boolean;
  successAlertMessage?: string;
  setIsLoading?: boolean;
};

export type apiDefaults = {
  config?: AxiosRequestConfig;
  baseUrl?: string;
  scopes?: string[];
};
