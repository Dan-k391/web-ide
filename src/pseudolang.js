import * as promise from "pseudo2wasm";
let pseudo2wasm = await promise;

export const keywords = pseudo2wasm.keyWords;

export function analyze(input) {
    try {
        const scanner = new pseudo2wasm.Scanner(input);
        const tokens = scanner.scan();
        console.log(tokens);
        const parser = new pseudo2wasm.Parser(tokens);
        const ast = parser.parse();
    }
    catch (error) {
        return error;
    }
}
