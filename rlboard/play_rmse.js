import { RMSEGame } from "./game.js";

const frame = document.querySelector('#play_rmse');


let game = new RMSEGame(frame);


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
    for (let key in game.games) {
        game.games[key].environment.reset();
    }
});
btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game.Interrupt();
    game.reset();
});
