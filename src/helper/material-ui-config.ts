import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      mode: 'light',
    primary: {
      main: '#458f07',
      contrastText: 'rgba(245,240,240,0.87)',
    },
    secondary: {
      main: '#888f07',
      contrastText: 'rgba(245,243,243,0.87)',
    },
      contrastThreshold: 4.5,
    }
  });