import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_5')
const div_1 = frame.querySelector('.div_1');

let policyName = "control";
let game = new Game(div_1, 0, policyName);
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;

let playerDom = game.environment.player.dom;
playerDom.addEventListener("drag", (event) => {
    // console.log([event.offsetY, event.offsetX]);
});

playerDom.addEventListener("dragend", (event) => {
    let cellWidth = getComputedStyle(div_1.childNodes[0].childNodes[0]).width;
    let cellHeight = getComputedStyle(div_1.childNodes[0].childNodes[0]).height;
    let dy = parseInt(event.offsetY / parseInt(cellHeight));
    if (event.offsetY < 0) {
        dy -= 1;
    }
    let dx = parseInt(event.offsetX / parseInt(cellWidth));
    if (event.offsetX < 0) {
        dx -= 1;
    }
    let position = game.environment.player.position;
    let new_position = new Position(position.y + dy, position.x + dx);
    game.environment.player.move(new_position);
});
