import { Position } from "./utill.js";
import { Game, MCGame, TDGame, OptimGame, NstepTDGame, animate, animate2 } from "./game.js";

const frame = document.querySelector('#play_draganddrop')
const boardDom = frame.querySelector('.board');
const hiddenBoardDom1 = frame.querySelector('#hiddenBoard1');
const hiddenBoardDom2 = frame.querySelector('#hiddenBoard2');
const hiddenBoardDom3 = frame.querySelector('#hiddenBoard3');
const hiddenBoardDom4 = frame.querySelector('#hiddenBoard4');

boardDom.style.cursor = 'pointer';


let dummyGame = new Game(boardDom);
animate2(dummyGame);

let mcGame = new MCGame(hiddenBoardDom1);
mcGame.environment.div = boardDom;
mcGame.environment.player = dummyGame.environment.player;
let mcVtable = mcGame.agent.value_table.div;
mcVtable.style.display = "none";

let tdGame = new TDGame(hiddenBoardDom2);
tdGame.environment.div = boardDom;
tdGame.environment.player = dummyGame.environment.player;
let tdVtable = tdGame.agent.value_table.div;
tdVtable.style.display = "none";

let optimGame = new OptimGame(hiddenBoardDom3);
optimGame.environment.div = boardDom;
optimGame.environment.player = dummyGame.environment.player;
let optimVtable = optimGame.agent.value_table.div;
optimVtable.style.display = "none";

let n_step_tdGame = new NstepTDGame(hiddenBoardDom4);
n_step_tdGame.environment.div = boardDom;
n_step_tdGame.environment.player = dummyGame.environment.player;
let NtdVtable = n_step_tdGame.agent.value_table.div;
NtdVtable.style.display = "none";

animate(mcGame);
animate(tdGame);
animate(n_step_tdGame);
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
let select_n_step_drop_down = frame.querySelector('.select_n_step_drop_down');
let select_n_step = frame.querySelector('#select_n_step');
let btnStop = frame.querySelector('.btn_stop');
let btnTest = frame.querySelector('.btn_test');
let nEpisodeText = frame.querySelector('.n_episode_text');

let nEpisodes = [0, 0], idx = 0;

btnSave.addEventListener("click", async function() {
    btnSave.style.display = "none";
    btnBack.style.display = "inline-block";
    divPlayMyMDP.style.display = "inline-block";
    place_creator.style.display = "none";
    trash_can.style.display = "none";

    if (selectAgent.value === "Optimal") {
        optimVtable.style.display = "inline-block";
    } else if (selectAgent.value === "MC") {
        mcVtable.style.display = "inline-block";
    } else if (selectAgent.value === "TD") {
        tdVtable.style.display = "inline-block";
    }
    else if (selectAgent.value === "N_STEP_TD") {
        NtdVtable.style.display = "inline-block";
    }

    // make all places draggable false
    for (let draggable of boardDom.querySelectorAll(".draggable")) {
        unsetDraggable(draggable);
    }

    // init agents
    optimGame.agent.computeValues(true);

    // render v-table
    selectAgent.value = "MC";
    selectAgent.dispatchEvent(new Event("change"));
    nEpisodes = [0, 0];
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
    place_creator.style.display = "block";
    trash_can.style.display = "block";

    optimVtable.style.display = "none";
    mcVtable.style.display = "none";
    tdVtable.style.display = "none";
    NtdVtable.style.display = "none";

    optimGame.interrupt = true;
    mcGame.interrupt = true;
    tdGame.interrupt = true;
    n_step_tdGame.interrupt = true;

    // reset agents
    mcGame.agent.reset();
    tdGame.agent.reset();
    n_step_tdGame.agent.reset();
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
    n_step_tdGame.interrupt = false;

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
    } else if (selectAgent.value === "N_STEP_TD") {
        n_step_tdGame.run(1e3, 10, nEpisodeText).then(() => {
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
    n_step_tdGame.interrupt = true;
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
    n_step_tdGame.interrupt = false;

    if (selectAgent.value === "Optimal") {
        optimGame.run_test(1).then(() => {
            btnTrain.classList.remove("disabled");
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
    } else if (selectAgent.value === "N_STEP_TD") {
        n_step_tdGame.run_test(1).then(() => {
            btnTrain.classList.remove("disabled");
            btnBack.classList.remove("disabled");
            btnTest.style.display = "inline-block";
            btnStop.style.display = "none";
            selectAgent.disabled = false;
        });
    }
});


// Add dropdown event
selectAgent.addEventListener("change", function (ev) {
    dummyGame.environment.reset();
    if (selectAgent.value === "Optimal") {
        btnTrain.style.display = "none";
        optimVtable.style.display = "inline-block";
        mcVtable.style.display = "none";
        tdVtable.style.display = "none";
        NtdVtable.style.display = "none";
        select_n_step_drop_down.style.display = "none";
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "none";
        });
    } else if (selectAgent.value === "MC") {
        btnTrain.style.display = "inline-block";
        optimVtable.style.display = "none";
        mcVtable.style.display = "inline-block";
        tdVtable.style.display = "none";
        NtdVtable.style.display = "none";
        select_n_step_drop_down.style.display = "none";
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "inline-block";
        });
        nEpisodes[idx] = nEpisodeText.innerText;
        nEpisodeText.innerText = nEpisodes[idx = 0];
    } else if (selectAgent.value === "TD") {
        btnTrain.style.display = "inline-block";
        optimVtable.style.display = "none";
        mcVtable.style.display = "none";
        tdVtable.style.display = "inline-block";
        NtdVtable.style.display = "none";
        select_n_step_drop_down.style.display = "none";
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "inline-block";
        });
        nEpisodes[idx] = nEpisodeText.innerText;
        nEpisodeText.innerText = nEpisodes[idx = 1];
    } else if (selectAgent.value === "N_STEP_TD") {
        btnTrain.style.display = "inline-block";
        optimVtable.style.display = "none";
        mcVtable.style.display = "none";
        tdVtable.style.display = "none";
        NtdVtable.style.display = "inline-block";
        select_n_step_drop_down.style.display = "inline-block";
        frame.querySelectorAll(".n_episode").forEach((elem) => {
            elem.style.display = "inline-block";
        });
        nEpisodes[idx] = nEpisodeText.innerText;
        nEpisodeText.innerText = nEpisodes[idx = 1];
    }
});

select_n_step.addEventListener("change", function (ev) {
    n_step_tdGame.agent.N = Number(select_n_step.value)
});