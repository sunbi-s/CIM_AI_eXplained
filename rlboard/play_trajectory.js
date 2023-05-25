import { Game, animate, renderEffect } from "./game.js";
import {Position} from "./utill.js";

const frame = document.querySelector('#play_6')
const boardDom = frame.querySelector('.board');
boardDom.style.cursor = 'pointer';

let game = new Game(boardDom);
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;


function setDraggable(node) {
    node.classList.add("draggable");
    node.addEventListener("dragstart", () => {
        node.classList.add("dragging");
    })
    node.addEventListener("dragend", () => {
        node.classList.remove("dragging");

        // remove highlight
        frame.querySelectorAll(".cell.highlight").forEach((highlight) => {
            highlight.classList.remove("highlight");
        });
    });
}

function follow_arrow(game, episodeLength) {
    let player = boardDom.querySelector(".player");

    let timeout = 200;
    done = false;

    // alert instruction
    let childNodes = Array.from(player.parentNode.childNodes);
    let arrowCount = childNodes.reduce((sum, child) => sum + (child.classList.contains("arrow") ? 1 : 0), 0);
    if (arrowCount === 0) {
        Swal.fire({
            icon: 'error',
            title: 'There are no arrows.',
            text: "Drag and drop the arrow on the board.",
        });
        btnTest.classList.remove("disabled");
        return;
    }

    // loop step
    let interval = setInterval(() => {
        if (done) {
            done = false;
            clearTimeout(interval);
            btnTest.classList.remove("disabled");
            return;
        }

        // find action for the arrow
        let action = -1;
        for (let child of Array.from(player.parentNode.childNodes)) {
            if (child.classList.contains("arrow")) {
                action = child.getAttribute("index");
            }
        }
        if (action !== -1 && !done) {
            [state, reward, done] = game.environment.step(action);
            renderEffect(game.environment._getCell(new Position(state[0], state[1])));
        } else {
            done = true;
        }
    }, timeout);

    // stop interval when reach max episode length
    setTimeout(() => {
        clearTimeout(interval);
        btnTest.classList.remove("disabled");
    }, timeout * episodeLength);
}


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

    if (draggable.classList.contains("arrow")) {
        console.log("remove", draggable);
        draggable.remove();
    }
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
        e.preventDefault();
        let draggable = frame.querySelector(".dragging");
        if (draggable == null) {
            return;
        }

        let hasArrow = Array.from(cell.childNodes).some((elem) => {
            return elem.classList.contains("arrow");
        });
        if (!hasArrow) {
            if (draggable.parentNode.classList.contains("cell")) {
                // move node
                cell.appendChild(draggable);
            } else if (draggable.parentNode.classList.contains("place_creator")) {
                // create node
                let copied_draggable = draggable.cloneNode(true);
                setDraggable(copied_draggable);
                copied_draggable.classList.remove("dragging");

                if (cell.hasChildNodes() && cell.lastChild.classList.contains("place")) {
                    cell.insertBefore(copied_draggable, cell.lastChild);
                } else {
                    cell.appendChild(copied_draggable);
                }

                console.log("create", copied_draggable);
            }
        }
    });
});


// Add dummy arrow into place_creator
for (const [index, direction] of ["up", "down", "left", "right"].entries()) {
    let temp = document.createElement('img');
    temp.src = "img/rlboard/arrow/" + direction + ".png";
    temp.classList.add("arrow");
    temp.classList.add(direction);
    setDraggable(temp);
    temp.setAttribute("index", index);
    place_creator.appendChild(temp);
}

let btnTest = frame.querySelector('.btn_test');

// Add btn event
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTest.classList.add("disabled");
    follow_arrow(game, 100);
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    state = game.environment.reset();
    done = true;
});
frame.querySelector('.btn_clear').addEventListener("click", function() {
    boardDom.querySelectorAll(".arrow").forEach((arrow) => {
        arrow.remove();
    });
});
