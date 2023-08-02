import {Game, animate, renderEffect} from "./game.js";
import {Position} from "./utill.js";

const frame = document.querySelector('#play_control')
const boardDom = frame.querySelector('.board');

let game = new Game(boardDom);
animate(game);


function adjustTextPosition() {
    let text_rewards = document.querySelectorAll(".text_reward");
    for (let i = 0; i < text_rewards.length; ++i) {
        let col = boardDom.querySelectorAll(".cell")[i];
        text_rewards[i].style.top = col.offsetTop + col.offsetHeight / 2.5 + "px";
        text_rewards[i].style.left = col.offsetLeft + col.offsetWidth / 2 + "px";
    }
}


for (let y = 0; y < game.environment.boardShape[0]; y++) {
    let row = boardDom.childNodes[y];
    for (let x = 0; x < game.environment.boardShape[1]; x++) {
        let col = row.childNodes[x];
        let text = document.createElement("p");
        text.classList.add("text_reward");
        boardDom.appendChild(text);

        // calculate reward
        let reward = game.environment.config.defaultReward;
        let curr_place = col.lastChild;
        if (curr_place && curr_place.classList.contains("place")) {
            reward += curr_place.reward;
        }

        // set text element position to cell
        text.innerText = reward;
        text.style.opacity = 0.7;
        text.style.fontSize = "12px";
        text.style.color = "white";
        text.style.position = "absolute";
        text.style.zIndex = 2;
    }
}

let state = game.environment.reset();
let reward = 0;
let done = false;

let message_content = {
    icon: 'error',
    title: 'Episode is finished.',
    text: "Please reset before starting again.",
};

frame.querySelector('.btn_action_0').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(0);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
        let next_reward = computeNextReward();
        addScore(next_reward);
    }
    else {
        Swal.fire(message_content);
    }
});
frame.querySelector('.btn_action_1').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(1);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
        let next_reward = computeNextReward();
        addScore(next_reward);
    }
    else {
        Swal.fire(message_content);
    }
});
frame.querySelector('.btn_action_2').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(2);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
        let next_reward = computeNextReward();
        addScore(next_reward);
    }
    else {
        Swal.fire(message_content);
    }
});
frame.querySelector('.btn_action_3').addEventListener("click", function() {
    if (!done) {
        [state, reward, done] = game.environment.step(3);
        renderEffect(game.environment._getCell(new Position(state[0], state[1])));
        let next_reward = computeNextReward();
        addScore(next_reward);
    }
    else {
        Swal.fire(message_content);
    }
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    state = game.environment.reset();
    done = false;
    resetScore();
});

window.addEventListener("resize", adjustTextPosition);
adjustTextPosition();


let scoreText = frame.querySelector('#score_text');
let score = 0;
function addScore(_reward) {
    score += _reward;
    scoreText.innerText = score.toFixed(1);
}

function resetScore() {
    score = 0;
    scoreText.innerText = score.toFixed(1);
}

function computeNextReward() {
    let next_reward = game.environment.config.defaultReward;

    // compute reward
    let CurrentPos = game.environment._get_player_position();
    let currentCell = game.environment._getCell(CurrentPos);
    let curr_place = currentCell.lastChild;
    if (curr_place.classList.contains("place")) {
        next_reward += curr_place.reward;
    }
    return next_reward;
}
