import { useState, useEffect } from "react";
import type { RefObject } from "react";
import { IconButton, Card, Icon } from "@mui/material";

interface ToolbarProps {
    activeTool: RefObject<string>;
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

export default function Toolbar({ activeTool }: ToolbarProps) {
    const [tool, setTool] = useState<string>("select");

    useEffect(() => {
        activeTool.current = tool;
    }, [tool]);

    return (
        <Card
            elevation={0}
            sx={{
                flex: "0 0 auto",
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
            {tools.map((t) => (
                <IconButton
                    key={t.name}
                    onClick={() => setTool(t.name)}
                    sx={{
                        color:
                            tool === t.name ? "primary.main" : "text.primary",
                        bgcolor: tool === t.name ? "info.main" : "transparent",
                        "&:hover": {
                            bgcolor:
                                tool === t.name ? "info.light" : "action.hover",
                        },
                        transition: "all 0.2s",
                    }}
                >
                    <Icon className="material-symbols-outlined">{t.icon}</Icon>
                </IconButton>
            ))}
        </Card>
    );
}
