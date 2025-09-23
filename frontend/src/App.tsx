import { useState } from "react";
import type { Core } from "cytoscape";

import { Box, Button, IconButton, ThemeProvider, CssBaseline, Icon } from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import Canva from "./components/Canva";
// import ConfigPanel from "./components/ConfigPanel"

export default function App() {
    const [isDark, setIsDark] = useState<boolean>(true);
    const [activeTool, setActiveTool] = useState<string>("select");

    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <CssBaseline />
            <Box
                sx={{
                    height: "100vh",
                    width: "100%", // deixa 100% do container pai, não do viewport
                    display: "flex",
                    flexDirection: "column",
                    p: "0px 150px",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Header
                        activeMachine=""
                        onMachineChange={(tool: string) => {}}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {/* talvez colocar no Header */}
                        <IconButton
                            size="small"
                            onClick={() => setIsDark(!isDark)}
                        >
                            {isDark ? (
                                <Icon className="material-symbols-outlined">
                                    sunny
                                </Icon>
                            ) : (
                                <Icon className="material-symbols-outlined">
                                    bedtime
                                </Icon>
                            )}
                        </IconButton>
                    </Box>
                </Box>

                <Box
                    sx={{
                        margin: "5px 0px 0px 0px",
                        display: "flex",
                        flexDirection: "row",
                        flexGrow: 1,
                        gap: 1,
                    }}
                >
                    <Toolbar
                        activeTool={activeTool}
                        onToolChange={setActiveTool}
                    />
                    <Canva
                        onInit={(cy: Core, cyRef: HTMLDivElement) => {
                            cy;
                            cyRef;
                        }}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
