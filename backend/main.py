from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.automaton import FiniteAutomaton
from core.pda import PushdownAutomaton

app = FastAPI(title="Automata Simulator API")

# --- CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Automaton(BaseModel):
    states: list
    transitions: list
    initial: str
    finals: list

class PDATransition(BaseModel):
    source: str
    target: str
    symbol: str          # entrada lida
    stack_pop: str       # símbolo retirado da pilha
    stack_push: str      # símbolo(s) empurrado(s) para a pilha

class PDAAutomaton(BaseModel):
    states: list
    transitions: list[PDATransition]
    initial: str
    finals: list
    stack_initial: str = ""

class SimulationRequest(BaseModel):
    automaton: Automaton
    input_string: str

class PDASimulationRequest(BaseModel):
    automaton: PDAAutomaton
    input_string: str


@app.get("/")
def hello_world():
    return "Hello, world!"


@app.post("/simulate/FA")
def simulate_automaton(request: SimulationRequest):
    fa = FiniteAutomaton(
        request.automaton.states,
        request.automaton.transitions,
        request.automaton.initial,
        request.automaton.finals
    )
    result = fa.simulate(request.input_string)
    return {"accepted": result}


@app.post("/simulate/PDA")
def simulate_pda(request: PDASimulationRequest):
    pda = PushdownAutomaton(
        states=request.automaton.states,
        transitions=request.automaton.transitions,
        initial=request.automaton.initial,
        finals=request.automaton.finals,
        stack_initial=request.automaton.stack_initial
    )
    result = pda.simulate(request.input_string)
    return {"accepted": result}
