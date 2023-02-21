import { Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_6')
const boardDom = frame.querySelector('.board');
boardDom.style.cursor = 'pointer';

let policyName = "user";
let game = new Game(boardDom, 0, policyName);
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
    });
}

function follow_arrow(game, episodeLength) {
    let timeout = 200;
    done = false;

    // loop step
    let interval = setInterval(() => {
        if (done) {
            done = false;
            clearTimeout(interval);
            return;
        }

        // find action for the arrow
        let action = -1;
        for (let child of Array.from(game.environment.player.dom.parentNode.childNodes)) {
            if (child.classList.contains("arrow")) {
                action = child.getAttribute("index");
            }
        }
        if (action !== -1 && !done) {
            [state, reward, done] = game.environment.step(action);
        }
    }, timeout);

    // stop interval when reach max episode length
    setTimeout(() => {
        clearTimeout(interval);
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
            } else
            if (draggable.parentNode.classList.contains("place_creator")) {
                // create node
                let copied_draggable = draggable.cloneNode(true);
                cell.appendChild(copied_draggable);
                setDraggable(copied_draggable);
                copied_draggable.classList.remove("dragging");

                console.log("create", copied_draggable);
            }
        }
    });
});


// Add dummy arrow into place_creator
for (const [index, direction] of ["up", "down", "left", "right"].entries()) {
    let temp = document.createElement('img');
    temp.src = "../img/rlboard/arrow/" + direction + ".png";
    temp.classList.add("arrow");
    temp.classList.add(direction);
    setDraggable(temp);
    temp.setAttribute("index", index);
    place_creator.appendChild(temp);
}


// Add btn event
frame.querySelector('.btn_test').addEventListener("click", function() {
    follow_arrow(game, 40);
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
