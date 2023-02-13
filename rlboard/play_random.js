import { Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_2')
const div_1 = frame.querySelector('.div_1');

let policyName = "random";
let game = new Game(div_1, 0, policyName);
animate(game);

let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    game.run(10).then(() => {
        btnTest.disabled = false;
    });
});
