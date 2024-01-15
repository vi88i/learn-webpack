import "./card.css";

const Card = (text, parent) => {
    const div = document.createElement("div");

    div.innerText = text;

    parent.appendChild(div);
};

export default Card;