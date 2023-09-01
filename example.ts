import { $ } from "./lib/index.ts";

console.log("Hello from js!");

console.log(await $`echo "Hello from bash!"`);

export {};
