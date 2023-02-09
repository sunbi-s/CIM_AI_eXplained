import { Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_2')
const canvas_1 = frame.querySelector('.canvas_1');
const c = canvas_1.getContext('2d');

c.width = canvas_1.width;
c.height = canvas_1.height;

let policyName = "random";
let game = new Game(c, 0, policyName);
animate(game);

let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    game.run(10).then(() => {
        btnTest.disabled = false;
    });
});
