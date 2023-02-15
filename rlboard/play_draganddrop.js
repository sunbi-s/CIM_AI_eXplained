import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_5')
const div_1 = frame.querySelector('.div_1');
div_1.style.cursor = 'pointer';

let policyName = "control";
let game = new Game(div_1, 0, policyName);
// game.render();
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;

function pixel2pos(pixelY, pixelX) {
    let cellHeight = parseInt(getComputedStyle(div_1.childNodes[0].childNodes[0]).height);
    let y = parseInt(pixelY / cellHeight);
    if (pixelY < 0) {
        y -= 1;
    }
    let cellWidth = parseInt(getComputedStyle(div_1.childNodes[0].childNodes[0]).width);
    let x = parseInt(pixelX / cellWidth);
    if (pixelX < 0) {
        x -= 1;
    }
    return [y, x];
}

let tempDom = document.createElement('div');
tempDom.className = 'temp';

let playerDom = game.environment.player.dom;
playerDom.draggable = true;
playerDom.style.userSelect = "auto";
playerDom.style.cursor = "move";
playerDom.addEventListener("dragstart", (e)=> {
    console.log("dragstart")
})
playerDom.addEventListener("drag", (event) => {
    let [dy, dx] = pixel2pos(event.offsetY, event.offsetX);
    let [y, x] = game.environment.player.position.get();
    let newY = Math.min(Math.max(0, y + dy), div_1.childNodes.length - 1);
    let newX = Math.min(Math.max(0, x + dx), div_1.childNodes[0].childNodes.length - 1);
    let cell = div_1.childNodes[newY].childNodes[newX];
    if (cell.childNodes.length > 0 && cell.firstChild !== tempDom) {
        cell.childNodes[0].appendChild(tempDom);
    } else {
        cell.appendChild(tempDom);
    }
    tempDom.style.display = 'block';
});

playerDom.addEventListener("dragend", (event) => {
    let [dy, dx] = pixel2pos(event.offsetY, event.offsetX);
    let position = game.environment.player.position;
    let new_position = new Position(position.y + dy, position.x + dx);
    game.environment.player.move(new_position);
    tempDom.style.display = 'none';
});
