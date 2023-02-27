import { MCGame, animate } from "./rlboard.js";

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


let policyName1 = "mc";
let policyName2 = "td";
export let game1 = new MCGame(boardDom1, context1, 0, policyName1);
export let game2 = new MCGame(boardDom2, context2, 0, policyName2);
animate(game1);
animate(game2);

let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game1.run(selectNum.value, 100).then(() => {
        btnTrain.disabled = false;
        btnTest.disabled = false;
    });
    game2.run_td(selectNum.value, 100).then(() => {
        btnTrain.disabled = false;
        btnTest.disabled = false;
    });
});
btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    game1.run_test(1).then(() => {
        btnTest.disabled = false;
    });
    game2.run_test(1).then(() => {
        btnTest.disabled = false;
    });
});
btnReset.addEventListener("click", function() {
    game1.environment.reset();
    game1.agent.reset()
    game2.environment.reset();
    game2.agent.reset()
});
