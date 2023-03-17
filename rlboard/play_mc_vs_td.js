import {MCGame, animate, TDGame} from "./game.js";

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


export let game1 = new MCGame(boardDom1, context1, 0);
export let game2 = new TDGame(boardDom2, context2, 0);
animate(game1);
animate(game2);

let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    let done1 = false;
    let done2 = false;
    btnTrain.classList.add("disabled");
    btnTest.classList.add("disabled");
    btnReset.classList.add("disabled");
    game1.run(selectNum.value, 50).then(() => {
        done1 = true;
        if (done1 && done2) {
            btnTrain.classList.remove("disabled");
            btnTest.classList.remove("disabled");
            btnReset.classList.remove("disabled");
        }
    });
    game2.run(selectNum.value, 50).then(() => {
        done2 = true;
        if (done1 && done2) {
            btnTrain.classList.remove("disabled");
            btnTest.classList.remove("disabled");
            btnReset.classList.remove("disabled");
        }
    });
});
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    let done1 = false;
    let done2 = false;
    btnTrain.classList.add("disabled");
    btnTest.classList.add("disabled");
    btnReset.classList.add("disabled");
    game1.run_test(1).then(() => {
        done1 = true;
        if (done1 && done2) {
            btnTrain.classList.remove("disabled");
            btnTest.classList.remove("disabled");
            btnReset.classList.remove("disabled");
        }
    });
    game2.run_test(1).then(() => {
        done2 = true;
        if (done1 && done2) {
            btnTrain.classList.remove("disabled");
            btnTest.classList.remove("disabled");
            btnReset.classList.remove("disabled");
        }
    });
});
btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game1.environment.reset();
    game1.agent.reset()
    game2.environment.reset();
    game2.agent.reset()
});
