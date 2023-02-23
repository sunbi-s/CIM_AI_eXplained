import { Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_4')
const boardDom = frame.querySelector('.board');

let policyName = "td";
let game = new Game(boardDom, 0, policyName);
animate(game);

let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game.run_qtd(selectNum.value).then(() => {
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
    game.render();
});

