import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import type { Core } from "cytoscape";
import { Box, Card } from "@mui/material";

interface CanvaProps {
    onInit?: (cy: Core, cyRef: HTMLDivElement) => void;
}

export default function Canva({ onInit }: CanvaProps) {
    const cyRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!cyRef.current) return;

        const cy = cytoscape({
            container: cyRef.current,
            elements: [],
            style: [
                {
                    selector: "node",
                    style: {
                        "background-color": "data(color)",
                        label: "data(label)",
                        color: "#fff",
                        "text-valign": "center",
                        "text-halign": "center",
                        "font-size": "12px",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 2,
                        "line-color": "#999",
                        "target-arrow-color": "#999",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        label: "data(label)",
                        "font-size": "10px",
                        "text-background-color": "#fff",
                        "text-background-opacity": 1,
                        "text-background-padding": "2px",
                    },
                },
            ],
            layout: {
                name: "preset",
            },
        });

        // Passa o cy para quem chamou o componente
        if (onInit) onInit(cy, cyRef.current);

        // Cleanup ao desmontar o componente
        return () => {
            cy.destroy();
        };
    }, []);

    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                margin: "5px",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    ref={cyRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#background.default",
                    }}
                />
            </Box>
        </Card>
    );
}
