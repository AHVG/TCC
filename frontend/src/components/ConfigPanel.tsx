import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Typography,
    Card,
    Divider,
    TextField,
    Button,
    Alert,
} from "@mui/material";

interface ConfigPanelProps {
    simulate: ((inputString: string) => Promise<boolean>) | null;
}

export default function ConfigPanel({ simulate }: ConfigPanelProps) {
    const { t } = useTranslation();

    const [result, setResult] = useState<boolean | null>(null);
    const [inputString, setInputString] = useState<string>("");

    const handleSimulate = async () => {
        if (simulate !== null) {
            const r = await simulate(inputString);
            setResult(r);
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                flex: "0 0 auto",
                margin: "5px",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "divider",
                p: "5px",
            }}
        >
            <Box sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ p: "10px 5px 10px 5px" }}>
                    {t("config_title")}
                </Typography>

                <Divider />

                <Typography sx={{ p: "10px 5px 10px 5px" }}>
                    {t("config_simple_input_title")}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        mb: "10px",
                    }}
                >
                    <TextField
                        id="outlined-required"
                        label="abbaab"
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSimulate}>
                        {t("config_simulate")}
                    </Button>
                </Box>

                {result !== null && (
                    <Alert
                        variant="filled"
                        severity={result ? "success" : "error"}
                    >
                        {result ? t("config_accepted") : t("config_rejected")}
                    </Alert>
                )}
            </Box>
        </Card>
    );
}
