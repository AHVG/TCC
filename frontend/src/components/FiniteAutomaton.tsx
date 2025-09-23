import { useRef, useState } from "react";
import type { NodeSingular, Core } from "cytoscape";
import {
    Box,
    Button,
    Typography,
    Divider,
    TextField,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import Canva from "./Canva";

export default function FiniteAutomaton() {
    const BACKEND_URL = "http://localhost:8000";

    const cy = useRef<Core | null>(null);
    const cyRef = useRef<HTMLDivElement | null>(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [transitionSymbol, setTransitionSymbol] = useState("");
    const [targetNode, setTargetNode] = useState<NodeSingular | null>(null);

    const [inputString, setInputString] = useState("");
    const [simulationResult, setSimulationResult] = useState(null);
    const [, setForceUpdate] = useState(0);
    const forceRerender = () => setForceUpdate((n) => n + 1);

    const createStateMode = useRef(false);
    const transitionMode = useRef(false);
    const selectedSource = useRef<NodeSingular | null>(null);

    const toggleCreateStateMode = () => {
        createStateMode.current = !createStateMode.current;
        transitionMode.current = false;
        selectedSource.current = null;
        forceRerender();
    };

    const toggleTransitionMode = () => {
        if (selectedSource.current) {
            selectedSource.current.style("border-width", "0px");
        }
        transitionMode.current = !transitionMode.current;
        createStateMode.current = false;
        selectedSource.current = null;
        forceRerender();
    };

    const onInit = (initCy: Core, initCyRef: HTMLDivElement) => {
        cy.current = initCy;
        cyRef.current = initCyRef;

        const core = cy.current;
        if (!core) return;

        handleSetUp(core);
    };

    const handleSetUp = (core: Core) => {
        // Criar estado
        core.on("tap", (evt) => {
            console.log("Criando estado...");
            if (evt.target === cy.current && createStateMode.current) {
                const pos = evt.position;
                const id = `q${core.nodes().length}`;
                core.add({
                    group: "nodes",
                    data: {
                        id,
                        label: id,
                        color: "#1976d2",
                        isInitial: false,
                        isFinal: false,
                    },
                    position: pos,
                });
            }
        });

        // Criar transição
        core.on("tap", "node", (evt) => {
            console.log("Criando transição...");
            if (transitionMode.current) {
                const node = evt.target;
                if (!selectedSource.current) {
                    selectedSource.current = node;
                    node.style("border-width", "3px");
                    node.style("border-color", "#d32f2f");
                } else {
                    setTargetNode(node);
                    setOpenDialog(true);
                }
            }
        });

        // Clique direito para definir estado inicial/final
        core.on("cxttap", "node", (evt) => {
            console.log("Definindo tipo de estado...");

            const node = evt.target;
            const data = node.data();

            if (!data.isInitial && !data.isFinal) {
                data.isInitial = true;
                node.data(data);
                node.style("background-color", "#4caf50");
            } else if (data.isInitial && !data.isFinal) {
                data.isInitial = false;
                data.isFinal = true;
                node.data(data);
                node.style("background-color", "#f44336");
            } else if (!data.isInitial && data.isFinal) {
                data.isInitial = true;
                node.data(data);
                node.style("background-color", "#9c27b0");
            } else {
                data.isInitial = false;
                data.isFinal = false;
                node.data(data);
                node.style("background-color", "#1976d2");
            }
        });
    };

    const handleConfirmTransition = () => {
        if (!selectedSource.current || !targetNode || !transitionSymbol) {
            setOpenDialog(false);
            setTransitionSymbol("");
            return;
        }
    
        // procura se já existe edge entre os dois nós
        const existingEdge = cy.current
            ?.edges()
            .filter(
                (e) =>
                    e.data("source") === selectedSource.current?.id() &&
                    e.data("target") === targetNode.id()
            )
            .first();
    
        if (existingEdge && existingEdge.nonempty()) {
            // já existe, só concatena
            const currentLabel = existingEdge.data("label");
            existingEdge.data(
                "label",
                currentLabel ? `${currentLabel},${transitionSymbol}` : transitionSymbol
            );
        } else {
            // cria nova
            cy.current?.add({
                group: "edges",
                data: {
                    id: `e${cy.current.edges().length}`,
                    source: selectedSource.current.id(),
                    target: targetNode.id(),
                    label: transitionSymbol,
                },
            });
        }
    
        // reset
        selectedSource.current.style("border-width", "0px");
        selectedSource.current = null;
    
        setTransitionSymbol("");
        setTargetNode(null);
        setOpenDialog(false);
    };
    

    const handleSimulate = async () => {
        console.log("Simulando...");
        const core = cy.current;
        if (!core) return;

        const states = core.nodes().map((n) => n.data("id"));
        const transitions = core.edges().map((e) => ({
            source: e.data("source"),
            target: e.data("target"),
            symbol: e.data("label"),
        }));
        const initialNodes = core.nodes().filter((n) => n.data("isInitial"));
        if (initialNodes.length !== 1) {
            alert("There must be exactly one initial state.");
            return;
        }
        const finals = core
            .nodes()
            .filter((n) => n.data("isFinal"))
            .map((n) => n.data("id"));

        try {
            const response = await fetch(`${BACKEND_URL}/simulate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    automaton: {
                        states,
                        transitions,
                        initial: initialNodes[0].data("id"),
                        finals,
                    },
                    input_string: inputString,
                }),
            });
            const data = await response.json();
            setSimulationResult(data.accepted);
        } catch (err) {
            console.error(err);
            alert("Error simulating automaton.");
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
            <Box
                sx={{
                    width: 280,
                    bgcolor: "grey.100",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    borderRight: "1px solid #ddd",
                }}
            >
                <Typography variant="h6" color="#666" gutterBottom>
                    Tools
                </Typography>

                <Button
                    variant={createStateMode.current ? "contained" : "outlined"}
                    color={createStateMode.current ? "success" : "primary"}
                    fullWidth
                    sx={{ mb: 1 }}
                    onClick={toggleCreateStateMode}
                >
                    {createStateMode.current
                        ? "Click on canvas..."
                        : "Create State"}
                </Button>

                <Button
                    variant={transitionMode.current ? "contained" : "outlined"}
                    color={transitionMode.current ? "error" : "primary"}
                    fullWidth
                    sx={{ mb: 2 }}
                    onClick={toggleTransitionMode}
                >
                    {transitionMode.current
                        ? "Transition Mode Active"
                        : "Create Transition"}
                </Button>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Enter transition symbol</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Symbol"
                            fullWidth
                            value={transitionSymbol}
                            onChange={(e) =>
                                setTransitionSymbol(e.target.value)
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmTransition}
                            variant="contained"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                <TextField
                    label="Input String"
                    value={inputString}
                    onChange={(e) => setInputString(e.target.value)}
                    fullWidth
                    sx={{ mb: 1 }}
                />

                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleSimulate}
                >
                    Simulate
                </Button>

                {simulationResult !== null && (
                    <Alert
                        severity={simulationResult ? "success" : "error"}
                        sx={{ mt: 2 }}
                    >
                        {simulationResult ? "Accepted ✅" : "Rejected ❌"}
                    </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="#666">
                    <b>Create State:</b> click the button and then on the
                    canvas.
                    <br />
                    <b>Create Transition:</b> click the button, select source
                    and target nodes, then enter the symbol.
                    <br />
                    <b>Right-click node:</b> cycles Initial → Final →
                    Initial+Final → Normal.
                    <br />
                    <b>Simulation:</b> type input string and click Simulate.
                </Typography>
            </Box>

            <Canva onInit={onInit} />
        </Box>
    );
}
