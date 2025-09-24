import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import type { NodeSingular, Core } from "cytoscape";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import Canva from "./Canva";

interface StackAutomatonProps {
    activeTool: RefObject<string>;
    setSimulate: (simulate: (inputString: string) => Promise<boolean>) => void;
}

export default function StackAutomaton({
    activeTool,
    setSimulate,
}: StackAutomatonProps) {
    const { t } = useTranslation();

    const BACKEND_URL = "http://localhost:8000";

    const cy = useRef<Core | null>(null);
    const cyRef = useRef<HTMLDivElement | null>(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [inputSymbol, setInputSymbol] = useState("");
    const [popSymbol, setPopSymbol] = useState("");
    const [pushSymbol, setPushSymbol] = useState("");
    const [targetNode, setTargetNode] = useState<NodeSingular | null>(null);

    const selectedSource = useRef<NodeSingular | null>(null);

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
            if (evt.target === cy.current && activeTool.current === "state") {
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
            if (activeTool.current === "transition") {
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
        if (!selectedSource.current || !targetNode) {
            setOpenDialog(false);
            setInputSymbol("");
            setPopSymbol("");
            setPushSymbol("");
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
                currentLabel
                    ? `${currentLabel}\n${inputSymbol},${popSymbol}->${pushSymbol}`
                    : `${inputSymbol},${popSymbol}->${pushSymbol}`
            );
        } else {
            // cria nova
            cy.current?.add({
                group: "edges",
                data: {
                    id: `e${cy.current.edges().length}`,
                    source: selectedSource.current.id(),
                    target: targetNode.id(),
                    label: `${inputSymbol},${popSymbol}->${pushSymbol}`,
                },
            });
        }

        // reset
        selectedSource.current.style("border-width", "0px");
        selectedSource.current = null;

        setInputSymbol("");
        setPopSymbol("");
        setPushSymbol("");
        setTargetNode(null);
        setOpenDialog(false);
    };

    const handleSimulate = async (inputString: string): Promise<boolean> => {
        const core = cy.current;
        if (!core) return false;

        const states = core.nodes().map((n) => n.data("id"));
        const initialNodes = core.nodes().filter((n) => n.data("isInitial"));
        if (initialNodes.length !== 1) {
            alert(t("one_initial_state"));
            return false;
        }
        const finals = core
            .nodes()
            .filter((n) => n.data("isFinal"))
            .map((n) => n.data("id"));

        // Transições estruturadas com input, pop e push
        const transitions = core.edges().map((e) => {
            const [input, popPush] = e.data("label").split(",");
            const [pop, push] = popPush.split("->");
            return {
                source: e.data("source"),
                target: e.data("target"),
                symbol: input || "",
                stack_pop: pop || "",
                stack_push: push || "",
            };
        });

        try {
            const response = await fetch(`${BACKEND_URL}/simulate/PDA`, {
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
            return data.accepted;
        } catch (err) {
            console.error(err);
            alert(t("simulation_error"));
            return false;
        }
    };

    useEffect(() => {
        setSimulate(() => handleSimulate);
    }, [setSimulate]);

    return (
        <>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{t("dialog_title")}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t("input_symbol")}
                        fullWidth
                        value={inputSymbol}
                        onChange={(e) => setInputSymbol(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label={t("pop_symbol")}
                        fullWidth
                        value={popSymbol}
                        onChange={(e) => setPopSymbol(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label={t("push_symbol")}
                        fullWidth
                        value={pushSymbol}
                        onChange={(e) => setPushSymbol(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleConfirmTransition}
                        variant="contained"
                    >
                        {t("confirm")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Canva onInit={onInit} />
        </>
    );
}
