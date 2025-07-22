import TextField from "@mui/material/TextField";
import {
  textFieldString,
  updateTextField,
} from "../Types/ComponentProps/TextFieldProps";

export function TextBox(props: TextBoxProps) {
  const { textFieldString, updateTextFieldString, readonly, multiline } = props;
  return (
    <TextField
      margin="normal"
      {...(multiline ? { minRows: 3, maxRows: 5, multiline: true } : {})}
      label={textFieldString.name}
      value={textFieldString.value}
      error={textFieldString.error}
      helperText={textFieldString.helperText}
      required={textFieldString.required ?? false}
      disabled={readonly}
      variant="filled"
      onChange={(e) => updateTextField(updateTextFieldString, e.target.value)}
    ></TextField>
  );
}

export default TextBox;

export interface TextBoxProps {
  textFieldString: textFieldString;
  updateTextFieldString: React.Dispatch<React.SetStateAction<textFieldString>>;
  readonly?: boolean;
  multiline?: boolean;
}
