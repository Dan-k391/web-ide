import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { NativeSelect } from "@mui/material";


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
                    <MenuItem value={1}>CAIE-Code</MenuItem>
                    <MenuItem value={2}>Web-Interpreter</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
