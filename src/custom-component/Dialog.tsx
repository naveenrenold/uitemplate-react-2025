import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ConfirmationDialogProps } from "../Types/ComponentProps/ConfirmationProps";

export function ConfirmationDialog(props: ConfirmationDialogProps) {
  const {
    title,
    content,
    onButton1,
    onButton2,
    Button1 = "Yes",
    Button2 = "Cancel",
  } = props;
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content && typeof content === "object" ? (
          content.map((value, id) => {
            return <DialogContentText key={id}>{value}</DialogContentText>;
          })
        ) : (
          <>
            <DialogContentText>{content}</DialogContentText>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {onButton1 && (
          <Button
            variant="contained"
            onClick={() => {
              onButton1();
            }}
          >
            {Button1}
          </Button>
        )}
        {onButton2 && (
          <Button
            variant="outlined"
            onClick={() => {
              onButton2();
            }}
          >
            {Button2}
          </Button>
        )}
      </DialogActions>
    </>
  );
}
