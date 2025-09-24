import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Tabs, Tab } from "@mui/material";

interface HeaderProps {
    onMachineChange: (tool: string) => void;
}

const machines = [
    { key: "finite_automaton", value: "finite" },
    { key: "stack_automaton", value: "stack" },
    { key: "turing_machine", value: "turing" },
];

export default function Header({ onMachineChange }: HeaderProps) {
    const { t } = useTranslation();

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        console.log(machines[newValue].value + newValue);
        onMachineChange(machines[newValue].value);
    };

    return (
        <Card
            elevation={0}
            sx={{
                margin: "10px 5px 5px 5px",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "divider",
                flexGrow: 1,
            }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                slotProps={{ indicator: { style: { display: "none" } } }}
                centered
            >
                {machines.map((m, index) => (
                    <Tab
                        key={m.value}
                        label={t(`${m.key}`)}
                        sx={{
                            bgcolor:
                                value === index
                                    ? "background.default"
                                    : "transparent",
                            color:
                                value === index
                                    ? "text.primary"
                                    : "text.secondary",
                            "&.Mui-selected": {
                                color: "text.primary",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            },
                            borderRadius: 4,
                            mx: 1,
                            "&:hover": {
                                bgcolor:
                                    value === index
                                        ? "primary.dark"
                                        : "action.hover",
                            },
                            transition: "all 0.2s",
                            m: "5px",
                        }}
                    />
                ))}
            </Tabs>
        </Card>
    );
}
