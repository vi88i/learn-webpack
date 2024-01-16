import "./card.css";
import MeltingFace from "../../static/images/melting-emoji.svg";

const Card = (text, parent) => {
    const div = document.createElement("div");

    div.innerText = text;

    const img = new Image();
    img.width = 64;
    img.height = 64;
    img.src = MeltingFace;

    parent.appendChild(div);
    parent.appendChild(img);
};

export default Card;
