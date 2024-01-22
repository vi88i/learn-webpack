import { cube } from "./utils";
import colors from "./colors";

const div = document.createElement("div");

const num = 3;

div.innerText = `cube of ${num} is ${cube(3)}`;

document.body.appendChild(div);

console.log(cube(3));

console.log(colors.blue);