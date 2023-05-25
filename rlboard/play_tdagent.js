import {TDGame, animate, renderEffect} from "./game.js";
import {Position} from "./utill.js";

const frame = document.querySelector('#play_td')
const boardDom = frame.querySelector('.board');
const canvas_2 = frame.querySelector('.canvas_2');
const context = canvas_2.getContext('2d');

context.width = canvas_2.width;
context.height = canvas_2.height;


export let game = new TDGame(boardDom, context, 0);
animate(game);


let btnTrain = frame.querySelector('.btn_train');
let btnStep = frame.querySelector('.btn_step');
let btnStop = frame.querySelector('.btn_stop');
let btnTest = frame.querySelector('.btn_test');
let btnReset = frame.querySelector('.btn_reset');
let nEpisodeText = frame.querySelector('.n_episode_text');

btnTrain.addEventListener("click", function() {
    if (btnTrain.classList.contains("disabled")) {
        return;
    }

    btnTest.classList.add("disabled");
    btnTrain.style.display = "none";
    btnStep.classList.add("disabled");
    btnStop.style.display = "inline-block";

    game.interrupt = false;
    game.run(1e3, 10, nEpisodeText).then(() => {
        btnTest.classList.remove("disabled");
        btnTrain.style.display = "inline-block";
        btnStop.style.display = "none";
    });
});
btnStep.addEventListener("click", function() {
    if (btnStep.classList.contains("disabled")) {
        return;
    }

    // get action
    let state = game.environment._get_player_position().get();
    let action = game.agent.getRndAction(state);

    // step
    let [next_state, reward, done] = game.environment.step(action);

    // render effect
    renderEffect(game.environment._getCell(new Position(next_state[0], next_state[1])), 100);

    // update
    game.agent.learn(state, reward, next_state);
    // episode done
    if (done && nEpisodeText !== null) {
        nEpisodeText.innerText = parseInt(nEpisodeText.innerText) + 1;
        game.environment.reset();
    }
});
btnStop.addEventListener("click", function() {
    if (btnStop.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.remove("disabled");
    btnStep.classList.remove("disabled");
    btnTest.classList.remove("disabled");
    btnTrain.style.display = "inline-block";
    btnStep.style.display = "inline-block";
    btnTest.style.display = "inline-block";
    btnStop.style.display = "none";

    game.interrupt = true;
    game.environment.reset();
});
btnTest.addEventListener("click", function() {
    if (btnTest.classList.contains("disabled")) {
        return;
    }

    btnTrain.classList.add("disabled");
    btnStep.classList.add("disabled");
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";

    game.interrupt = false;
    game.run_test(1).then(() => {
        btnTrain.classList.remove("disabled");
        btnStep.classList.remove("disabled");
        btnTest.style.display = "inline-block";
        btnStop.style.display = "none";
    });
});
btnReset.addEventListener("click", function() {
    if (btnReset.classList.contains("disabled")) {
        return;
    }

    game.interrupt = true;
    game.environment.reset();
    game.agent.reset();

    nEpisodeText.innerText = "0";
});