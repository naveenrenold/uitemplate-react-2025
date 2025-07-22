import {
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import {
  Attachment,
  AttachmentResponse,
  FormRequest,
  FormResponse,
  Process,
} from "../../Types/Component/Form";
import {
  defaultTextFieldString,
  textFieldString,
  validateTextField,
} from "../../Types/ComponentProps/TextFieldProps";
import { useMainContext } from "../../context/MainContextProvider";
import { useLoginContext } from "../../context/LoginContextProvider";
import style from "./Form.module.css";
import httpClient from "../../helper/httpClient";
import { useNavigate, useParams } from "react-router";
import { severity } from "../../Types/ComponentProps/ButtonProps";
import TextBox from "../../custom-component/TextBox";
import { set } from "date-fns";
import { ConfirmationDialogProps } from "../../Types/ComponentProps/ConfirmationProps";
import { ConfirmationDialog } from "../../custom-component/Dialog";
import { on } from "events";
import { MaxFileSize } from "../../Constant";

function Form() {
  //constants
  //usestate
  const [fileIndex, updateFileIndex] = useState<number>(1);
  const [checked, updateChecked] = useState<boolean>(false);
  const [existingForm, updateExistingForm] = useState<FormResponse | null>(
    null,
  );
  const [existingAttachments, updateExistingAttachments] = useState<
    AttachmentResponse[] | null
  >(null);

  let params = useParams();
  const [formId, updateFormId] = useState<string>();
  const [currentDialog, updateCurrentDialog] = useState<FormDialogType>(
    FormDialogType.None,
  );
  const [formMode, updateFormMode] = useState<FormMode>(FormMode.Create);
  let [selectedFile, updateSelectedFile] = useState({
    filePath: "",
    fileName: "",
  });
  const { user, role } = useLoginContext();
  const {
    updateAlertProps,
    updateIsLoading,
    updateSnackBarProps,
    setAlerts,
    isMobile,
    isLoading,
  } = useMainContext();
  const [customerName, updatecustomerName] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Customer Name",
    type: "text",
    required: true,
  });
  const [customerAddress, updateCustomerAddress] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Customer Address",
    type: "text",
    required: true,
  });
  const [currentProcess, updateCurrentProcess] = useState(0);
  const [process, updateProcess] = useState<Process[]>([
    { processId: 0, processName: "" },
  ]);
  const [attachments, updateAttachments] = useState<Attachment[]>([]);
  const [deleteAttachments, updateDeleteAttachments] = useState<number[]>([]);
  const [phoneNumber, updatePhoneNumber] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Phone Number",
    type: "phone",
    required: true,
  });
  const [phoneNumber2, updatePhoneNumber2] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Phone Number 2",
    type: "phone",
  });
  const navigate = useNavigate();

  //useeffect
  useEffect(() => {
    const getProcess = async () => {
      await httpClient
        .getAsync<Process[]>(httpClient.GetProcess)
        .then((response) => {
          if (response && response.length > 0) {
            {
              updateProcess(response);
              updateCurrentProcess((prev) =>
                prev == 0 ? response[0].processId : prev,
              );
            }
          }
        });
    };
    const getExistingForm = async (formId: string) => {
      updateFormMode(FormMode.View);
      let queryParams = new URLSearchParams();
      let query;
      if (role === "Admin") {
        query = `id eq ${formId}`;
      } else if (user?.userPrincipalName) {
        query = `CreatedBy eq ${user?.userPrincipalName} and id eq ${formId}`;
      } else {
        query = `id eq ${formId}`;
      }
      queryParams.append("query", query);
      queryParams.append("createdBy", `${user?.userPrincipalName ?? ""}`);
      queryParams.append("orderBy", "id");
      queryParams.append("sortBy", "desc");

      httpClient
        .getAsync<
          FormResponse[]
        >(httpClient.GetForm + `?${queryParams.toString()}`)
        .then((responseList) => {
          let response =
            responseList && responseList.length > 0 ? responseList[0] : null;
          updateExistingForm(response);
          if (!response) {
            setAlerts(
              {
                message: `You are not authorized to view form ${formId}. Redirecting to home page`,
                severity: "error",
                show: true,
              },
              updateAlertProps,
              2000,
            );
            setTimeout(() => {
              navigate("/");
            }, 2000);
            return;
          }
          if (response) {
            updateFormId(params.formId);
            console.log(
              "Customer access value:" +
                import.meta.env.VITE_EnableCustomerAccess,
            );
            if (
              !user?.userPrincipalName &&
              response.createdBy !== user?.userPrincipalName &&
              role !== "Admin" &&
              import.meta.env.VITE_EnableCustomerAccess === "false"
            ) {
              setAlerts(
                {
                  message: `You are not authorized to view form ${formId}. Redirecting to home page`,
                  severity: "error",
                  show: true,
                },
                updateAlertProps,
                2000,
              );
              setTimeout(() => {
                navigate("/");
              }, 2000);
              return;
            }
            updateFormMode(FormMode.View);
            if (
              role === "Admin" ||
              (response.createdBy === user?.userPrincipalName &&
                new Date(response.createdOn) >
                  set(new Date(), {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0,
                  }))
            ) {
              updateFormMode(FormMode.CanEdit);
            }
            if (response.statusName === "Completed") {
              updateChecked(true);
              updateFormMode(FormMode.Complete);
            }
            updatecustomerName((prev) => ({
              ...prev,
              value: response.customerName ?? "",
              error: false,
              helperText: "",
            }));
            updateCustomerAddress((prev) => ({
              ...prev,
              value: response.customerAddress ?? "",
              error: false,
              helperText: "",
            }));
            updateCurrentProcess(response.processId ?? 0);
            updatePhoneNumber((prev) => ({
              ...prev,
              value: response.phoneNumber ?? "",
              error: false,
              helperText: "",
            }));
            updatePhoneNumber2((prev) => ({
              ...prev,
              value: response.phoneNumber2 ?? "",
              error: false,
              helperText: "",
            }));
          }
        });
    };

    const getAttachments = async (formId: string) => {
      let queryParams = new URLSearchParams();
      let query;
      if (role === "Admin") {
        query = `id eq ${formId}`;
      } else if (user?.userPrincipalName) {
        query = `UploadedBy eq ${user?.userPrincipalName} and id eq ${formId}`;
      } else {
        query = `id eq ${formId}`;
      }
      queryParams.append("query", query);
      queryParams.append("orderBy", "attachmentId");
      httpClient
        .getAsync<
          AttachmentResponse[]
        >(httpClient.GetAttachments + `?${queryParams.toString()}`)
        .then(async (response) => {
          if (response && response.length > 0) {
            updateFileIndex((prev) => prev + (response ? response.length : 0));
            response = await Promise.all(
              response.map(async (attachment) => {
                const blob = await fetch(
                  `data:${attachment.fileType};base64,${attachment.fileContent}`,
                ).then(async (res) => await res.blob());
                return {
                  attachmentId: attachment.attachmentId,
                  fileName: attachment.fileName,
                  fileSizeInKb: attachment.fileSize
                    ? attachment.fileSize / 1024
                    : 0,
                  filePath: URL.createObjectURL(blob),
                  fileType: attachment.fileType,
                };
              }),
            );
            updateExistingAttachments(response);
            updateAttachments(response);
          }
        });
    };

    getProcess();
    if (
      params.formId &&
      params.formId !== "" &&
      !isNaN(Number(params.formId))
    ) {
      getExistingForm(params.formId);
      getAttachments(params.formId);
    }
  }, []);
  //other api calls
  const postForm = async () => {
    if (!validateForm()) {
      return;
    }
    let formRequest: FormData = new FormData();
    const requestBody: FormRequest = {
      form: {
        customerName: customerName.value ?? "",
        customerAddress: customerAddress.value ?? "",
        typeId: 1,
        processId: currentProcess,
        lastUpdatedBy: user?.userPrincipalName ?? "",
        location: user?.officeLocation ?? "",
        phoneNumber: phoneNumber.value ?? "",
        phoneNumber2: phoneNumber2.value ?? "",
      },
    };
    if (formId && formId !== "" && !isNaN(Number(formId))) {
      requestBody.form.id = Number(formId);
      requestBody.form.statusId = checked ? 4 : 2;
      requestBody.deleteAttachments = deleteAttachments;
    }
    formRequest.append("request", JSON.stringify(requestBody));
    for (const attachment of attachments) {
      if (attachment.filePath) {
        const file = await fetch(attachment.filePath).then((res) => res.blob());
        formRequest.append("attachments", file, attachment.fileName);
      }
    }
    httpClient
      .postAsync<string>(
        httpClient.GetForm,
        formRequest,
        undefined,
        undefined,
        false,
        true,
      )
      .then((response) => {
        if (response) {
          setAlert(response, "success", 3000);
          updateFormMode(FormMode.View);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      });
  };
  //render functions
  const attachmentForRender = () => {
    let imgsInARow = isMobile ? 2 : 5;
    let attachmentElements: Attachment[][] = [];
    for (let i = 0; i < attachments.length; i = i + imgsInARow) {
      attachmentElements.push(attachments.slice(i, i + imgsInARow));
    }
    return attachmentElements;
  };
  const setDialog = () => {
    switch (currentDialog) {
      case FormDialogType.DeleteAttachment:
        return deleteAttachmentDialog();
      case FormDialogType.ConfirmCheckBox:
        return confirmCheckBoxDialog();
      default:
        return <></>;
    }
  };

  const onDeleteAttachment = () => {
    if (formId && formId !== "" && !isNaN(Number(formId))) {
      updateCurrentDialog(FormDialogType.DeleteAttachment);
    } else {
      deleteAttachment();
    }
  };

  const deleteAttachmentDialog = () => {
    const deleteAttachmentProps: ConfirmationDialogProps = {
      title: "Delete Attachment",
      content: `Are you sure you want to delete attachment  ${selectedFile.fileName}?`,
      onButton1: () => {
        deleteAttachment();
        updateCurrentDialog(FormDialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(FormDialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...deleteAttachmentProps}></ConfirmationDialog>
      </>
    );
  };

  const confirmCheckBoxDialog = () => {
    const confirmCheckBoxProps: ConfirmationDialogProps = {
      title: "Confirmation",
      content: `Are you sure you want to mark form as verified?`,
      onButton1: () => {
        updateChecked((prev) => !prev);
        updateFormMode((prev) =>
          prev != FormMode.Submit ? FormMode.Submit : FormMode.View,
        );
        updateCurrentDialog(FormDialogType.None);
      },
      onButton2: () => {
        updateCurrentDialog(FormDialogType.None);
      },
    };
    return (
      <>
        <ConfirmationDialog {...confirmCheckBoxProps}></ConfirmationDialog>
      </>
    );
  };
  const submitButton = () => {
    switch (formMode) {
      case FormMode.Submit:
        return "Complete";
      case FormMode.Edited:
        return "Update";
      default:
        return "Submit";
    }
  };
  //helper funtions
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    let fileAttachments: Attachment[] = [];
    if (fileList && fileList.length > 0) {
      updateFileIndex((prev) => prev + 1);
      fileAttachments = Array.from(fileList).map((file, index) => {
        return {
          fileName: `${file.name.split(".")[0]}-${fileIndex}.${file.name.split(".").slice(-1)[0]}`,
          fileSizeInKb: file.size / 1024,
          filePath: URL.createObjectURL(file),
          fileType: file.type,
        };
      });
    }
    if (validateAttachments(fileAttachments)) {
      updateAttachments((prev) => [
        ...prev,
        ...fileAttachments.filter((attachment) => {
          return !prev.some(
            (existingAttachment) =>
              existingAttachment.fileName === attachment.fileName,
          );
        }),
      ]);
    }
  };

  const checkFormUpdated = (): boolean => {
    if (
      customerName.value !== existingForm?.customerName ||
      customerAddress.value !== existingForm?.customerAddress ||
      phoneNumber.value !== existingForm?.phoneNumber ||
      phoneNumber2.value !== existingForm?.phoneNumber2 ||
      currentProcess !== existingForm?.processId ||
      (existingAttachments && existingAttachments.length) !==
        attachments.length ||
      deleteAttachments.length > 0
    ) {
      return true;
    }
    return false;
  };

  const deleteAttachment = () => {
    let attachmentIds = attachments
      .filter(
        (attachment) =>
          attachment.filePath === selectedFile.filePath &&
          attachment.attachmentId &&
          attachment.attachmentId > 0,
      )
      .map((attachment) => attachment.attachmentId!);
    if (attachmentIds && attachmentIds.length > 0) {
      updateDeleteAttachments((prev) => [...prev, attachmentIds[0]]);
    }
    updateAttachments((prev) => {
      return attachments.filter(
        (attachment) => attachment.filePath != selectedFile.filePath,
      );
    });
  };

  const validateAttachments = (fileAttachments: Attachment[]): boolean => {
    if (!fileAttachments || fileAttachments.length === 0) {
      return false;
    }
    if (
      fileAttachments.some((fileAttachment) =>
        attachments.find(
          (attachment) => attachment.fileName === fileAttachment.fileName,
        ),
      )
    ) {
      setAlert("File with same name already exists");
      return false;
    }
    if (fileAttachments.length > 10) {
      setAlert("Maximum 10 attachments allowed");
      return false;
    }
    for (const attachment of fileAttachments) {
      if (!attachment.fileName) {
        setAlert("fileName is required");
        return false;
      }
      if (
        !attachment.filePath ||
        !attachment.fileSizeInKb ||
        attachment.fileSizeInKb < 0 ||
        !attachment.fileType
      ) {
        setAlert("Invalid File");
        return false;
      }
      if (
        !attachment.fileType?.startsWith("image") &&
        !attachment.fileType?.endsWith("pdf")
      ) {
        setAlert(
          `Only img or pdf files allowed. Error in ${attachment.fileName}`,
        );
        return false;
      }
      if (attachment.fileSizeInKb > MaxFileSize) {
        setAlert(
          `File size should be less than ${MaxFileSize} KB. Error in ${attachment.fileName} with size ${attachment.fileSizeInKb} Kbs Use a website like https://compressjpeg.com/`,
        );
        return false;
      }
    }
    return true;
  };
  const setAlert = (
    alertMessage: string,
    severity: severity = "error",
    timeout: number = 5000,
  ) =>
    setAlerts(
      {
        message: alertMessage,
        severity: severity,
        show: true,
      },
      updateAlertProps,
      timeout,
    );

  const validateForm = (): boolean => {
    if (
      !(
        validateTextField(customerName, updatecustomerName, 3, 30, setAlert) &&
        validateTextField(
          customerAddress,
          updateCustomerAddress,
          5,
          200,
          setAlert,
        ) &&
        validateTextField(
          phoneNumber,
          updatePhoneNumber,
          undefined,
          undefined,
          setAlert,
        ) &&
        validateTextField(
          phoneNumber2,
          updatePhoneNumber2,
          undefined,
          undefined,
          setAlert,
        )
      )
    ) {
      return false;
    }

    if (currentProcess <= 0) {
      setAlert("Please select a process");
      return false;
    }
    if (attachments.length === 0) {
      setAlert("Please attach at least one file");
      return false;
    }
    if (attachments.length > 10) {
      setAlert("Maximum 10 attachments allowed");
      return false;
    }
    return true;
  };

  const readOnlyField = () => {
    return [
      FormMode.View,
      FormMode.CanEdit,
      FormMode.Submit,
      FormMode.Complete,
    ].includes(formMode);
  };

  const onEditClick = () => {
    if (formMode == FormMode.Edited) {
      resetToExistingForm();
      updateFormMode((prev) =>
        prev == FormMode.CanEdit ? FormMode.Edit : FormMode.CanEdit,
      );
    } else if (checkFormUpdated()) {
      updateFormMode(FormMode.Edited);
    } else {
      updateFormMode((prev) =>
        prev == FormMode.CanEdit ? FormMode.Edit : FormMode.CanEdit,
      );
    }
  };

  const resetToExistingForm = () => {
    updatecustomerName((prev) => ({
      ...prev,
      value: existingForm?.customerName ?? "",
    }));
    updateCustomerAddress((prev) => ({
      ...prev,
      value: existingForm?.customerAddress ?? "",
    }));
    updatePhoneNumber((prev) => ({
      ...prev,
      value: existingForm?.phoneNumber ?? "",
    }));
    updatePhoneNumber2((prev) => ({
      ...prev,
      value: existingForm?.phoneNumber2 ?? "",
    }));
    updateCurrentProcess(existingForm?.processId ?? 0);
    updateAttachments(
      existingAttachments?.map((attachment) => {
        return {
          fileName: attachment.fileName ?? "",
          filePath: attachment.filePath ?? "",
          fileSizeInKb: attachment.fileSize ? attachment.fileSize / 1024 : 0,
          fileType: attachment.fileType ?? "",
        };
      }) ?? [],
    );
    updateDeleteAttachments([]);
  };
  //render
  return (
    <>
      <Dialog
        open={currentDialog != FormDialogType.None}
        onClose={() => {
          updateCurrentDialog(FormDialogType.None);
        }}
      >
        {setDialog()}
      </Dialog>
      <Container maxWidth="xs">
        <Stack justifyContent={"space-between"} direction={"row"} marginTop={1}>
          <Typography
            variant="h5"
            fontWeight={800}
            color="primary"
            className={style.textshadowsec}
          >
            Form: {formId ?? formId}{" "}
            {FormMode.Complete === formMode && "(Completed)"}
          </Typography>
          {[FormMode.CanEdit, FormMode.Edit, FormMode.Edited].includes(
            formMode,
          ) && (
            <Button size="small" variant="contained" onClick={onEditClick}>
              {[FormMode.Edit].includes(formMode)
                ? "Save Edits"
                : [FormMode.Edited].includes(formMode)
                  ? "Reset"
                  : "Edit"}
            </Button>
          )}
        </Stack>
        <Stack>
          <TextBox
            {...{
              textFieldString: customerName,
              updateTextFieldString: updatecustomerName,
              readonly: readOnlyField(),
            }}
          ></TextBox>
        </Stack>
        <Stack>
          <TextBox
            {...{
              textFieldString: customerAddress,
              updateTextFieldString: updateCustomerAddress,
              readonly: readOnlyField(),
              multiline: true,
            }}
          ></TextBox>
        </Stack>
        <Stack>
          <TextField
            select
            label="Process"
            required
            disabled={readOnlyField()}
            value={currentProcess}
            variant="filled"
            onChange={(e) => {
              updateCurrentProcess(Number(e.target.value));
            }}
          >
            {process.map((process) => {
              return (
                <MenuItem key={process.processId} value={process.processId}>
                  {process.processName}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
        <Stack direction={"row"} spacing={2} marginTop={2}>
          <TextBox
            {...{
              textFieldString: phoneNumber,
              updateTextFieldString: updatePhoneNumber,
              readonly: readOnlyField(),
            }}
          ></TextBox>
          <TextBox
            {...{
              textFieldString: phoneNumber2,
              updateTextFieldString: updatePhoneNumber2,
              readonly: readOnlyField(),
            }}
          ></TextBox>
        </Stack>
        <Stack direction={"row"} spacing={2} marginTop={2}>
          <Button
            variant="contained"
            component="label"
            disabled={readOnlyField()}
          >
            Browse
            <input
              hidden
              onChange={handleFileChange}
              type="file"
              title="browse"
              multiple
              accept="image/png, image/jpg, image/jpeg, application/pdf"
            ></input>
          </Button>
        </Stack>
        {attachmentForRender().map((attachmentGroup, i) => {
          return (
            <div key={i}>
              <Stack direction={"row"} spacing={2} marginTop={2}>
                {attachmentGroup.map((attachment, index) => {
                  return (
                    <div key={index}>
                      <Stack
                        direction={"column"}
                        key={index}
                        alignItems={"center"}
                      >
                        <a href={attachment.filePath} target="_blank">
                          {attachment.fileType == "application/pdf" ? (
                            <img
                              className="h-16 w-30"
                              src={attachment.filePath}
                              title={attachment.fileName}
                            ></img>
                          ) : (
                            <img
                              className="h-16 w-30"
                              src={attachment.filePath}
                              title={attachment.fileName}
                            ></img>
                          )}
                        </a>
                        <Chip
                          label={attachment.fileName}
                          disabled={readOnlyField()}
                          className=".overflow-ellipsis h-16 w-30"
                          sx={{ fontSize: "12px" }}
                          variant="outlined"
                          key={index}
                          component={"a"}
                          onDelete={() => {
                            updateSelectedFile({
                              filePath: attachment.filePath ?? "",
                              fileName: attachment.fileName ?? "",
                            });
                            onDeleteAttachment();
                          }}
                        ></Chip>
                      </Stack>
                    </div>
                  );
                })}
              </Stack>
            </div>
          );
        })}
        <Stack
          direction={"row"}
          spacing={2}
          marginTop={2}
          alignItems={"center"}
        >
          {[
            FormMode.View,
            FormMode.CanEdit,
            FormMode.Submit,
            FormMode.Complete,
          ].includes(formMode) && (
            <>
              <Checkbox
                checked={checked}
                onChange={() => {
                  updateCurrentDialog(FormDialogType.ConfirmCheckBox);
                }}
                disabled={[
                  FormMode.Complete,
                  FormMode.Submit,
                  FormMode.View,
                ].includes(formMode)}
              ></Checkbox>
              <Typography color="primary" fontSize={14}>
                All documents are processed and returned to customer
              </Typography>
            </>
          )}
        </Stack>
        <Stack
          direction={"row"}
          spacing={2}
          marginTop={2}
          justifyContent={"center"}
        >
          {/* <Button variant="contained">Save</Button> */}
          {![FormMode.Complete].includes(formMode) && (
            <Button
              variant="contained"
              onClick={postForm}
              disabled={
                formMode == FormMode.View ||
                formMode == FormMode.Edit ||
                isLoading
              }
            >
              {submitButton()}
            </Button>
          )}
        </Stack>
      </Container>
    </>
  );
}
export default Form;

export enum FormDialogType {
  "None",
  "DeleteAttachment",
  "ConfirmCheckBox",
}

export enum FormMode {
  "Create" = 1,
  "View" = 2,
  "CanEdit" = 4,
  "Edit" = 3,
  "Edited" = 5,
  "Submit" = 6,
  "Complete" = 7,
}
