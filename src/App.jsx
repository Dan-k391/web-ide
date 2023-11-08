import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import "./App.css";

import { Button, Tooltip } from "@mui/material";
import { Stack, Container } from "@mui/material/";

import SelectRunner from "./SelectRunner";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import Editor, { useMonaco } from "@monaco-editor/react";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Responsive, WidthProvider } from "react-grid-layout";

import GridLayout from "react-grid-layout";

import { Terminal } from "./Terminal";
import { useTerminal } from "./Terminal/hooks";

import { compile, runtime } from "./Runners/runner1";

import { keywords, analyze } from "./pseudolang";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

// import io from "socket.io-client";

// import SocketIOClient from "socket.io/node_modules/socket.io-client";

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:7788';

// export const socket = io(URL, {
//     autoConnect: false
// });


export default function App() {
    const compiler = useMemo(
        () => ["Pseudo2Wasm", "CAIE-Code", "Web-interpreter"],
        []
    );

    // const [isConnected, SetIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);

    const [op, setOp] = useState(false);

    const editorRef = useRef(0);

    const monacoRef = useRef(0);
    const [runner, setRunner] = useState(0);

    const [value, setValue] = useState(`FUNCTION aux(n:INTEGER, acc1:INTEGER, acc2:INTEGER) RETURNS INTEGER
    IF n = 1 THEN RETURN acc1 ENDIF
    IF n = 2 THEN RETURN acc2 ENDIF
    RETURN aux(n - 1, acc2, acc1 + acc2)
ENDFUNCTION

DECLARE i:INTEGER
FOR i <- 0 TO 100000
    aux(47, 0, 1)
NEXT i
`);

    const { history, pushToHistory, setTerminalRef, resetTerminal } =
        useTerminal();

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const commands = useMemo(
        () => ({
            help: () => {
                pushToHistory(
                    <>
                        <div>$ help</div>
                        <div>
                            Use
                            <strong> help </strong>
                            to display this page
                        </div>
                        <div>
                            Use
                            <strong> run </strong>
                            to run the program
                        </div>
                    </>
                );
            },
            run: async () => {
                if (runner === 0)
                    runtime(editorRef.current.getValue(), commands.output, op).then((time) =>
                        commands.output(`Execution complete in ${time}ms`)
                    );
                else if (runner === 1)
                    return;

                pushToHistory(
                    <>
                        <div>$ run</div>
                        <div>
                            Running Code with
                            <strong>{" " + compiler[runner]}</strong>
                        </div>
                    </>
                );
            },
            egg: () => {
                pushToHistory(
                    <>
                        <div>$ egg</div>
                        <div>An egg? maybe...</div>
                    </>
                );
            },
            err: (cmd) => {
                pushToHistory(
                    <>
                        <div>$ {cmd}</div>
                        <div>
                            <strong>{cmd}</strong>: command not found
                        </div>
                    </>
                );
            },

            output: (value) => {
                pushToHistory(
                    <>
                        <div>{value}</div>
                    </>
                );
            },
        }),
        [pushToHistory, compiler, runner, op]
    );

    // temporary
    // useEffect(() => {
    //     document.getElementById("terminalEditor").style.height =
    //         "calc(100% - 20px)";
    // });

    useEffect(() => {
        resetTerminal();

        pushToHistory(
            <>
                <div>
                    <strong>Welcome to this WebIDE</strong>
                </div>
                <div>Use 'help' to display all commands</div>
                <div>
                    Project github:{" "}
                    <a
                        target="_blank"
                        href="https://github.com/Dan-k391/web-ide"
                        style={{ color: "white" }}
                    >
                        here
                    </a>
                </div>
                <div>
                    Thanks to{" "}
                    <a
                        target="_blank"
                        href="https://codesandbox.io/s/react-terminal-emulator-5wnk8o"
                        style={{ color: "white" }}
                    >
                        react-terminal-emulator
                    </a>{" "}
                    for the terminal template,
                </div>
                <div>
                    <a
                        target="_blank"
                        href="https://microsoft.github.io/monaco-editor"
                        style={{ color: "white" }}
                    >
                        monaco-editor
                    </a>{" "}
                    for the editor,
                </div>
                <div>and</div>
                <div>
                    <a
                        target="_blank"
                        href="https://github.com/react-grid-layout/react-grid-layout"
                        style={{ color: "white" }}
                    >
                        react-grid-layout
                    </a>{" "}
                    for the resizeable and dragable grid layout
                </div>
            </>
        );
    }, [resetTerminal, pushToHistory]);

    useEffect(() => {
        let markers = [];
        let error = analyze(value);
        if (error) {
            markers.push({
                startLineNumber: error.line,
                endLineNumber: error.line,
                startColumn: error.startColumn + 1,
                endColumn: error.endColumn + 1,
                message: error.message,
                serverity: monacoRef.current.MarkerSeverity.Error,
            });
        }
        monacoRef.current.editor?.setModelMarkers(
            editorRef.current?.getModel(),
            "owner",
            markers
        );
    }, [value]);

    function handleEditorWillMount(monaco) {
        monaco.editor.EditorOptions.mouseWheelZoom.defaultValue = true;
        monaco.editor.EditorOptions.fontSize.defaultValue = 18;
        monaco.editor.defineTheme("pseudocode-theme", {
            base: "vs",
            inherit: false,
            rules: [
                { token: "keyword", foreground: "#8e2aa0" },
                {
                    token: "comment",
                    foreground: "#a1a1a1",
                    fontStyle: "italic",
                },
                { token: "variable", foreground: "#393a42" },
                { token: "string", foreground: "#71a056" },
                { token: "char", foreground: "#71a056" },
                { token: "number", foreground: "#8b690d" },
                { token: "operators", foreground: "#5a76ef" },
            ],
            colors: {},
        });
        // language custimize
        monaco.languages.register({ id: "pseudocode" });
        monaco.languages.setMonarchTokensProvider("pseudocode", {
            keywords,
            tokenizer: {
                root: [
                    [
                        /[a-zA-Z_]\w*/,
                        {
                            cases: {
                                "@keywords": "keyword",
                                "@default": "variable",
                            },
                        },
                    ],
                    [/\/\/.*$/, "comment"],
                    [/".*?"/, "string"],
                    [/'.?'/, "char"],
                    [/\d+/, "number"],
                    [/[+\-*/()[\]=<>:,]/, "operators"],
                ],
            },
        });
        monaco.languages.registerCompletionItemProvider("pseudocode", {
            provideCompletionItems: () => {
                var suggestions = [
                    ...keywords.map((keyword) => {
                        return {
                            label: keyword,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: keyword,
                        };
                    }),
                ];
                return { suggestions: suggestions };
            },
        });
    }

    function handleEditorDidMount(editor, monaco) {
        editor.addAction({
            id: "run",
            label: "Run Code",

            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            precondition: null,

            keybindingContext: null,

            contextMenuGroupId: "navigation",

            contextMenuOrder: 1.5,

            run: commands.run
        });
        editorRef.current = editor;
        monacoRef.current = monaco;
    }

    function showValue() {
        alert(value);
    }

    const handleInputChange = useCallback((value, event) => {
        setValue(value);
    }, []);

    return (
        <>
            <Container
                style={{
                    textAlign: "center",
                    fontSize: "2em",
                    fontWeight: "bold",
                }}
            >
                Web-IDE
            </Container>
            {/* <p>compiler: {compiler[runner]}</p> */}
            {/* <Container>
                <Grid container spacing={0} minHeight={100}>
                    <Grid
                        xs
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button endIcon={<PlayArrowIcon />}>Run</Button>
                    </Grid>
                    <Grid
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button onClick={showValue}>Show Value</Button>
                    </Grid>
                    <Grid
                        xs
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <SelectRunner
                            runner={runner}
                            setRunner={setRunner}
                        ></SelectRunner>
                    </Grid>
                </Grid>
            </Container> */}

            <Stack direction="row" spacing={2}>
                <Button endIcon={<PlayArrowIcon />} onClick={commands.run}>
                    Run
                </Button>
                <Button onClick={showValue}>Show Value</Button>
                <SelectRunner
                    runner={runner}
                    setRunner={setRunner}
                ></SelectRunner>
                <Tooltip title="Optimization">
                    <ToggleButton
                        color="primary"
                        value="check"
                        selected={op}
                        onChange={() => {
                            setOp(!op);
                        }}
                    >
                        <CheckIcon />
                    </ToggleButton>
                </Tooltip>
            </Stack>

            {/* currently no width resize
            try with sizeMe later */}
            <GridLayout
                width={window.innerWidth}
                className="layout"
                rowHeight={24}
                isDraggable={true}
                draggableHandle=".grid-item_title"
            >
                <div
                    className="grid-item"
                    key="a"
                    data-grid={{ x: 0, y: 0, w: 7, h: 24 }}
                >
                    <div className="grid-item_title">The Editor</div>
                    <div className="grid-item_content">
                        <Editor
                            defaultLanguage="pseudocode"
                            theme="pseudocode-theme"
                            defaultValue={value}
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                {/* <div
                    key="b"
                    data-grid={{ x: 0, y: 2, w: 3, h: 2, minW: 2, maxW: 4 }}
                >
                    b
                </div> */}
                <div
                    className="grid-item"
                    key="c"
                    data-grid={{ x: 8, y: 0, w: 5, h: 24 }}
                >
                    <div className="grid-item_title">The Terminal</div>
                    <div className="grid-item_content">
                        <Terminal
                            history={history}
                            ref={setTerminalRef}
                            commands={commands}
                        />
                    </div>
                </div>
            </GridLayout>

            {/* <Stack>
                <Stack direction="row" spacing={2}>
                    <Editor
                        height="50vh"
                        defaultLanguage="javascript"
                        defaultValue="// some comment"
                        onMount={handleEditorDidMount}
                    />
                    <Editor
                        height="50vh"
                        defaultLanguage="javascript"
                        defaultValue="// some comment"
                        onMount={handleEditorDidMount}
                    />
                </Stack>
            </Stack> */}
        </>
    );
}
