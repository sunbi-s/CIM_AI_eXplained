import { Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_2')
const boardDom = frame.querySelector('.board');

let policyName = "random";
let game = new Game(boardDom, 0, policyName);
animate(game);

let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    game.run(10).then(() => {
        btnTest.disabled = false;
    });
});
