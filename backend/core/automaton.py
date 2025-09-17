from typing import List, Dict


class FiniteAutomaton:
    def __init__(self, states: List[str], transitions: List[Dict], initial: str, finals: List[str]):
        self.states = states
        self.transitions = transitions
        self.initial = initial
        self.finals = finals

    def simulate(self, input_string: str) -> bool:
        current_state = self.initial
        for symbol in input_string:
            next_state = next(
                (t["target"] for t in self.transitions
                 if t["source"] == current_state and t["symbol"] == symbol),
                None
            )
            if not next_state:
                return False
            current_state = next_state
        return current_state in self.finals
