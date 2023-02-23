import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_5')
const boardDom = frame.querySelector('.board');
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

function setDraggable(node) {
    node.classList.add("draggable");
    node.addEventListener("dragstart", () => {
        node.classList.add("dragging");
    })
    node.addEventListener("dragend", () => {
        node.classList.remove("dragging");
    });
}


const player = boardDom.querySelector(".player");
setDraggable(player);

const places = boardDom.querySelectorAll('.place');
places.forEach((place) => {
    setDraggable(place);
});


// Add place_creator event
const place_creator = frame.querySelector(".place_creator");
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


// Add dummy places into place_creator
places.forEach((place) => {
    let copied_node = place.cloneNode(true);
    place_creator.appendChild(copied_node);
    setDraggable(copied_node);
});


// Add drag event
const cells = boardDom.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
        e.preventDefault();
        let draggable = frame.querySelector(".dragging");
        if (draggable == null) {
            return;
        }

        if (draggable.classList.contains("player")) {
            cell.insertBefore(draggable, cell.firstChild);
        } else if (cell.childElementCount === 0) {
            if (draggable.parentNode.classList.contains("cell")) {
                let cellPosition = getCellPosition(boardDom, cell);
                game.environment.moveNode(draggable, cellPosition);
            } else if (draggable.parentNode.classList.contains("place_creator")) {
                // Create new node
                let cellPosition = getCellPosition(boardDom, cell);
                let copied_draggable = game.environment.createPlace(cellPosition, draggable.getAttribute("placeIndex"));

                // Add drag event
                setDraggable(copied_draggable);

                console.log("create", copied_draggable);
            }
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
