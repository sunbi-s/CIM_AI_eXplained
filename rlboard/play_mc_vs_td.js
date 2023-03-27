import { CompareGame, animate } from "./game.js";

const frame = document.querySelector('#play_mc_vs_td');
const boardDom1 = frame.querySelectorAll('.board')[0];
const boardDom2 = frame.querySelectorAll('.board')[1];
const canvas1 = frame.querySelector('.canvas_1');
const canvas2 = frame.querySelector('.canvas_2');
const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');
context1.width = canvas1.width;
context1.height = canvas1.height;
context2.width = canvas2.width;
context2.height = canvas2.height;


let game = new CompareGame(boardDom1, boardDom2, 0, context1, context2);
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

    btnTest.classList.remove("disabled");
    btnTrain.style.display = "inline-block";
    btnStop.style.display = "none";

    game.Interrupt();
    game.mcGame.environment.reset();
    game.tdGame.environment.reset();
});
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnTest.classList.add("disabled");
    game.run_test(1).then(() => {
        btnTrain.classList.remove("disabled");
        btnTest.classList.remove("disabled");
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
