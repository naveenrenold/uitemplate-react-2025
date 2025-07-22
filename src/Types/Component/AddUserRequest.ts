export interface AddUserRequest {
  accountEnabled: boolean;
  displayName: string;
  mailNickname: string;
  userPrincipalName: string;
  passwordProfile: {
    forceChangePasswordNextSignIn: boolean;
    password: string;
  };
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  userType: "Member" | "Guest";
}