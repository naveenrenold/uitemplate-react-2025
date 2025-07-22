import {
  Autocomplete,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { textFieldString } from "../../Types/ComponentProps/TextFieldProps";
import httpClient from "../../helper/httpClient";
import { useMainContext } from "../../context/MainContextProvider";
import { useLoginContext } from "../../context/LoginContextProvider";
import { useNavigate } from "react-router";
import { severity } from "../../Types/ComponentProps/ButtonProps";
import { FormResponse } from "../../Types/Component/Form";

export function Search() {
  //constants
  //hooks
  let navigate = useNavigate();
  const {
    updateAlertProps,
    updateIsLoading,
    updateSnackBarProps,
    setAlerts,
    isMobile,
    isLoading,
  } = useMainContext();
  //const { user, role } = useLoginContext();
  //state
  let [currentFormId, setCurrentFormId] = useState<string | null>(null);
  let [formIds, setFormIds] = useState<string[]>([]);
  //useeffect
  useEffect(() => {
    // Fetch form IDs from the server or any other source
    const fetchFormIds = async () => {
      try {
        let params = new URLSearchParams();
        params.append("field", "id");
        params.append("orderBy", "id");
        params.append("sortBy", "desc");
        let response = await httpClient.getAsync<FormResponse[]>(
          `${httpClient.GetForm}?${params.toString()}`,
        );
        if (response) {
          setFormIds(response.map((form) => form.id.toString()));
        } else {
          setAlert("Failed to fetch form IDs.");
        }
      } catch (error) {
        setAlert("Error fetching form IDs.");
      }
    };
    fetchFormIds();
  }, []);
  //render functions
  //helper functions
  const setAlert = (
    alertMessage: string,
    severity: severity = "error",
    timeout: number = 5000,
  ) => {
    setAlerts(
      {
        message: alertMessage,
        severity: severity,
        show: true,
      },
      updateAlertProps,
      timeout,
    );
  };
  const validateSearch = (): boolean => {
    if (!currentFormId || currentFormId === "") {
      setAlert("Form ID is required.");
      return false;
    }
    if (isNaN(Number(currentFormId))) {
      setAlert("Form ID must be a number.");
      return false;
    }
    return true;
  };
  const handleSearch = async () => {
    if (!validateSearch()) {
      return;
    }
    // let params = new URLSearchParams();
    // params.append("formId", currentFormId.toString());
    // let userQuery =
    //   role == "Admin"
    //     ? ""
    //     : ` and createdBy eq ${user?.userPrincipalName ?? ""}`;
    // params.append("query", `id eq ${currentFormId}${userQuery}`);
    // params.append("orderBy", "id");

    // let response = await httpClient.getAsync<number>(
    //   `${httpClient.GetForm}?${params.toString()}`,
    //   undefined,
    //   updateAlertProps,
    //   undefined,
    //   updateIsLoading,
    // );
    // if (!response || response <= 0) {
    //   setAlert("Form not found.");
    //   return;
    // }
    navigate(`/form/${currentFormId}`);
  };

  return (
    <>
      <Container maxWidth="xs">
        <Stack marginBottom={4} marginTop={2} spacing={2}>
          <Typography variant="h4" fontWeight={600} color="primary">
            Go to Form:
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems="center">
          <Autocomplete
            fullWidth
            options={formIds}
            value={currentFormId}
            onChange={(event, newValue) => {
              setCurrentFormId(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="FormId" />}
          />
        </Stack>
        <Stack margin={2} spacing={2} alignItems="center">
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={
              isLoading ||
              !currentFormId ||
              currentFormId === "" ||
              currentFormId === "0"
            }
          >
            Search
          </Button>
        </Stack>
      </Container>
    </>
  );
}
