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
btnTrain.addEventListener("click", function() {
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game.run(selectNum.value).then(() => {
        btnTrain.disabled = false;
        btnTest.disabled = false;
    });
});

btnTest.addEventListener("click", function() {
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game.run_test(1).then(() => {
        btnTrain.disabled = false;
        btnTest.disabled = false;
    });
});

btnReset.addEventListener("click", function() {
    game.environment.reset();
    game.agent.reset();
});