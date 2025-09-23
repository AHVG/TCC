import { useTranslation } from "react-i18next";
import { Select, MenuItem, FormControl, InputLabel, Icon } from "@mui/material";

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        i18n.changeLanguage(event.target.value as string);
    };

    return (
        <FormControl
            size="small"
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: .5,
                width: "200px"
            }}
        >
            <Icon className="material-symbols-outlined">language</Icon>
            <Select
                labelId="lang-select-label"
                value={i18n.language}
                defaultValue={i18n.language}
                onChange={handleChange}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="pt">Português</MenuItem>
            </Select>
        </FormControl>
    );
}
