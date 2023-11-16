import * as promise from "pseudo2wasm";
import { useState } from "react";
let pseudo2wasm = await promise;


export function compile(code) {
    if (!code) {
        return;
    }
    const scanner = new pseudo2wasm.Scanner(code);
    const tokens = scanner.scan();
    console.log(tokens);
    const parser = new pseudo2wasm.Parser(tokens);
    const ast = parser.parse();
    console.log(ast);
    // console.log(JSON.stringify(ast));
    const checker = new pseudo2wasm.Checker(ast);
    const typedAst = checker.check();
    console.log(typedAst);
    const generator = new pseudo2wasm.Generator(typedAst);
    const module = generator.generate();
    return module;
}

export async function runtime(code, output, setHandleInput, op) {
    const module = compile(code);

    if (!module.validate())
        throw new Error("Module validation error");

    if (op)
        module.optimize();

    console.log(module.emitText());
    const wasm = module.emitBinary();

    const pages = 3;
    const pageSize = 65536;
    // initialize import objects
    const memory = new WebAssembly.Memory({ initial: pages, maximum: pages });
    const maxSize = pageSize * pages - 1;
    let heapOffSet = pageSize * (pages - 1);

    const inputInteger = () => new Promise(resolve => {
        // resolve(parseInt(prompt("Enter an integer")));
        setHandleInput((str) => {
            console.log(str);
            resolve(parseInt(str));
            setHandleInput(null);
        });
    });
    const inputReal = () => new Promise(resolve => {
        setHandleInput((str) => {
            resolve(parseFloat(str));
            setHandleInput(null);
        });
    });
    const inputChar = () => new Promise(resolve => {
        setHandleInput((str) => {
            resolve(str.charCodeAt(0));
            setHandleInput(null);
        });
    });
    const inputString = () => new Promise(resolve => {
        setHandleInput((str) => {
            const bytes = new TextEncoder().encode(str);
            // currently allocate on the heap
            // maybe allocate on a separate page later
            const ptr = heapOffSet;
            heapOffSet += bytes.length;
            const len = bytes.length;
            const view = new Uint8Array(memory.buffer, ptr, len);
            view.set(bytes);
            resolve(ptr);
            setHandleInput(null);
        });
    });
    const inputBoolean = () => new Promise(resolve => {
        setHandleInput((str) => {
            resolve(str === "TRUE" ? 1 : 0);
            setHandleInput(null);
        });
    });

    const suspendingInputInteger = new WebAssembly.Function(
        { parameters: ["externref"], results: ["i32"] },
        inputInteger,
        { suspending: "first" }
    );
    const suspendingInputReal = new WebAssembly.Function(
        { parameters: ["externref"], results: ["f64"] },
        inputReal,
        { suspending: "first" }
    );
    const suspendingInputChar = new WebAssembly.Function(
        { parameters: ["externref"], results: ["i32"] },
        inputChar,
        { suspending: "first" }
    );
    const suspendingInputString = new WebAssembly.Function(
        { parameters: ["externref"], results: ["i32"] },
        inputString,
        { suspending: "first" }
    );
    const suspendingInputBoolean = new WebAssembly.Function(
        { parameters: ["externref"], results: ["i32"] },
        inputBoolean,
        { suspending: "first" }
    );

    const importObect = {
        env: {
            buffer: memory,
            logInteger: (value) => {
                output(value);
            },
            logReal: (value) => {
                output(value);
            },
            logChar: (value) => {
                output(String.fromCharCode(value));
            },
            logString: (value) => {
                const bytes = new Uint8Array(memory.buffer, value, maxSize - value);
                let str = new TextDecoder("utf8").decode(bytes);
                str = str.split('\0')[0];
                output(str);
            },
            logBoolean: (value) => {
                if (value === 0) {
                    output("FALSE");
                }
                else {
                    output("TRUE");
                }
            },
            inputInteger: suspendingInputInteger,
            inputReal: suspendingInputReal,
            inputChar: suspendingInputChar,
            inputString: suspendingInputString,
            inputBoolean: suspendingInputBoolean,
        },
    };

    const { instance } = await WebAssembly.instantiate(wasm, importObect);

    const main = new WebAssembly.Function(
        { parameters: [], results: ["externref"] },
        instance.exports.main,
        { promising: "first" }
    );

    const start = new Date().getTime();
    await main();
    const end = new Date().getTime();
    return end - start;
}

