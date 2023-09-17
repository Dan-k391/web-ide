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

export async function runtime(input, output) {
    const module = compile(input);

    // module.optimize();

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
                console.log(value);
            },
            logChar: (value) => {
                console.log(String.fromCharCode(value));
            },
            logString: (value) => {
                const bytes = new Uint8Array(memory.buffer, value);
                const str = bytes.toString();
                console.log(str);
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

