import {Game, animate, renderEffect} from "./game.js";
import {Position} from "./utill.js";

const frame = document.querySelector('#play_control')
const boardDom = frame.querySelector('.board');

let policyName = "control";
let game = new Game(boardDom, 0, policyName);
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;

frame.querySelector('.btn_action_0').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(0);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
    }
    else {
        alert("Episode is done.\nYou have to reset before playing.");
    }
});
frame.querySelector('.btn_action_1').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(1);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
    }
    else {
        alert("Episode is done.\nYou have to reset before playing.");
    }
});
frame.querySelector('.btn_action_2').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(2);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
    }
    else {
        alert("Episode is done.\nYou have to reset before playing.");
    }
});
frame.querySelector('.btn_action_3').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(3);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
    }
    else {
        alert("Episode is done.\nYou have to reset before playing.");
    }
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    state = game.environment.reset();
    done = false;
});
