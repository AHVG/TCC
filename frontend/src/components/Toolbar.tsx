import { useState } from "react";
import { IconButton, Card, Icon } from "@mui/material";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

// Lista de ferramentas e seus ícones
const tools = [
  { name: "select", icon: "arrow_selector_tool" },
  { name: "state", icon: "circle" },
  { name: "initialState", icon: "play_arrow" },
  { name: "finalState", icon: "nest_thermostat_gen_3" },
  { name: "transition", icon: "arrow_right_alt" },
  { name: "save", icon: "save" },
];

export default function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  return (
    <Card
      elevation={0}
      sx={{
        margin: "5px",
        padding: "2px",
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      {tools.map((tool) => (
        <IconButton
          key={tool.name}
          onClick={() => onToolChange(tool.name)}
          sx={{
            color: activeTool === tool.name ? "primary.main" : "text.primary",
            bgcolor:
              activeTool === tool.name ? "info.main" : "transparent",
            "&:hover": {
              bgcolor:
                activeTool === tool.name ? "info.main" : "action.hover",
            },
            transition: "all 0.2s",
          }}
        >
          <Icon className="material-symbols-outlined">{tool.icon}</Icon>
        </IconButton>
      ))}
    </Card>
  );
}
