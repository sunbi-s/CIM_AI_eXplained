import { Position } from "./utill.js";
import { Game, MCGame, TDGame, OptimGame, animate } from "./game.js";

const frame = document.querySelector('#play_draganddrop')
const boardDom = frame.querySelector('.board');
const hiddenBoardDom1 = frame.querySelector('#hiddenBoard1');
const hiddenBoardDom2 = frame.querySelector('#hiddenBoard2');
const canvas = frame.querySelector('canvas');
const context = canvas.getContext('2d');

context.width = canvas.width;
context.height = canvas.height;
boardDom.style.cursor = 'pointer';


let dummyGame = new Game(boardDom, 0);
animate(dummyGame);

let mcGame = new MCGame(hiddenBoardDom1, null, 0);
mcGame.environment.div = boardDom;
mcGame.environment.player = dummyGame.environment.player;
let tdGame = new TDGame(hiddenBoardDom2, null, 0);
tdGame.environment.div = boardDom;
tdGame.environment.player = dummyGame.environment.player;

let div = document.createElement("div");
let optimGame = new OptimGame(div, null, 0);
optimGame.environment.div = boardDom;
optimGame.environment.player = dummyGame.environment.player;
animate(mcGame);
animate(tdGame);
animate(optimGame);


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
        // Swal.fire({
        //     icon: 'error',
        //     title: 'Not enough terminal place.',
        //     text: "There should be at least one terminal place in board.",
        // });
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
                dummyGame.environment.moveNode(draggable, cellPosition);
            } else if (draggable.parentNode.classList.contains("place_creator")) {
                // Create new node
                let cellPosition = getCellPosition(boardDom, cell);
                let copied_draggable = dummyGame.environment.createPlace(cellPosition, draggable.getAttribute("placeIndex"));

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
let btnStop = frame.querySelector('.btn_stop');
let btnTest = frame.querySelector('.btn_test');
let nEpisodeText = frame.querySelector('.n_episode_text');


btnSave.addEventListener("click", async function() {
    btnSave.style.display = "none";
    btnBack.style.display = "inline-block";
    divPlayMyMDP.style.display = "inline-block";
    place_creator.style.display = "none";
    trash_can.style.display = "none";
    canvas.style.display = "inline-block";

    // make all places draggable false
    for (let draggable of boardDom.querySelectorAll(".draggable")) {
        unsetDraggable(draggable);
    }

    // init agents
    optimGame.agent.computeValues(true);

    // render v-table
    mcGame.context = context;
    selectAgent.value = "MC";
    selectAgent.dispatchEvent(new Event("change"));
});
btnBack.addEventListener("click", function() {
    if (btnBack.classList.contains("disabled")) {
        return;
    }

    btnTest.classList.remove("disabled");
    btnTrain.style.display = "inline-block";
    btnStop.style.display = "none";

    btnSave.style.display = "inline-block";
    btnBack.style.display = "none";
    divPlayMyMDP.style.display = "none";
    canvas.style.display = "none";
    place_creator.style.display = "block";
    trash_can.style.display = "block";

    optimGame.interrupt = true;
    mcGame.interrupt = true;
    tdGame.interrupt = true;

    // reset agents
    mcGame.agent.reset();
    tdGame.agent.reset();
    dummyGame.environment.reset();

    for (let place of boardDom.querySelectorAll(".place")) {
        setDraggable(place);
    }
});
btnTrain.addEventListener("click", async function () {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    btnTest.classList.add("disabled");
    btnTrain.style.display = "none";
    btnStop.style.display = "inline-block";
    selectAgent.disabled = true;

    optimGame.interrupt = false;
    mcGame.interrupt = false;
    tdGame.interrupt = false;

    if (selectAgent.value === "Optimal") {
        btnBack.classList.add("disabled");
        optimGame.run_test(1).then(() => {
            btnTest.classList.remove("disabled");
            btnTrain.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    } else if (selectAgent.value === "MC") {
        mcGame.run(1e3, 10, nEpisodeText).then(() => {
            btnTest.classList.remove("disabled");
            btnTrain.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    } else if (selectAgent.value === "TD") {
        tdGame.run(1e3, 10, nEpisodeText).then(() => {
            btnTest.classList.remove("disabled");
            btnTrain.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    }
});
btnStop.addEventListener("click", function() {
    if (btnStop.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.remove("disabled");
    btnTest.classList.remove("disabled");
    if (selectAgent.value !== "Optimal") {
        btnTrain.style.display = "inline-block";
    }
    btnTest.style.display = "inline-block";
    btnStop.style.display = "none";

    optimGame.interrupt = true;
    mcGame.interrupt = true;
    tdGame.interrupt = true;
    dummyGame.environment.reset();
});
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";
    selectAgent.disabled = true;

    optimGame.interrupt = false;
    mcGame.interrupt = false;
    tdGame.interrupt = false;

    if (selectAgent.value === "Optimal") {
        optimGame.run_test(1).then(() => {
            btnTest.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    } else if (selectAgent.value === "MC") {
        mcGame.run_test(1).then(() => {
            btnTrain.classList.remove("disabled");
            btnBack.classList.remove("disabled");
            btnTest.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    } else if (selectAgent.value === "TD") {
        tdGame.run_test(1).then(() => {
            btnTrain.classList.remove("disabled");
            btnBack.classList.remove("disabled");
            btnTest.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    }
});


// Add dropdown event
let nEpisodes = [0, 0];
selectAgent.addEventListener("change", function () {
    dummyGame.environment.reset();
    if (selectAgent.value === "Optimal") {
        btnTrain.style.display = "none";
        optimGame.context = context;
        mcGame.context = null;
        tdGame.context = null;
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "none";
        });
    } else if (selectAgent.value === "MC") {
        btnTrain.style.display = "inline-block";
        optimGame.context = null;
        mcGame.context = context;
        tdGame.context = null;
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "inline-block";
        });
        nEpisodes[1] = nEpisodeText.innerText;
        nEpisodeText.innerText = nEpisodes[0];
    } else if (selectAgent.value === "TD") {
        btnTrain.style.display = "inline-block";
        optimGame.context = null;
        mcGame.context = null;
        tdGame.context = context;
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "inline-block";
        });
        nEpisodes[0] = nEpisodeText.innerText;
        nEpisodeText.innerText = nEpisodes[1];
    }
});
