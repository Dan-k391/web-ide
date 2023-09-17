import React from "react";
import ReactDOM from "react-dom/client";

import { TerminalContextProvider } from "react-terminal";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <TerminalContextProvider>
        <App />
    </TerminalContextProvider>
);
