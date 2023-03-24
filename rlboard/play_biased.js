import { BiasGame } from "./game.js";

const frame = document.querySelector('#play_biased');
const boardDom1 = frame.querySelectorAll('.board')[0];
const boardDom2 = frame.querySelectorAll('.board')[1];
const boardDom3 = frame.querySelectorAll('.board')[2];


let game = new BiasGame(boardDom1, boardDom2, boardDom3, 0);


// Add btn event
let selectNum = frame.querySelector('.select_num');
let btnTrain = frame.querySelector('.btn_train');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    game.run(selectNum.value, 0).then(() => {
        btnTrain.classList.remove("disabled");
    });
});
btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game.Interrupt();
    game.reset();
});
