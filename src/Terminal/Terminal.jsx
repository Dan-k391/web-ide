// import React, { useEffect, useRef, useState } from "react";

// import { Box, Stack } from "@mui/material/";

// export default function Terminal() {
//     const [text, setText] = useState("$ ");
//     const [command, setCommand] = useState("");
//     const [lines, setLines] = useState([]);

//     function handleSubmit(e) {
//         e.preventDefault();

//         console.log(command);
//         console.log(lines);
//         setText("$ ");
//         setLines([...lines, <div>$ {command}</div>]);
//         setCommand("");
//     }

//     return (
//         <Box style={{ overflow: "auto", width: "100%", height: "100px", }}>
//             {lines}

//             <form onSubmit={handleSubmit}>
//                 <label>
//                     <Stack direction="row" spacing={1}>
//                         <span>{text}</span>
//                         <input
//                             style={{ width: "100%" }}
//                             type="text"
//                             value={command}
//                             onChange={(e) => setCommand(e.target.value)}
//                         />
//                     </Stack>
//                 </label>
//             </form>
//         </Box>
//     );
// }
