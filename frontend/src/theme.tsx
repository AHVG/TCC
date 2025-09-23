// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "hsl(225, 25%, 8%)",
      paper: "hsl(225, 20%, 12%)",
    },
    text: {
      primary: "hsl(220, 15%, 95%)",
      secondary: "hsl(225, 15%, 70%)",
    },
    primary: {
      main: "hsl(230, 70%, 60%)",
      light: "hsl(230, 70%, 70%)",
    },
    secondary: {
      main: "hsl(270, 60%, 25%)",
    },
    info: {
      main: "hsl(190, 85%, 55%)",
    },
    divider: "hsl(225, 15%, 20%)",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "hsl(220, 15%, 95%)",   // fundo claro
      paper: "hsl(0, 0%, 100%)",       // cards brancos
    },
    text: {
      primary: "hsl(225, 25%, 8%)",    // quase preto
      secondary: "hsl(225, 15%, 30%)", // cinza azulado
    },
    primary: {
      main: "hsl(230, 70%, 50%)",      // azul vibrante (um pouco mais escuro pro contraste)
      light: "hsl(230, 70%, 65%)",
    },
    secondary: {
      main: "hsl(270, 60%, 35%)",      // roxo mais vivo no claro
    },
    info: {
      main: "hsl(190, 85%, 45%)",      // ciano brilhante
    },
    divider: "hsl(225, 15%, 80%)",
  },
});
