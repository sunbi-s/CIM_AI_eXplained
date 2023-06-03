import { CompareGame, animate } from "./game.js";

const frame = document.querySelector('#play_mc_vs_td');
const boardDom1 = frame.querySelectorAll('.board')[0];
const boardDom2 = frame.querySelectorAll('.board')[1];


let game = new CompareGame(boardDom1, boardDom2);
animate(game);

frame.insertBefore(game.games["MC"].agent.value_table.div, frame.children[5]);
frame.insertBefore(game.games["TD"].agent.value_table.div, frame.children[5]);

let btnTrain = frame.querySelector('.btn_train');
let btnStop = frame.querySelector('.btn_stop');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');
let nEpisodeText = frame.querySelector('.n_episode_text');

btnTrain.addEventListener("click", function() {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    btnTest.classList.add("disabled");
    btnTrain.style.display = "none";
    btnStop.style.display = "inline-block";

    game.run(1e3, 50, nEpisodeText).then(() => {
        btnTest.classList.remove("disabled");
        btnTrain.style.display = "inline-block";
        btnStop.style.display = "none";
    });
});
btnStop.addEventListener("click", function() {
    if (btnStop.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.remove("disabled");
    btnTest.classList.remove("disabled");
    btnTrain.style.display = "inline-block";
    btnTest.style.display = "inline-block";
    btnStop.style.display = "none";

    game.Interrupt();
    for (let key in game.games) {
        game.games[key].environment.reset();
    }
});
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";

    game.run_test(1).then(() => {
        btnTrain.classList.remove("disabled");
        btnTest.style.display = "inline-block";
        btnStop.style.display = "none";
    });
});
btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game.Interrupt();
    game.reset();

    nEpisodeText.innerText = "0";
});
