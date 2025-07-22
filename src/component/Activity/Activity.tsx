import { useEffect, useState } from "react";
import { useLoginContext } from "../../context/LoginContextProvider";
import { useMainContext } from "../../context/MainContextProvider";
import httpClient from "../../helper/httpClient";
import { ActivityResponse, ActivityRows } from "../../Types/Component/Activity";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { useGridApiRef } from "@mui/x-data-grid";
import ReactDOM from "react-dom";

function Activity() {
  //constants
  const navigate = useNavigate();
  let apiRef = useGridApiRef();
  const { user, role } = useLoginContext();
  const {
    updateAlertProps,
    updateIsLoading,
    updateSnackBarProps,
    setAlerts,
    isMobile,
    isLoading,
  } = useMainContext();
  //useState
  const [activity, setActivity] = useState<ActivityResponse[]>([]);
  //useEffect

  useEffect(() => {
    httpClient
      .getAsync<
        ActivityResponse[]
      >(httpClient.GetActivity, undefined, undefined)
      .then((response) => {
        if (response && response.length > 0) {
          ReactDOM.flushSync(() => {
            setActivity(response);
            setTimeout(() => {
              apiRef.current?.autosizeColumns({
                expand: true,
                includeHeaders: true,
              });
            }, 1000);
            resizeColumns();
          });
        }
      });
  }, []);

  const resizeColumns = () => {
    setTimeout(() => {
      apiRef.current?.autosizeColumns({
        expand: true,
        includeHeaders: true,
      });
    }, 5000);
  };
  // useEffect(() => {
  //   setTimeout(() => {
  //     apiRef.current?.autosizeColumns({
  //       expand: true,
  //       includeHeaders: true,
  //     });
  //   }, 1000);
  // }, [activity]);
  //api calls
  //helper function
  const navigateToForm = (formId: string) => {
    navigate(`/form/${formId}`);
  };
  //render functions
  const columnsHeadings: GridColDef<ActivityResponse>[] = [
    {
      field: "activityId",
      headerName: "ActivityId",
      type: "number",
    },
    {
      field: "id",
      headerName: "Id",
      type: "string",
      hideable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="text"
            size="small"
            onClick={() => {
              navigateToForm(params.value);
            }}
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      field: "activityTypeName",
      headerName: "ActivityTypeName",
      type: "singleSelect",
      valueOptions: [
        "CreateForm",
        "UpdateForm",
        "DeleteForm",
        "AddAttachment",
        "DeleteAttachment",
      ],
    },
    {
      field: "createdBy",
      headerName: "CreatedBy",
      type: "string",
      valueGetter: (params: string) => {
        return params ? params.split("@")[0] : "User";
      },
    },
    {
      field: "createdOn",
      headerName: "CreatedOn",
      type: "string",
      valueFormatter: (params: Date) => {
        return params.toLocaleString();
      },
    },
    {
      field: "field",
      headerName: "Field",
      type: "string",
    },
    {
      field: "oldValue",
      headerName: "OldValue",
      type: "string",
    },
    {
      field: "newValue",
      headerName: "NewValue",
      type: "string",
    },
    {
      field: "comments",
      headerName: "Comments",
      type: "string",
    },
  ];

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        getRowId={(row) => row.activityId}
        density="compact"
        sx={isMobile ? { fontSize: "12px" } : {}}
        columns={columnsHeadings}
        rows={activity ?? []}
        onResize={resizeColumns}
        autosizeOptions={{
          expand: true,
          includeHeaders: true,
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        pagination
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: true,
              activityId: false,
              activityTypeName: true,
              createdBy: true,
              createdOn: true,
              field: true,
              oldValue: true,
              newValue: true,
              comments: true,
            },
          },
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
          sorting: {
            sortModel: [{ field: "activityId", sort: "desc" }],
          },
          // filter: {
          //   filterModel: {
          //     items: [
          //       {
          //         field: "statusName",
          //         operator: "is",
          //         value: "Submitted",
          //       },
          //     ],
          //   },
          // },
        }}
        showToolbar
      ></DataGrid>
    </>
  );
}

export default Activity;
