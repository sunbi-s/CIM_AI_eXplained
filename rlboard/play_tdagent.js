import { TDGame, animate } from "./game.js";

const frame = document.querySelector('#play_td')
const boardDom = frame.querySelector('.board');
const canvas_2 = frame.querySelector('.canvas_2');
const context = canvas_2.getContext('2d');

context.width = canvas_2.width;
context.height = canvas_2.height;


export let game = new TDGame(boardDom, context, 0);
animate(game);

let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');
let nEpisodeText = frame.querySelector('.n_episode');

btnTrain.addEventListener("click", function() {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnTest.classList.add("disabled");
    btnReset.classList.add("disabled");
    game.run(selectNum.value, 10, nEpisodeText).then(() => {
        btnTrain.classList.remove("disabled");
        btnTest.classList.remove("disabled");
        btnReset.classList.remove("disabled");
    });
});

btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnTest.classList.add("disabled");
    btnReset.classList.add("disabled");
    game.run_test(1).then(() => {
        btnTrain.classList.remove("disabled");
        btnTest.classList.remove("disabled");
        btnReset.classList.remove("disabled");
    });
});

btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game.environment.reset();
    game.agent.reset();
});