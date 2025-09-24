import { useState, useRef } from "react";

import {
    Box,
    IconButton,
    ThemeProvider,
    CssBaseline,
    Icon,
} from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import FiniteAutomaton from "./components/FiniteAutomaton";
import StackAutomaton from "./components/StackAutomaton";
import ConfigPanel from "./components/ConfigPanel";
import LanguageSelector from "./components/LanguageSelector";

export default function App() {
    const [isDark, setIsDark] = useState<boolean>(true);
    const [machine, setMachine] = useState<string>("finite");
    const [simulate, setSimulate] = useState<
        ((inputString: string) => Promise<boolean>) | null
    >(null);

    const activeTool = useRef<string>("select");

    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <CssBaseline />
            <Box
                sx={{
                    height: "100vh",
                    width: "100%",
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
                    <Header onMachineChange={setMachine} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <LanguageSelector />

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
                    <Toolbar activeTool={activeTool} />

                    {(() => {
                        switch (machine) {
                            case "finite":
                                return (
                                    <FiniteAutomaton
                                        activeTool={activeTool}
                                        setSimulate={setSimulate}
                                    />
                                );
                            case "stack":
                                return (
                                    <StackAutomaton
                                        activeTool={activeTool}
                                        setSimulate={setSimulate}
                                    />
                                );
                            default:
                                return (
                                    <Box sx={{ color: "text.secondary", p: 2 }}>
                                        ...
                                    </Box>
                                );
                        }
                    })()}

                    <ConfigPanel simulate={simulate} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
