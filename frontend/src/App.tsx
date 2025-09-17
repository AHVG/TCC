import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { Box, Button, Typography, Divider, TextField, Alert } from "@mui/material";

export default function App() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);

  const createStateMode = useRef(false);
  const transitionMode = useRef(false);
  const selectedSource = useRef(null);

  const [inputString, setInputString] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [, setForceUpdate] = useState(0);
  const forceRerender = () => setForceUpdate((n) => n + 1);

  const BACKEND_URL = "http://localhost:8000"; // ajuste se necessário

  useEffect(() => {
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
      layout: { name: "preset" },
    });

    // Criar estado
    cy.on("tap", (evt) => {
      if (evt.target === cy && createStateMode.current) {
        const pos = evt.position;
        const id = `q${cy.nodes().length}`;
        cy.add({
          group: "nodes",
          data: { id, label: id, color: "#1976d2", isInitial: false, isFinal: false },
          position: pos,
        });
      }
    });

    // Criar transição
    cy.on("tap", "node", (evt) => {
      if (transitionMode.current) {
        const node = evt.target;
        if (!selectedSource.current) {
          selectedSource.current = node;
          node.style("border-width", "3px");
          node.style("border-color", "#d32f2f");
        } else if (selectedSource.current.id() === node.id()) {
          selectedSource.current.style("border-width", "0px");
          selectedSource.current = null;
        } else {
          const symbol = prompt("Enter transition symbol:");
          if (!symbol) {
            selectedSource.current.style("border-width", "0px");
            selectedSource.current = null;
            return;
          }
          cy.add({
            group: "edges",
            data: {
              id: `e${cy.edges().length}`,
              source: selectedSource.current.id(),
              target: node.id(),
              label: symbol,
            },
          });
          selectedSource.current.style("border-width", "0px");
          selectedSource.current = null;
        }
      }
    });

    // Clique direito para definir estado inicial/final
    cy.on("cxttap", "node", (evt) => {
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

    cyInstance.current = cy;
  }, []);

  const toggleCreateStateMode = () => {
    createStateMode.current = !createStateMode.current;
    transitionMode.current = false;
    selectedSource.current = null;
    forceRerender();
  };

  const toggleTransitionMode = () => {
    transitionMode.current = !transitionMode.current;
    createStateMode.current = false;
    selectedSource.current = null;
    forceRerender();
  };

  const handleSimulate = async () => {
    const cy = cyInstance.current;
    if (!cy) return;

    const states = cy.nodes().map((n) => n.data("id"));
    const transitions = cy.edges().map((e) => ({
      source: e.data("source"),
      target: e.data("target"),
      symbol: e.data("label"),
    }));
    const initialNodes = cy.nodes().filter((n) => n.data("isInitial"));
    if (initialNodes.length !== 1) {
      alert("There must be exactly one initial state.");
      return;
    }
    const finals = cy.nodes().filter((n) => n.data("isFinal")).map((n) => n.data("id"));

    try {
      const response = await fetch(`${BACKEND_URL}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automaton: { states, transitions, initial: initialNodes[0].data("id"), finals },
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
      {/* Sidebar */}
      <Box sx={{ width: 280, bgcolor: "grey.100", display: "flex", flexDirection: "column", p: 2, borderRight: "1px solid #ddd" }}>
        <Typography variant="h6" color="#666" gutterBottom>Tools</Typography>

        <Button
          variant={createStateMode.current ? "contained" : "outlined"}
          color={createStateMode.current ? "success" : "primary"}
          fullWidth
          sx={{ mb: 1 }}
          onClick={toggleCreateStateMode}
        >
          {createStateMode.current ? "Click on canvas..." : "Create State"}
        </Button>

        <Button
          variant={transitionMode.current ? "contained" : "outlined"}
          color={transitionMode.current ? "error" : "primary"}
          fullWidth
          sx={{ mb: 2 }}
          onClick={toggleTransitionMode}
        >
          {transitionMode.current ? "Transition Mode Active" : "Create Transition"}
        </Button>

        <TextField
          label="Input String"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />

        <Button variant="contained" color="secondary" fullWidth onClick={handleSimulate}>
          Simulate
        </Button>

        {simulationResult !== null && (
          <Alert severity={simulationResult ? "success" : "error"} sx={{ mt: 2 }}>
            {simulationResult ? "Accepted ✅" : "Rejected ❌"}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="#666">
          <b>Create State:</b> click the button and then on the canvas.<br/>
          <b>Create Transition:</b> click the button, select source and target nodes, then enter the symbol.<br/>
          <b>Right-click node:</b> cycles Initial → Final → Initial+Final → Normal.<br/>
          <b>Simulation:</b> type input string and click Simulate.
        </Typography>
      </Box>

      {/* Main Area */}
      <Box sx={{ flexGrow: 1, bgcolor: "white" }}>
        <div ref={cyRef} style={{ width: "100%", height: "100%", backgroundColor: "#fafafa" }} />
      </Box>
    </Box>
  );
}
