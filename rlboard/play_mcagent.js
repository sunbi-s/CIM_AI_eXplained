import { MCGame, animate } from "./game.js";

const frame = document.querySelector('#play_mc');
const boardDom = frame.querySelector('.board');


export let game = new MCGame(boardDom);
animate(game);


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

    game.interrupt = false;
    game.run(1e3, 10, nEpisodeText).then(() => {
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

    game.interrupt = true;
    game.environment.reset();
});
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";

    game.interrupt = false;
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

    game.interrupt = true;
    game.environment.reset();
    game.agent.reset();

    nEpisodeText.innerText = "0";
});
