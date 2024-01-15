import { join } from "lodash";
import { Card } from "./components/index";
import "./index.css";

const fn = () => {
    const div = document.createElement("div");

    const str = join(["Vighnesh", "Nayak", "S"], " ");
    
    div.innerText = str;
    
    document.body.appendChild(div);

    Card("I'm bad at CSS", div);
};

fn();
console.log("It's working");
