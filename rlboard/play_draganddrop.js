import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_5')
const div_1 = frame.querySelector('.div_1');
div_1.style.cursor = 'pointer';

let policyName = "control";
let game = new Game(div_1, 0, policyName);
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;

function pixel2pos(pixelY, pixelX) {
    let cellHeight = parseInt(getComputedStyle(div_1.childNodes[0].childNodes[0]).height);
    let y = parseInt(pixelY / cellHeight);
    if (pixelY < 0) {
        y -= 1;
    }
    let cellWidth = parseInt(getComputedStyle(div_1.childNodes[0].childNodes[0]).width);
    let x = parseInt(pixelX / cellWidth);
    if (pixelX < 0) {
        x -= 1;
    }
    return [y, x];
}

let tempDom = document.createElement('div');
tempDom.classList.add("temp");

const playerDom = game.environment.player.dom;
playerDom.classList.add("draggable");
playerDom.style.position = "absolute"
const nodes = game.environment.nodes;
nodes.forEach((node) => {
    node.dom.classList.add("draggable");
    console.log(node.dom)
    node.dom.style.position = "absolute";
});


const draggables = div_1.querySelectorAll(".draggable");
draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    })
    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    });
});

let cells = div_1.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggable = div_1.querySelector(".dragging");
        if (cell.childElementCount === 0) {
            cell.appendChild(draggable);
        } else if (draggable.classList.contains("player")) {
            // cell.insertBefore(draggable, cell.firstChild);
            cell.appendChild(draggable);
        }
    });
});
