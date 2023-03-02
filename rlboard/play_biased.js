import { MCGame, TDGame, animate } from "./game.js";
import { game } from "./play_optim.js"


const math = window['math'];
const frame = document.querySelector('#play_biased');
const boardDom1 = frame.querySelectorAll('.board')[0];
const boardDom2 = frame.querySelectorAll('.board')[1];


export let game1 = new MCGame(boardDom1, null, 0);
export let game2 = new TDGame(boardDom2, null, 0);
animate(game1);
animate(game2);


// show mean and std
const optim_value_table = game.agent.value_table;
const mc_value_table = game1.agent.value_table;
const td_value_table = game2.agent.value_table;

const temp_value_table = math.zeros(optim_value_table.length, optim_value_table[0].length)._data;
const p1 = document.createElement('p');
frame.appendChild(p1);
const p2 = document.createElement('p');
frame.appendChild(p2);

setInterval(() => {
    let mean, std;

    // mc
    for (let y = 0; y < optim_value_table.length; ++y) {
        for (let x = 0; x < optim_value_table[0].length; ++x) {
            temp_value_table[y][x] = optim_value_table[y][x] - mc_value_table[y][x];
        }
    }
    mean = math.mean(temp_value_table).toFixed(3);
    std = math.std(temp_value_table).toFixed(3);
    p1.innerText = "[MC] mean:" + mean + ", std:" + std;

    // td
    for (let y = 0; y < optim_value_table.length; ++y) {
        for (let x = 0; x < optim_value_table[0].length; ++x) {
            temp_value_table[y][x] = optim_value_table[y][x] - td_value_table[y][x];
        }
    }
    mean = math.mean(temp_value_table).toFixed(3);
    std = math.std(temp_value_table).toFixed(3);
    p2.innerText = "[TD] mean:" + mean + ", std:" + std;
}, 50);


// Add btn event
let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    let done1 = false;
    let done2 = false;
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game1.run(selectNum.value, 10).then(() => {
        done1 = true;
        btnTrain.disabled = !(done1 && done2);
        btnTest.disabled = !(done1 && done2);
    });
    game2.run(selectNum.value, 10).then(() => {
        done2 = true;
        btnTrain.disabled = !(done1 && done2);
        btnTest.disabled = !(done1 && done2);
    });
});
btnTest.addEventListener("click", function() {
    let done1 = false;
    let done2 = false;
    btnTrain.disabled = true;
    btnTest.disabled = true;
    game1.run_test(1).then(() => {
        done1 = true;
        btnTrain.disabled = !(done1 && done2);
        btnTest.disabled = !(done1 && done2);
    });
    game2.run_test(1).then(() => {
        done2 = true;
        btnTrain.disabled = !(done1 && done2);
        btnTest.disabled = !(done1 && done2);
    });
});
btnReset.addEventListener("click", function() {
    game1.environment.reset();
    game1.agent.reset()
    game2.environment.reset();
    game2.agent.reset()
});
