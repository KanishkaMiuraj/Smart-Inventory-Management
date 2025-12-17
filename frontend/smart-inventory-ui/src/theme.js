import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Vibrant Modern Blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#10b981', // Emerald Teal (Success/Growth)
    },
    background: {
      default: '#f8fafc', // Slate-50 (Very premium light grey)
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate-800 (Softer than pure black)
      secondary: '#64748b', // Slate-500
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Clean modern font
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' }, // No CAPS text
  },
  shape: {
    borderRadius: 16, // Modern rounded corners
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // "Apple-style" soft shadow
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)', // Glow effect on hover
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': { border: 0 },
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#f1f5f9', // Hover row effect
          },
        },
      },
    },
  },
});

export default theme;