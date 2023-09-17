import { useCallback, useEffect, useState } from "react";

export const useTerminal = () => {
    const [terminalRef, setDomNode] = useState();
    const setTerminalRef = useCallback((node) => setDomNode(node), []);

    const [history, setHistory] = useState([]);

    useEffect(() => {
        const windowResizeEvent = () => {
            terminalRef?.scrollTo({
                top: terminalRef?.scrollHeight ?? 99,
                behaviour: "smooth",
            });
        };

        window.addEventListener("resize", windowResizeEvent);

        return () => {
            window.removeEventListener("resize", windowResizeEvent);
        };
    }, [terminalRef]);

    useEffect(() => {
        terminalRef?.scrollTo({
            top: terminalRef?.scrollHeight ?? 99,
            behaviour: "smooth",
        });
    }, [history, terminalRef]);

    const pushToHistory = useCallback((item) => {
        setHistory((old) => {
            if (old.length > 1000) {
                return [...old.slice(1), item];
            }
            else {
                return [...old, item];
            }
        });
    }, []);

    const pushToHistoryWithDelay = useCallback(
        ({ delay = 0, content }) =>
            new Promise((resolve) => {
                setTimeout(() => {
                    pushToHistory(content);
                    return resolve(content);
                }, delay);
            }),
        [pushToHistory]
    );

    const resetTerminal = useCallback(() => {
        setHistory([]);
    }, []);

    return {
        history,
        pushToHistory,
        pushToHistoryWithDelay,

        terminalRef,
        setTerminalRef,

        resetTerminal,
    };
};
