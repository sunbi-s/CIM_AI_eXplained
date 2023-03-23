import {Position, sleep} from "./utill.js";
import { Game, MCGame, TDGame, OptimGame, animate } from "./game.js";

const frame = document.querySelector('#play_draganddrop')
const boardDom = frame.querySelector('.board');
const hiddenBoardDom1 = frame.querySelector('#hiddenBoard1');
const hiddenBoardDom2 = frame.querySelector('#hiddenBoard2');
boardDom.style.cursor = 'pointer';

let game = new Game(boardDom, 0);
let mcGame = new MCGame(hiddenBoardDom1, null, 0);
// mcGame.environment.div = boardDom;
// mcGame.environment.player = game.environment.player;
let tdGame = new TDGame(hiddenBoardDom2, null, 0);
// tdGame.environment.div = boardDom;
// tdGame.environment.player = game.environment.player;

let div = document.createElement("div");
let optimGame = new OptimGame(div, null, 0);
optimGame.environment.div = boardDom;
optimGame.environment.player = game.environment.player;

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
    if (place.done) {
        return;
    }

    setDraggable(place);
});


// Add trash_can event
const trash_can = frame.querySelector(".trash_can");
trash_can.addEventListener("dragover", (e) => {
    e.preventDefault();
});
trash_can.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggable = boardDom.querySelector(".dragging");
    if (draggable == null) {
        return;
    }

    // There should be at least one done place in board
    let places = boardDom.querySelectorAll(".place");
    let doneCount = Array.from(places).reduce((sum, place) => sum + (place.done ? 1 : 0), 0);
    if (doneCount - draggable.done < 1) {
        Swal.fire({
            icon: 'error',
            title: 'Not enough terminal place.',
            text: "There should be at least one terminal place in board.",
        });
        return;
    }

    // remove place
    if (draggable.classList.contains("place")) {
        console.log("remove", draggable);
        draggable.remove();
    }
});


// Add dummy places into place_creator
const place_creator = frame.querySelector(".place_creator");
places.forEach((place) => {
    if (place.done) {
        return;
    }

    let to_create = [0, 1, 3];
    if (!to_create.includes(parseInt(place.getAttribute("placeindex")))) {
        return;
    }

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
        cell.classList.add("highlight");
        e.preventDefault();
    });
    cell.addEventListener("drop", () => {
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
let btnRun = frame.querySelector('.btn_run');
let canvas = frame.querySelector('canvas');
let nEpisodeText = frame.querySelector('#n_episode');


const n_trains = 100;
let mcHistory = [];
let tdHistory = [];
let interrupt = false;


btnSave.addEventListener("click", async function() {
    mcHistory = [];
    tdHistory = [];
    interrupt = false;
    mcGame.interrupt = false;

    btnSave.style.display = "none";
    btnBack.style.display = "inline-block";
    btnRun.classList.add("disabled");
    divPlayMyMDP.style.display = "inline-block";
    place_creator.style.display = "none";
    trash_can.style.display = "none";
    canvas.style.display = "inline-block";
    for (let draggable of boardDom.querySelectorAll(".draggable")) {
        unsetDraggable(draggable);
    }

    // init agents
    optimGame.agent.computeValues(true);

    // train agents in background process
    let state, action, reward, done;
    let context = canvas.getContext('2d');
    context.width = canvas.width;
    context.height = canvas.height;
    mcGame.context = context;
    animate(mcGame);
    mcGame.agent.reset();
    mcGame.run(n_trains, 1, nEpisodeText).then(() => {
        state = mcGame.environment.reset();
        for (let step = 0; step < mcGame.max_step_num; step++) {
            action = mcGame.agent.getOptimalAction(state);
            mcHistory.push(action);
            [state, reward, done] = mcGame.environment.step(action);

            if (done || interrupt) {
                break;
            }
        }
        console.log("eval done");
        btnRun.classList.remove("disabled");
    });
    // tdGame.run(1, 0);
    console.log("save done");
});
btnBack.addEventListener("click", function() {
    if (btnBack.classList.contains("disabled")) {
        return;
    }

    interrupt = true;
    mcGame.interrupt = true;
    game.resetPlayer();

    btnSave.style.display = "inline-block";
    btnBack.style.display = "none";
    divPlayMyMDP.style.display = "none";
    canvas.style.display = "none";
    place_creator.style.display = "block";
    trash_can.style.display = "block";
    for (let place of boardDom.querySelectorAll(".place")) {
        setDraggable(place);
    }
});
btnRun.addEventListener("click", async function () {
    if (btnRun.classList.contains("disabled")) {
        return;
    }

    btnRun.classList.add("disabled");
    if (selectAgent.value === "Optimal") {
        btnBack.classList.add("disabled");
        optimGame.run_test(1).then(() => {
            btnRun.classList.remove("disabled");
            btnBack.classList.remove("disabled");
        });
    } else if (selectAgent.value === "MC") {
        game.environment.reset();
        for (let [idx, action] of mcHistory.entries()) {
            console.log(idx, action);
            if (idx >= 100 || interrupt) {
                break;
            }

            let [, cell] = game.environment._movePlayer(action);

            // check state
            let place = cell.lastChild;
            if (place.classList.contains("place") && place.done) {
                console.log("terminal place");
                break;
            }

            await sleep(200);
        }

        btnRun.classList.remove("disabled");
    } else if (selectAgent.value === "TD") {
        // TODO: implementation here!
        alert("Not implementation error!");
        btnRun.classList.remove("disabled");
    }
});
