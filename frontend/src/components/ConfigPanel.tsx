import { useEffect, useRef } from "react";
import { Box, Typography, Card, Divider, TextField } from "@mui/material";

export default function ConfigPanel() {
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
                    Configuration
                </Typography>

                <Divider />

                <Typography sx={{ p: "10px 5px 10px 5px" }}>
                    Simple Input
                </Typography>

                <TextField
                    id="outlined-required"
                    label="abbaab"
                />

            </Box>
        </Card>
    );
}
