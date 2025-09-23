from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class PDATransition:
    source: str
    target: str
    symbol: str       # símbolo da entrada ("" para epsilon)
    stack_pop: str    # símbolo a remover da pilha ("" para epsilon)
    stack_push: str   # símbolo(s) a empurrar na pilha ("" para nada)

class PushdownAutomaton:
    def __init__(
        self,
        states: List[str],
        transitions: List[PDATransition],
        initial: str,
        finals: List[str],
        stack_initial: str
    ):
        self.states = states
        self.transitions = transitions
        self.initial = initial
        self.finals = finals
        self.stack_initial = stack_initial

        # Organiza transições por estado para busca rápida
        self.transition_map: Dict[str, List[PDATransition]] = {}
        for t in transitions:
            self.transition_map.setdefault(t.source, []).append(t)

    def simulate(self, input_string: str) -> bool:
        """
        Simula o PDA determinístico. Retorna True se a string é aceita.
        """
        # Stack represented as list, top = end of list
        stack = [self.stack_initial]
        current_states = [(self.initial, 0, stack.copy())]  # (state, input_index, stack)

        while current_states:
            state, index, stack = current_states.pop()

            # Aceitação por estado final
            if index == len(input_string) and state in self.finals:
                return True

            # Transições possíveis a partir do estado atual
            for t in self.transition_map.get(state, []):
                # Verifica símbolo da entrada
                symbol_match = (t.symbol == "" or (index < len(input_string) and input_string[index] == t.symbol))
                # Verifica topo da pilha
                stack_match = (t.stack_pop == "" or (stack and stack[-1] == t.stack_pop))

                if symbol_match and stack_match:
                    # Atualiza pilha
                    new_stack = stack.copy()
                    if t.stack_pop and new_stack:
                        new_stack.pop()
                    if t.stack_push:
                        # empilha cada símbolo (último da string é topo)
                        for c in reversed(t.stack_push):
                            new_stack.append(c)

                    # Avança índice se símbolo consumido
                    new_index = index + (0 if t.symbol == "" else 1)
                    current_states.append((t.target, new_index, new_stack))

        # Se não encontrou nenhuma aceitação
        return False
