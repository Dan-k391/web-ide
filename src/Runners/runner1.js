import * as promise from "pseudo2wasm";
let pseudo2wasm = await promise;


export function compile(input) {
    if (!input) {
        return;
    }
    const scanner = new pseudo2wasm.Scanner(input);
    const tokens = scanner.scan();
    console.log(tokens);
    const parser = new pseudo2wasm.Parser(tokens);
    const ast = parser.parse();
    console.log(ast);
    const generator = new pseudo2wasm.Generator(ast);
    const module = generator.generate();
    return module;
}

export async function runtime(input, output, op) {
    const module = compile(input);

    if (op)
        module.optimize();

    console.log(module.emitText());
    const wasm = module.emitBinary();

    // initialize import objects
    const memory = new WebAssembly.Memory({ initial: 1, maximum: 2 });
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
                const bytes = new Uint8Array(memory.buffer, value, 65535 - value);
                let str = new TextDecoder("utf8").decode(bytes);
                str = str.split('\0')[0];
                output(str);
            }
        },
    }

    const { instance } = await WebAssembly.instantiate(wasm, importObect);

    const main = instance.exports.main;
    const start = new Date().getTime();
    main();
    const end = new Date().getTime();
    return end - start;
}

