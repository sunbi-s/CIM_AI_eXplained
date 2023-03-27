import { OptimGame, OptimGameAVG, animate } from "./game.js";

const frame = document.querySelector('#play_optim');
const boardDom = frame.querySelector('.board');
const canvas_1 = frame.querySelector('.canvas_1');
const context = canvas_1.getContext('2d');

context.width = canvas_1.width;
context.height = canvas_1.height;


export let game = new OptimGameAVG(boardDom, context, 0);
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
