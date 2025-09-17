from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.automaton import FiniteAutomaton

app = FastAPI(title="Automata Simulator API")

# --- CORS ---
origins = [
    "http://localhost:5173",  # Frontend Vite
    "http://127.0.0.1:5173",
    "*"  # opcional: permite qualquer origem
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # importante para OPTIONS
    allow_headers=["*"],
)

class Automaton(BaseModel):
    states: list
    transitions: list
    initial: str
    finals: list

class SimulationRequest(BaseModel):
    automaton: Automaton
    input_string: str


@app.get("/")
def hello_world():
    return "Hello, world!"

@app.post("/simulate")
def simulate_automaton(request: SimulationRequest):
    fa = FiniteAutomaton(
        request.automaton.states,
        request.automaton.transitions,
        request.automaton.initial,
        request.automaton.finals
    )
    result = fa.simulate(request.input_string)
    return {"accepted": result}
