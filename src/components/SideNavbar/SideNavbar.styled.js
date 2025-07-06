import { styled } from "@mui/material/styles";
import {
  Drawer,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: "20%",
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: "20%",
    boxSizing: "border-box",
    backgroundColor: "#1976d2",
    color: "white",
  },
}));

export const StyledListItemButton = styled(ListItemButton)(
  ({ theme, selected }) => ({
    margin: "0 16px",
    borderRadius: 8,
    marginBottom: 8,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    ...(selected && {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      },
    }),
  })
);

export const StyledListItemText = styled(ListItemText)(
  ({ theme, selected }) => ({
    "& .MuiListItemText-primary": {
      fontWeight: selected ? "bold" : "normal",
    },
  })
);

export const AppTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  padding: 24,
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
}));
