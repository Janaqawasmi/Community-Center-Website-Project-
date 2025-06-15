import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Cairo, sans-serif',
  },
  palette: {
    primary: {
      main: '#2563eb',
    },
  },
});

export default theme;