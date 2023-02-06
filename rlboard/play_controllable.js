import { Game } from "./rlboard.js";

const frame = document.querySelector('#play_1')
const canvas_1 = frame.querySelector('.canvas_1');
const canvas_2 = frame.querySelector('.canvas_2');
const c = canvas_1.getContext('2d');
const c2 = canvas_2.getContext('2d');

c.width = canvas_1.width;
c.height = canvas_1.height;
c2.width = canvas_2.width;
c2.height = canvas_2.height;

let policyName = "control";
let game = new Game(c, c2, 0, policyName);

let state = game.environment.reset();
let reward = 0;
let done = false;

frame.querySelector('.btn_action_0').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(0);
        game.render();
    }
    else {
        throw "reset!!!";
    }
});
frame.querySelector('.btn_action_1').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(1);
        game.render();
    }
    else {
        throw "reset!!!";
    }
});
frame.querySelector('.btn_action_2').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(2);
        game.render();
    }
    else {
        throw "reset!!!";
    }
});
frame.querySelector('.btn_action_3').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(3);
        game.render();
    }
    else {
        throw "reset!!!";
    }
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    state = game.environment.reset();
    done = false;
    game.render();
});
