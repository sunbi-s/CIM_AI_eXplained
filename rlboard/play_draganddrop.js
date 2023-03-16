import { Position } from "./utill.js";
import { Game, animate } from "./game.js";

const frame = document.querySelector('#play_draganddrop')
const boardDom = frame.querySelector('.board');
boardDom.style.cursor = 'pointer';

let game = new Game(boardDom, 0);
animate(game);


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


function addDraggingClass(ev) {
    ev.target.classList.add("dragging");
}
function removeDraggingClass(ev) {
    ev.target.classList.remove("dragging");

    // remove highlight
    frame.querySelectorAll(".cell.highlight").forEach((highlight) => {
        highlight.classList.remove("highlight");
    });
}
function setDraggable(node) {
    node.draggable = true;
    node.classList.add("draggable");
    node.addEventListener("dragstart", addDraggingClass);
    node.addEventListener("dragend", removeDraggingClass);
}
function unsetDraggable(node) {
    node.draggable = false;
    node.classList.remove("draggable");
    node.removeEventListener("dragstart", addDraggingClass);
    node.removeEventListener("dragend", removeDraggingClass);
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

    // There should be at least one done place in board
    let places = boardDom.querySelectorAll(".place");
    let doneCount = Array.from(places).reduce((sum, place) => sum + (place.done ? 1 : 0), 0);
    if (doneCount - draggable.done < 1) {
        alert("There should be at least one terminal place in board.");
        return;
    }

    // remove place
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
        frame.querySelectorAll(".cell.highlight").forEach((highlight) => {
            highlight.classList.remove("highlight");
        });
        e.target.classList.add("highlight");
        e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
        // e.preventDefault();
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
let selectAgent = frame.querySelector('#select_agent');
let divPlayMyMDP = frame.querySelector('#play_my_mdp');
let btnSave = frame.querySelector('.btn_save');
let btnBack = frame.querySelector('.btn_back');
let btnTrain = frame.querySelector('.btn_train');

btnSave.addEventListener("click", function() {
    btnSave.style.display = "none";
    btnBack.style.display = "inline-block";
    divPlayMyMDP.style.display = "block";
    place_creator.style.display = "none";
    for (let draggable of boardDom.querySelectorAll(".draggable")) {
        unsetDraggable(draggable);
    }
});
btnBack.addEventListener("click", function() {
    btnSave.style.display = "inline-block";
    btnBack.style.display = "none";
    divPlayMyMDP.style.display = "none";
    place_creator.style.display = "inline-block";
    for (let place of boardDom.querySelectorAll(".place")) {
        setDraggable(place);
    }
});
btnTrain.addEventListener("click", function() {
    alert(selectAgent.value);
});
