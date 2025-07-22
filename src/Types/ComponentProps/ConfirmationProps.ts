export type ConfirmationDialogProps = {
  title: string;
  content: string | string[];
  onButton1?: () => void;
  onButton2?: () => void;
  Button1?: string;
  Button2?: string;
};