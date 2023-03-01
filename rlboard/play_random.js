import { RDGame, animate } from "./game.js";

const frame = document.querySelector('#play_random')
const boardDom = frame.querySelector('.board');

let game = new RDGame(boardDom, 0);
animate(game);

let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    game.run_test(1).then(() => {
        btnTest.disabled = false;
    });
});
