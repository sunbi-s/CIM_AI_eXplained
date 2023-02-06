import { Game } from "./rlboard.js";

const frame = document.querySelector('#play_3')
const canvas_1 = frame.querySelector('.canvas_1');
const canvas_2 = frame.querySelector('.canvas_2');
const c = canvas_1.getContext('2d');
const c2 = canvas_2.getContext('2d');

c.width = canvas_1.width;
c.height = canvas_1.height;
c2.width = canvas_2.width;
c2.height = canvas_2.height;

let policyName = "mc";
let game = new Game(c, c2, 0, policyName);

frame.querySelector('#btn_0_mcagent').addEventListener("click", function() {
    this.disabled = true;
    game.run(10).then(() => {
        this.disabled = false;
    });
});

