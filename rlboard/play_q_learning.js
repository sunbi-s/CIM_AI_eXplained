import { Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_4')
const canvas_1 = frame.querySelector('.canvas_1');
const canvas_2 = frame.querySelector('.canvas_2');
const c = canvas_1.getContext('2d');
const c2 = canvas_2.getContext('2d');

c.width = canvas_1.width;
c.height = canvas_1.height;
c2.width = canvas_2.width;
c2.height = canvas_2.height;

let policyName = "td";
let game = new Game(c, c2, 0, policyName);
animate(game);

let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game.run_td(selectNum.value).then(() => {
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
    game.agent.reset()
    game.render();
});

