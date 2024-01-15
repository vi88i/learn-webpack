import { join } from "lodash";

const fn = () => {
    const div = document.createElement("div");

    const str = join(["Vighnesh", "Nayak", "S"], " ");
    
    div.innerText = str;
    
    document.body.appendChild(div);
};

fn();
console.log("It's working");