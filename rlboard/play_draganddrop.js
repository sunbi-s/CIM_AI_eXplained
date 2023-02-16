import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_5')
const boardDom = frame.querySelector('.div_1');
boardDom.style.cursor = 'pointer';

let policyName = "control";
let game = new Game(boardDom, 0, policyName);
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;


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
const draggables = boardDom.querySelectorAll(".draggable");
draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    })
    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    });
});

let cells = boardDom.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggable = boardDom.querySelector(".dragging");
        if (draggable == null) {
            return;
        }

        if (draggable.classList.contains("player")) {
            let cellPosition = getCellPosition(boardDom, cell);
            game.environment.player.move(cellPosition);
        } else if (cell.childElementCount === 0) {
            let nodePosition = getCellPosition(boardDom, draggable.parentNode);
            let cellPosition = getCellPosition(boardDom, cell);
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


// Add place_creator event
const place_creator = frame.querySelector(".place_creator");
place_creator.addEventListener("dragstart", (e) => {
    console.log("dragstart");
    // TODO: create 'place' corresponding to current pixel position
});
place_creator.addEventListener("dragover", (e) => {
    e.preventDefault();
});
place_creator.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggable = boardDom.querySelector(".dragging");
    if (draggable == null) {
        return;
    }

    if (draggable.classList.contains("place")) {
        console.log("remove", draggable);
        draggable.remove();
    }
});
