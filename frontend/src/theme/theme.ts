import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0B5CAD",
      dark: "#084982",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#2E7D32"
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#17202A",
      secondary: "#5C6670"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: "var(--font-montserrat), Arial, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: 0
    },
    h2: {
      fontWeight: 800,
      letterSpacing: 0
    },
    h3: {
      fontWeight: 700,
      letterSpacing: 0
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0,
      textTransform: "none"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 2px rgba(23, 32, 42, 0.08)"
        }
      }
    }
  }
});
