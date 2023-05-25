import { RDGame, animate } from "./game.js";

const frame = document.querySelector('#play_random')
const boardDom = frame.querySelector('.board');

let game = new RDGame(boardDom);
animate(game);

let btnTest = frame.querySelector('.btn_test');
let btnStop = frame.querySelector('.btn_stop');

btnTest.addEventListener("click", function() {
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";
    game.run_test(1).then(() => {
        btnTest.style.display = "inline-block";
        btnStop.style.display = "none";
    });
});
btnStop.addEventListener("click", function() {
    btnTest.style.display = "inline-block";
    btnStop.style.display = "none";

    game.interrupt = true;
    game.environment.reset();
});
