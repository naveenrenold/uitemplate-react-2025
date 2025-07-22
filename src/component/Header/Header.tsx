import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useLoginContext } from "../../context/LoginContextProvider";
import { webApiScopes } from "../../helper/authConfig";
import MSALAuth from "../../helper/MSALAuth";
import {
  AccountInfo,
  EndSessionPopupRequest,
  PopupRequest,
} from "@azure/msal-browser";
import {
  Alert,
  AppBar,
  Dialog,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import style from "./Header.module.css";
import headings from "../../data/headings.json";
import { useMainContext } from "../../context/MainContextProvider";
import { useNavigate } from "react-router";
import admins from "../../data/admin.json";
import httpClient from "../../helper/httpClient";
import { drawerWidth } from "../../Constant";
import { UserDetails } from "../../Types/Component/UserDetails";

function Header() {
  //constants

  //hooks
  const navigate = useNavigate();
  //useState
  let [currentDate, updatecurrentDate] = useState(new Date());
  let { user, updateUser, accountInfo, updateAccountInfo, role, updateRole } =
    useLoginContext();
  let {
    isDrawerOpen,
    updateIsDrawerOpen,
    alertProps,
    isLoading,
    snackBarProps: SnackBarProps,
    updateSnackBarProps,
  } = useMainContext();
  const isMobile = useMediaQuery("(max-width:639px)");
  //useEffect
  useEffect(() => {
    new MSALAuth();
    MSALAuth.myMSALObj
      .initialize()
      .then(() => {
        setAccount();
        console.log("Account set");
      })
      .catch((err) => {
        console.log("Error at Msal initialse", err);
      });
    const setAccount = () => {
      let accounts = MSALAuth.myMSALObj.getAllAccounts();
      if (!accounts || accounts.length == 0) {
        console.log("Signing in");
        //signIn();
        updateRole("Customer");
        return;
      } else if (accounts.length > 1) {
        console.log("Warning, more than 1 active account");
        if (admins.includes(accounts[0].username)) {
          updateRole("Admin");
        } else {
          updateRole("Employee");
        }
        updateAccountInfo(accounts[0]);
        getUserDetails(accounts[0]);
      } else {
        console.log("Default sign in", accounts[0]);
        if (admins.includes(accounts[0].username)) {
          updateRole("Admin");
        } else {
          updateRole("Employee");
        }
        updateAccountInfo(accounts[0]);
        getUserDetails(accounts[0]);
      }
    };
  }, []);
  //api calls
  const getUserDetails = (accountInfo: AccountInfo) => {
    httpClient
      .getAsync<UserDetails>(
        `users/${accountInfo.localAccountId}`,
        undefined,
        {
          setAlert: false,
          setIsLoading: false,
        },
        true,
      )
      .then((response) => {
        if (response) {
          updateUser(response);
        }
      })
      .catch((err) => {
        console.log("Error at getUserDetails", err);
      });
  };
  //render function
  const headerHeadings =
    role === "Admin"
      ? headings
      : role === "Customer"
        ? headings.filter((heading) => heading.customerModule === true)
        : headings.filter((heading) => heading.adminModule === false);
  // helper functions
  const signIn = () => {
    let request: PopupRequest = webApiScopes;
    MSALAuth.myMSALObj
      .loginPopup(request)
      .then((authResult) => {
        MSALAuth.myMSALObj.setActiveAccount(authResult.account);
        updateAccountInfo(authResult.account);
        if (admins.includes(authResult.account.username)) {
          updateRole("Admin");
        } else {
          updateRole("Employee");
        }
        getUserDetails(authResult.account);
      })
      .catch((err) => {
        updateRole("Customer");
        //updateAccountInfo(null);
        console.log("Error at Sign in ", err);
      });
  };
  const signOut = () => {
    console.log("in sign out");
    if (!accountInfo) {
      return;
    }
    let request: EndSessionPopupRequest = { account: accountInfo };
    MSALAuth.myMSALObj
      .logoutPopup(request)
      .then(() => {
        console.log("logoutsuccess");
        navigate("search");
        updateUser(null);
        updateRole("Customer");
        updateAccountInfo(null);
      })
      .catch((err) => {
        updateRole("Customer");
        console.log("Error at Sign out ", err);
      });
  };

  setInterval(() => {
    updatecurrentDate(new Date());
  }, 1000);
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        open={isDrawerOpen}
        onClose={() => {
          updateIsDrawerOpen(false);
        }}
      >
        <Toolbar />
        <List>
          {headerHeadings.map((heading, id) => {
            return (
              <div key={id}>
                <ListItem key={id}>
                  <ListItemButton
                    sx={{
                      // color: (theme) => theme.palette.primary.main,
                      // textDecoration: "underline",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                        boxShadow: (theme) =>
                          `0px 0px 5px 2px ${theme.palette.primary.main}`,
                      },
                    }}
                    onClick={() => {
                      navigate(heading.href);
                    }}
                  >
                    <ListItemText>
                      <Typography>{heading.name}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <Divider orientation="horizontal" flexItem></Divider>
              </div>
            );
          })}
          {isMobile ? (
            <>
              {accountInfo ? (
                <>
                  <ListItem>
                    <ListItemText>
                      {accountInfo?.name && accountInfo?.name.length < 20
                        ? accountInfo?.name
                        : accountInfo?.name?.substring(0, 20) + "..."}
                    </ListItemText>
                  </ListItem>
                  <Divider orientation="horizontal" flexItem></Divider>
                  {user?.officeLocation && (
                    <>
                      <ListItem>
                        <ListItemText>{user.officeLocation}</ListItemText>
                      </ListItem>
                      <Divider orientation="horizontal" flexItem></Divider>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              <ListItem>
                <ListItemText>
                  {format(currentDate, "dd/MM/yy h:mm aa")}
                </ListItemText>
              </ListItem>
              <Divider orientation="horizontal" flexItem></Divider>
            </>
          ) : (
            <></>
          )}
        </List>
        <Stack
          direction={"column-reverse"}
          height={"100%"}
          alignItems={"center"}
        >
          <Typography color="primary">
            <a
              href="https://www.linkedin.com/in/naveen-renold-7a9a6815b/"
              target="_blank"
              rel="noopener"
            >
              With ♥ by Naveen
            </a>
          </Typography>
        </Stack>
      </Drawer>
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Stack
          className="w-full"
          useFlexGap
          direction={"row"}
          spacing={1}
          divider={<Divider orientation="vertical" flexItem></Divider>}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton
            onClick={() => {
              updateIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <img
              alt="Image failed to load"
              src="/favicon.svg"
              className="w-7 h-7 sm:w-10 sm:h-10"
            ></img>
          </IconButton>
          <Typography variant="h5">Genuine Soft</Typography>
          <Stack
            direction={"row"}
            spacing={1}
            divider={<Divider orientation="vertical" flexItem></Divider>}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {accountInfo ? (
              <>
                <div className={style.hm}>{accountInfo?.name}</div>
                {user?.officeLocation && !isMobile && (
                  <>
                    <Divider orientation="vertical" flexItem></Divider>
                    <div className={style.hm}>{user?.officeLocation}</div>
                    <Divider orientation="vertical" flexItem></Divider>
                  </>
                )}

                <Button
                  size="small"
                  color={"secondary"}
                  variant="contained"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                size="small"
                color={"secondary"}
                variant="contained"
                onClick={() => {
                  signIn();
                }}
              >
                Sign In
              </Button>
            )}
            <div className={style.hm}>
              {format(currentDate, "dd/MM/yy h:mm aa")}
            </div>
          </Stack>
        </Stack>
      </AppBar>
      {isLoading && <LinearProgress></LinearProgress>}
      {alertProps.show && (
        <Alert
          variant="filled"
          severity={alertProps.severity}
          style={isDrawerOpen ? { marginLeft: "240px" } : {}}
        >
          {alertProps.message}
        </Alert>
      )}
      <Snackbar
        open={SnackBarProps.isOpen}
        autoHideDuration={5000}
        onClose={() => {
          updateSnackBarProps({ isOpen: false, message: "" });
        }}
        message={SnackBarProps.message}
      ></Snackbar>
      {/* <Dialog
        open={currentDialog != DialogType.None}
        onClose={() => {
          updateCurrentDialog(DialogType.None);
        }}
      >
        {setDialog()}
      </Dialog> */}
    </>
  );
}
export default Header;
