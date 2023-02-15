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

function getCellPosition(div, _cell) {
    for (let y=0; y<div.childElementCount; ++y) {
        let row = div.childNodes[y];
        for (let x=0; x<row.childElementCount; ++x) {
            let cell = row.childNodes[x];
            if (cell === _cell) {
                return new Position(y, x);
            }
        }
    }
}


const playerDom = game.environment.player.dom;
playerDom.classList.add("draggable");
const nodes = game.environment.nodes;
nodes.forEach((node) => {
    node.dom.classList.add("draggable");
});


// Add drag event
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
        if (draggable.classList.contains("player")) {
            let cellPosition = getCellPosition(div_1, cell);
            game.environment.player.move(cellPosition);
        } else if (cell.childElementCount === 0) {
            let nodePosition = getCellPosition(div_1, draggable.parentNode);
            let cellPosition = getCellPosition(div_1, cell);
            game.environment.move_node(nodePosition, cellPosition);
        }
    });
});


// Add btn event
frame.querySelector('.btn_action_0').addEventListener("click", function() {
    game.environment.step(0);
});
frame.querySelector('.btn_action_1').addEventListener("click", function() {
    [state, reward, done] = game.environment.step(1);
});
frame.querySelector('.btn_action_2').addEventListener("click", function() {
    [state, reward, done] = game.environment.step(2);
});
frame.querySelector('.btn_action_3').addEventListener("click", function() {
    [state, reward, done] = game.environment.step(3);
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    state = game.environment.reset();
    done = false;
});
