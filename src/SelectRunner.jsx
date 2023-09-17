import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { NativeSelect } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import AbcIcon from "@mui/icons-material/Abc";

export default function SelectRunner({ runner, setRunner }) {
    const handleChange = (event) => {
        setRunner((p) => event.target.value);
    };

    return (
        <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth>
                <InputLabel id="select-label">
                    Select compiler/interpreter
                </InputLabel>
                {/* Select resizes the whole window */}
                <Select
                    labelId="select-label"
                    defaultValue={0}
                    value={runner}
                    label="select"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>Pseudo2Wasm</MenuItem>
                    <MenuItem value={1}>Web-Interpreter</MenuItem>
                    <MenuItem value={2}>CAIE-Code</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
