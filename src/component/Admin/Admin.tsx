import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import httpClient from "../../helper/httpClient";
import data from "../../data/UserTable.json";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import LockResetIcon from "@mui/icons-material/LockReset";
import CheckCircle from "@mui/icons-material/CheckCircle";
import RestoreIcon from "@mui/icons-material/Restore";
import { domain, emailRegex, indiaPhoneRegex } from "../../Constant";
import { UserDetails } from "../../Types/Component/UserDetails";
import { AlertProps } from "../../Types/ComponentProps/AlertProps";
import { SnackBarProps } from "../../Types/ComponentProps/SnackBarProps";
import { ConfirmationDialogProps } from "../../Types/ComponentProps/ConfirmationProps";
import { ConfirmationDialog } from "../../custom-component/Dialog";
import { copyToClipboard, generatePassword } from "../../helper/helperFunction";
import { AddUserRequest } from "../../Types/Component/AddUserRequest";
import { textFieldString } from "../../Types/ComponentProps/TextFieldProps";
import { useMainContext } from "../../context/MainContextProvider";

function Admin() {
  //hooks
  const isMobile = useMediaQuery("(max-width:639px)");

  //state variable
  const [currentTab, updateCurrentTab] = useState<number>(1);
  const [users, updateUsers] = useState<UserDetails[]>([]);
  const [blockedUsers, updateBlockedUsers] = useState<UserDetails[]>([]);
  const [deletedUsers, updateDeletedUsers] = useState<UserDetails[]>([]);
  const [locationList, updateLocationList] = useState<Location[]>([]);
  const defaultTextField: textFieldString = {
    value: "",
    error: false,
    helperText: null,
  };
  const [displayName, updatedisplayName] =
    useState<textFieldString>(defaultTextField);
  const [emailAlias, updateEmailAlias] =
    useState<textFieldString>(defaultTextField);
  const [phoneNumber, updatePhoneNumber] =
    useState<textFieldString>(defaultTextField);
  const [location, updateLocation] =
    useState<textFieldString>(defaultTextField);
  const {
    updateAlertProps,
    updateIsLoading: setIsLoading,
    updateSnackBarProps,
  } = useMainContext();
  // const [alertProps, updateAlertProps] = useState<AlertProps>({
  //   show: false,
  //   message: "",
  //   severity: "info",
  // });
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUser, updateSelectedUser] = useState<UserDetails>();
  const [currentDialog, updateCurrentDialog] = useState<DialogType>(
    DialogType.None,
  );
  const [userDialogProps, updateUserDialogProps] = useState({
    username: "",
    password: "",
  });
  // const [SnackBarProps, updateSnackBarProps] = useState<SnackBarProps>({
  //   isOpen: false,
  //   message: "",
  // });

  //useEffect
  useEffect(() => {
    httpClient.fetchUsers(
      "users?$filter=userType eq 'Guest' and accountEnabled eq true",
      updateUsers,
    );
    httpClient.fetchUsers(
      "users?$filter=userType eq 'Guest' and accountEnabled eq false",
      updateBlockedUsers,
    );
    httpClient.fetchUsers(
      "directory/deletedItems/microsoft.graph.user?$filter=userType eq 'Guest'&$orderby=deletedDateTime desc&$count=true",
      updateDeletedUsers,
    );
    httpClient
      .getAsync<Location[]>(httpClient.GetLocation, undefined)
      .then((response) => {
        updateLocationList(response ?? []);
      });
  }, []);

  //render functions
  const deleteUserDialog = () => {
    const deleteUserDialogProps: ConfirmationDialogProps = {
      title: "Delete User",
      content: `Are you sure you want to delete user: ${selectedUser?.displayName}?`,
      onButton1: () => {
        deleteUser(selectedUser!);
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...deleteUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const addUserDialog = () => {
    const addUserDialogProps: ConfirmationDialogProps = {
      title: "Added User",
      content: [
        "User has been created with:",
        `UserName : ${userDialogProps.username}`,
        `Password : ${userDialogProps.password}`,
      ],
      onButton1: () => {
        copyToClipboard(
          `Your login details for GenuineSoft are as follows : \nUserName : ${userDialogProps.username}\nPassword : ${userDialogProps.password}`,
          updateSnackBarProps,
        );
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
      Button1: "Copy to ClipBoard",
      Button2: "Cancel",
    };
    return (
      <>
        <ConfirmationDialog {...addUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const resetUserDialog = () => {
    const resetUserDialogProps: ConfirmationDialogProps = {
      title: "Reset User",
      content: `Are you sure you want to reset password for ${selectedUser?.displayName}?`,
      onButton1: () => {
        resetUserPassword(selectedUser!);
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...resetUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const resetUserSuccessDialog = () => {
    const resetUserSuccessDialogProps: ConfirmationDialogProps = {
      title: "User password Reset!",
      content: [
        "User new login details are:",
        `UserName : ${userDialogProps.username}`,
        `Password : ${userDialogProps.password}`,
      ],
      onButton1: () => {
        copyToClipboard(
          `Your new login details for GenuineSoft are as follows : \nUserName : ${userDialogProps.username}\nPassword : ${userDialogProps.password}`,
          updateSnackBarProps,
        );
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
      Button1: "Copy to ClipBoard",
      Button2: "Cancel",
    };
    return (
      <>
        <ConfirmationDialog
          {...resetUserSuccessDialogProps}
        ></ConfirmationDialog>
      </>
    );
  };

  const blockUserDialog = () => {
    const blockUserDialogProps: ConfirmationDialogProps = {
      title: "Block User",
      content: `Are you sure you want to block user ${selectedUser?.displayName}`,
      onButton1: () => {
        blockUser(selectedUser!);
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...blockUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const unBlockUserDialog = () => {
    const unblockUserDialogProps: ConfirmationDialogProps = {
      title: "Unblock User",
      content: `Are you sure you want to unblock user ${selectedUser?.displayName}`,
      onButton1: () => {
        unblockUser(selectedUser!);
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...unblockUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const restoreUserDialog = () => {
    const restoreUserDialogProps: ConfirmationDialogProps = {
      title: "Restore User",
      content: `Are you sure you want to restore user ${selectedUser?.displayName}`,
      onButton1: () => {
        restoreUser(selectedUser!);
        updateCurrentDialog(DialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(DialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...restoreUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const setDialog = () => {
    switch (currentDialog) {
      case DialogType.AddUser:
        return addUserDialog();
      case DialogType.DeleteUser:
        return deleteUserDialog();
      case DialogType.ResetUser:
        return resetUserDialog();
      case DialogType.BlockUser:
        return blockUserDialog();
      case DialogType.UnBlockUser:
        return unBlockUserDialog();
      case DialogType.RestoreUser:
        return restoreUserDialog();
      case DialogType.ResetUserSuccess:
        return resetUserSuccessDialog();
    }
  };
  // api calls
  const addUser = () => {
    if (!validateAddUsers()) {
      return;
    }
    const addUserrequest: AddUserRequest = {
      accountEnabled: true,
      displayName: displayName.value ?? "",
      mobilePhone: phoneNumber.value ?? "",
      officeLocation: location.value ?? "",
      mailNickname: emailAlias.value ?? "",
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: generatePassword(),
      },
      userPrincipalName: emailAlias.value! + domain,
      userType: "Guest",
    };
    httpClient
      .postAsync<any>("users", addUserrequest, undefined, undefined, true)
      .then((result) => {
        if (result) {
          let user: UserDetails = {
            displayName: addUserrequest.displayName,
            mobilePhone: Number(addUserrequest.mobilePhone),
            officeLocation: addUserrequest.officeLocation,
            userPrincipalName: addUserrequest.mailNickname + domain,
          };
          updateUsers((prevUsers) => {
            return [...prevUsers, user];
          });
          updateUserDialogProps({
            username: addUserrequest.mailNickname + domain,
            password: addUserrequest.passwordProfile.password,
          });
          updateCurrentDialog(DialogType.AddUser);
        }
      });
  };
  const deleteUser = (user: UserDetails) => {
    httpClient
      .deleteAsync<any>(
        `users/${user.userPrincipalName}`,
        undefined,
        {
          successAlertMessage: "User deleted",
        },
        true,
      )
      .then((result) => {
        if (result) {
          updateUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });

          updateDeletedUsers((prevUsers) => {
            return [user, ...prevUsers];
          });
        }
      });
  };

  const resetUserPassword = (user: UserDetails) => {
    const resetPasswordRequest = {
      //passwordProfile: {
      //forceChangePasswordNextSignIn: true,
      newPassword: generatePassword(),
      //},
    };
    httpClient
      .postAsync<any>(
        `users/${user.userPrincipalName}/authentication/methods/28c10230-6103-485e-b985-444c60001490/resetPassword`,
        resetPasswordRequest,
        undefined,
        { successAlertMessage: "Password reset successfully" },
        true,
      )
      .then((result) => {
        if (result) {
          updateUserDialogProps({
            username: user.userPrincipalName ?? "",
            password: resetPasswordRequest.newPassword,
          });
          updateCurrentDialog(DialogType.ResetUserSuccess);
        }
      });
  };

  const blockUser = (user: UserDetails) => {
    // Consider adding error handling for clipboard operations to provide better user feedback.
    const blockUserRequest = {
      accountEnabled: false,
    };
    httpClient
      .patchAsync<any>(
        `users/${user.userPrincipalName}`,
        blockUserRequest,
        undefined,
        { successAlertMessage: "User blocked" },
        true,
      )
      .then((result) => {
        if (result) {
          updateUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
          updateBlockedUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
      });
  };

  const unblockUser = (user: UserDetails) => {
    const unblockUserRequest = {
      accountEnabled: true,
    };
    httpClient
      .patchAsync<any>(
        `users/${user.userPrincipalName}`,
        unblockUserRequest,
        undefined,
        {
          successAlertMessage: "User Unblocked",
        },
        true,
      )
      .then((result) => {
        if (result) {
          updateBlockedUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
          updateUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
      });
  };

  const restoreUser = (user: UserDetails) => {
    const restoreUserRequest = { autoReconcileProxyConflict: "true" };
    httpClient
      .postAsync<any>(
        `/directory/deletedItems/${user.id}/restore`,
        restoreUserRequest,
        undefined,
        { successAlertMessage: "Password reset successfully" },
        true,
      )
      .then((result) => {
        if (result) {
          updateDeletedUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
          updateUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
      });
  };

  //helper functions
  const validateAddUsers = (): boolean => {
    if (
      displayName.error ||
      emailAlias.error ||
      phoneNumber.error ||
      location.error
    ) {
      return false;
    }
    if (!displayName.value) {
      updatedisplayName((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User Name is required",
      }));
      return false;
    }
    if (!emailAlias.value) {
      updateEmailAlias((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "emailAlias is required",
      }));
      return false;
    }
    if (!phoneNumber.value) {
      updatePhoneNumber((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "PhoneNumber is required",
      }));
      return false;
    }
    if (!location.value) {
      updateLocation((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "Location is required",
      }));
      return false;
    }
    if (displayName.value.length < 1 || displayName.value.length > 50) {
      updatedisplayName((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User length should be > 1 and < 50",
      }));
      return false;
    }
    if (emailAlias.value.length < 1 || emailAlias.value.length > 50) {
      updateEmailAlias((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User length should be > 1 and < 50",
      }));
      return false;
    }
    if (validateEmail(emailAlias.value + domain)) {
      updateEmailAlias((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "Email alias is not valid",
      }));
      return false;
    }
    if (!validatePhoneNumber(phoneNumber.value)) {
      updatePhoneNumber((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "Invalid PhoneNumber",
      }));
      return false;
    }
    return true;
  };

  return (
    <>
      {/* <Snackbar
        open={SnackBarProps.isOpen}
        autoHideDuration={5000}
        onClose={() => {
          updateSnackBarProps({ isOpen: false, message: "" });
        }}
        message={SnackBarProps.message}
      ></Snackbar> */}
      <Dialog
        open={currentDialog != DialogType.None}
        onClose={() => {
          updateCurrentDialog(DialogType.None);
        }}
      >
        {setDialog()}
      </Dialog>
      <TabContext value={currentTab}>
        <Tabs
          variant="scrollable"
          value={currentTab}
          onChange={(_, newTab) => updateCurrentTab(newTab)}
        >
          <Tab label="List User" value={1}></Tab>
          <Tab label="Add User" value={2}></Tab>
          <Tab label="UnBlock User" value={3}></Tab>
          <Tab label="Restore User" value={4}></Tab>
          <Tab label="User Logs" value={5}></Tab>
        </Tabs>
        <TabPanel value={1}>
          <Box>
            {/* {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )} */}
            <Stack>
              <Typography variant="h6">List Users:</Typography>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  {data.getUserHeading.map((heading, id) => {
                    return <TableCell key={id}>{heading}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{user.displayName}</TableCell>
                        {/* <TableCell>{user.mail}</TableCell> */}
                        {/* <TableCell>{user.mobilePhone}</TableCell> */}
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <Stack direction={isMobile ? "column" : "row"}>
                            <Tooltip title="Reset">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog(DialogType.ResetUser);
                                }}
                              >
                                <LockResetIcon></LockResetIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Block">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog(DialogType.BlockUser);
                                }}
                              >
                                <BlockIcon></BlockIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog(DialogType.DeleteUser);
                                }}
                              >
                                <DeleteIcon></DeleteIcon>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </Box>
        </TabPanel>

        <TabPanel value={2}>
          <Box>
            {/* {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )} */}
            <Stack>
              <Typography variant="h6">Add Users:</Typography>
            </Stack>
            <Stack direction={"column"}>
              <Stack>
                <TextField
                  required={true}
                  error={displayName.error}
                  helperText={displayName.helperText}
                  variant="filled"
                  label="Name:"
                  value={displayName?.value}
                  onChange={(e) => {
                    updatedisplayName({
                      value: e.target.value,
                      error: false,
                      helperText: null,
                    });
                  }}
                ></TextField>{" "}
              </Stack>
              <Stack direction="row">
                <TextField
                  className="w-1/2"
                  required={true}
                  error={emailAlias.error}
                  helperText={emailAlias.helperText}
                  variant="filled"
                  label="Email Alias:"
                  value={emailAlias?.value}
                  onChange={(e) => {
                    updateEmailAlias({
                      value: e.target.value,
                      error: false,
                      helperText: null,
                    });
                  }}
                ></TextField>
                <TextField
                  className="w-1/2"
                  disabled={true}
                  value={domain}
                ></TextField>
              </Stack>
              <Stack>
                <TextField
                  required={true}
                  error={phoneNumber.error}
                  helperText={phoneNumber.helperText}
                  variant="filled"
                  label="Phone No:"
                  value={phoneNumber?.value}
                  onChange={(e) => {
                    updatePhoneNumber({
                      value: e.target.value,
                      error: false,
                      helperText: null,
                    });
                  }}
                ></TextField>{" "}
              </Stack>
              <Stack>
                <Autocomplete
                  value={location?.value}
                  onChange={(_, value) =>
                    updateLocation({
                      value: value,
                      error: false,
                      helperText: null,
                    })
                  }
                  autoHighlight={true}
                  freeSolo={false}
                  options={locationList.map((a) => a.locationName)}
                  renderInput={(params) => (
                    <TextField
                      required={true}
                      error={location.error}
                      helperText={location.helperText}
                      {...params}
                      variant="filled"
                      label="Location"
                    ></TextField>
                  )}
                ></Autocomplete>{" "}
              </Stack>
              <Stack>
                <Button onClick={() => addUser()} variant="contained">
                  Add User
                </Button>
              </Stack>
            </Stack>
          </Box>
        </TabPanel>
        <TabPanel value={3}>
          <Box>
            {/* {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )} */}
            <Stack>
              <Typography variant="h6">Unblock Users:</Typography>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  {data.getUserHeading.map((heading, id) => {
                    return <TableCell key={id}>{heading}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {blockedUsers && blockedUsers.length > 0 ? (
                  blockedUsers.map((user, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{user.displayName}</TableCell>
                        {/* <TableCell>{user.mail}</TableCell> */}
                        {/* <TableCell>{user.mobilePhone}</TableCell> */}
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <Stack direction={isMobile ? "column" : "row"}>
                            <Tooltip title="UnBlock">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog(DialogType.UnBlockUser);
                                }}
                              >
                                <CheckCircle></CheckCircle>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </Box>
        </TabPanel>
        <TabPanel value={4}>
          <Box>
            {/* {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )} */}
            <Stack>
              <Typography variant="h6">Restore Users:</Typography>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  {data.getUserHeading.map((heading, id) => {
                    return <TableCell key={id}>{heading}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {deletedUsers && deletedUsers.length > 0 ? (
                  deletedUsers.map((user, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{user.displayName}</TableCell>
                        {/* <TableCell>{user.mail}</TableCell> */}
                        {/* <TableCell>{user.mobilePhone}</TableCell> */}
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <Stack direction={isMobile ? "column" : "row"}>
                            <Tooltip title="Restore">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog(DialogType.RestoreUser);
                                }}
                              >
                                <RestoreIcon></RestoreIcon>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </Box>
        </TabPanel>
        <TabPanel value={5}>
          <Box>
            <Stack>
              <Typography variant="h6">Audit Logs(in development):</Typography>
            </Stack>
          </Box>
        </TabPanel>
      </TabContext>
    </>
  );
}
export default Admin;

export enum DialogType {
  "None",
  "AddUser",
  "DeleteUser",
  "ResetUser",
  "BlockUser",
  "UnBlockUser",
  "RestoreUser",
  "ResetUserSuccess",
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phoneNumber.search(indiaPhoneRegex) != -1;
};

export const validateEmail = (email: string): boolean => {
  return email.search(emailRegex) != -1;
};

export type Location = {
  locationId: number;
  locationName: string;
};
