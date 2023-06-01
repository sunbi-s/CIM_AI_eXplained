import { RMSEGame2 } from "./game.js";

const frame = document.querySelector('#play_rmse2');
const boardDom1 = frame.querySelectorAll('.board')[0];
const boardDom2 = frame.querySelectorAll('.board')[1];
const boardDom3 = frame.querySelectorAll('.board')[2];
const boardDom4 = frame.querySelectorAll('.board')[3];
const boardDom5 = frame.querySelectorAll('.board')[4];


let game = new RMSEGame2(boardDom1, boardDom2, boardDom3, boardDom4, boardDom5);



// Add btn event
let btnTrain = frame.querySelector('.btn_train');
let btnStop = frame.querySelector('.btn_stop');
let btnReset = frame.querySelector('.btn_reset');

btnTrain.addEventListener("click", function() {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    btnTrain.style.display = "none";
    btnStop.style.display = "inline-block";
    game.run(1e3, 0).then(() => {
        btnTrain.style.display = "inline-block";
        btnStop.style.display = "none";
    });
});
btnStop.addEventListener("click", function() {
    if (btnStop.classList.contains("disabled")) {
        return;
    }

    btnTrain.style.display = "inline-block";
    btnStop.style.display = "none";

    game.Interrupt();
    game.mcGame.environment.reset();
    game.tdGame.environment.reset();
});
btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game.Interrupt();
    game.reset();
});
