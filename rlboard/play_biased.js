import { BiasGame } from "./game.js";


const frame = document.querySelector('#play_biased');
const boardDom1 = frame.querySelectorAll('.board')[0];
const boardDom2 = frame.querySelectorAll('.board')[1];
const boardDom3 = frame.querySelectorAll('.board')[2];


export let game = new BiasGame(boardDom1, boardDom2, boardDom3, 0);


// Add btn event
let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    btnTrain.disabled = true;
    btnReset.disabled = true;
    game.run(selectNum.value, 0).then(() => {
        btnTrain.disabled = false;
        btnReset.disabled = false;
    });
});
btnReset.addEventListener("click", function() {
    game.reset();
});
