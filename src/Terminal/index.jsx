import "./terminal.css";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";


export const Terminal = forwardRef((props, ref) => {
    const {
        history = [],
        promptLabel = "$",

        commands = {},
    } = props;

    const [pointer, setPointer] = useState(0);
    const [enteredHistory, setEnteredHistory] = useState([""]);

    const inputRef = useRef(0);
    const [input, setInput] = useState("");

    // const moveEndInput = useCallback(() => {
    //     let len = inputRef.current?.value.length;
    //     console.log(inputRef.current?.value.length);
    //     inputRef.current?.focus();
    //     inputRef.current?.setSelectionRange(len, len);
    // }, []);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value);
    }, []);

    const handleInputKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            if (input in commands) {
                const commandToExecute = commands?.[input.toLowerCase()];
                if (commandToExecute) {
                    commandToExecute?.();
                }
            } else {
                commands?.["err"]?.(input);
            }

            // setEnteredHistory((p) => [input, ...p]);
            // console.log(enteredHistory);
            setInput("");
            // setPointer(0);
        }
        // else if (e.key === "ArrowUp") {
        //     if (enteredHistory.length > 0) {
        //         if (pointer < enteredHistory.length - 1) {
        //             let p = pointer;
        //             setPointer(pointer + 1);
        //             console.log("Up", enteredHistory, p);
        //             setInput(enteredHistory[p + 1]);
        //         }
        //     }
        // }
        // else if (e.key === "ArrowDown") {
        //     if (enteredHistory.length > 0) {
        //         if (pointer > 0) {
        //             let p = pointer;
        //             setPointer(pointer - 1);
        //             console.log("Down", enteredHistory, p);
        //             setInput(enteredHistory[p - 1]);
        //         }
        //         if (pointer === 0) {
        //             setInput("");
        //         }
        //     }
        // }
    }, [commands, input]);

    return (
        <div className="terminal" ref={ref} onClick={focusInput}>
            {history.map((line, index) => (
                <div
                    className="terminal_line"
                    key={`terminal-line-${index}-${line}`}
                >
                    {line}
                </div>
            ))}
            <div className="terminal_prompt">
                <div className="terminal_prompt_label">{promptLabel}</div>
                <div className="terminal_prompt_input">
                    <input
                        type="text"
                        value={input}
                        onKeyDown={handleInputKeyDown}
                        onChange={handleInputChange}
                        ref={inputRef}
                    />
                </div>
            </div>
        </div>
    );
});
