import { OptimGame, animate } from "./game.js";

const frame = document.querySelector('#play_optim');
const boardDom = frame.querySelector('.board');
const canvas_1 = frame.querySelector('.canvas_1');
const context = canvas_1.getContext('2d');

context.width = canvas_1.width;
context.height = canvas_1.height;


export let game = new OptimGame(boardDom, context, 0);
animate(game);

let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    game.run_test(1).then(() => {
        btnTest.disabled = false;
    });
});

btnReset.addEventListener("click", function() {
    game.environment.reset();
});
