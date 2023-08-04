import configs from "./config.js";
import { Environment } from "./rlboard.js";
import { RandomAgent, MCAgent, TDAgent, OptimAgent, NstepTDAgent } from "./agents.js";
import { Position, rgba, sleep } from "./utill.js";


const math = window['math'];


export function animate(game) {
    function renderFrame() {
        game.render();
        requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
}

export function animate2(game) {
    setTimeout(() => {
        requestAnimationFrame(function () {
            animate(game);
        });
    }, 50);

    game.render();
}


export function renderEffect(cell, timeout=500) {
    if (cell.childNodes.length < 2) {
        return;
    }

    if (cell.lastChild.classList.contains("place")) {
        let effect = document.createElement("img");
        effect.classList.add("effect");

        if (cell.lastChild.done) {
            effect.src = "img/rlboard/effect/Clear.png";
            effect.style.zIndex = "4";
            effect.style.position = "absolute";
            effect.style.height = "200px";
            effect.style.width = "400px";
            effect.style.top = cell.parentNode.parentElement.offsetTop + 50 + "px";
            effect.style.left = cell.parentNode.parentElement.offsetLeft - 20 + "px";
            cell.parentNode.parentElement.appendChild(effect);
        } else {
            effect.src = "img/rlboard/effect/Explosion.png";
            cell.insertBefore(effect, cell.lastChild);
        }

        setTimeout(() => effect.remove(), timeout);
    }
}

function renderHighlight(cell, timeout=500) {
    let effect = document.createElement("img");
    effect.classList.add("effect");
    effect.src = "img/rlboard/effect/blood.png";
    effect.style.height = "50px";
    effect.style.width = "50px";
    cell.parentNode.appendChild(effect);

    // set effect element position to cell
    effect.style.position = "absolute";
    effect.style.top = cell.offsetTop + 5 + "px";
    effect.style.left = cell.offsetLeft + cell.offsetWidth / 2 + 5 + "px";

    setTimeout(() => effect.remove(), timeout);
}


export class Game{
    constructor(div) {
        this.environment = new Environment(div, configs[0]);
        this.max_step_num = 1000;

        this.interrupt = false;
    }

    render() {
        // draw environment
        this.environment.render();
    }
}

export class RDGame extends Game {
    constructor(div) {
        super(div);

        this.agent = new RandomAgent(this.environment);
    }

    async run_test(max_episode_num, sleep_time=300) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            // delay
            if (sleep_time > 0){
                await sleep(sleep_time);
            }


            for (let step = 1; step < this.max_step_num; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    return;
                }

                // get action
                action = this.agent.getAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);

                // render effect
                renderEffect(this.environment._getCell(new Position(next_state[0], next_state[1])));

                // episode done
                if (done) {
                    break;
                } else {
                    state = [next_state[0], next_state[1]];
                }

                //delay
                if (sleep_time > 0){
                    await sleep(sleep_time);
                }
            }
        }
    }
}

export class MCGame extends Game {
    constructor(div) {
        super(div);
        this._makeAgent();
    }

    _makeAgent() {
        this.agent = new MCAgent(this.environment);
    }

    async run(max_episode_num, sleep_time=10, episodeTextDom=null) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();
            let rewards = [];

            // delay
            if (sleep_time > 0){
                await sleep(sleep_time);
            }

            for (step = 1; step < this.max_step_num; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    return;
                }

                // get action
                // action = this.agent.getAction(state);
                action = this.agent.getRndAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);
                rewards.push(reward);

                // render effect
                renderEffect(this.environment._getCell(new Position(next_state[0], next_state[1])), 100);

                // save sample
                this.agent.saveSample(state, reward, done);

                state = [next_state[0], next_state[1]];

                // episode done
                if (done) {
                    if (episodeTextDom !== null) {
                        episodeTextDom.innerText = parseInt(episodeTextDom.innerText) + 1;
                    }
                    break;
                }

                //delay
                if (sleep_time > 0){
                    await sleep(sleep_time);
                }
            }

            this.agent.update();
        }
    }

    async run_test(max_episode_num, sleep_time=300) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            // delay
            if (sleep_time > 0){
                await sleep(sleep_time);
            }

            for (let step = 1; step < 30; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    return;
                }

                // get action
                action = this.agent.getOptimalAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);

                // render effect
                renderEffect(this.environment._getCell(new Position(next_state[0], next_state[1])));

                // state no change
                if (state[0] === next_state[0] && state[1] === next_state[1]) {
                    break;
                }
                state = [next_state[0], next_state[1]];
                // episode done
                if (done) {
                    break;
                }

                //delay
                if (sleep_time > 0){
                    await sleep(sleep_time);
                }
            }
        }
    }

    render() {
        super.render();

        if (this.agent.value_table.div == null) {
            return;
        }

        let epsilon = 0.0000000001;
        let alpha = 0.4;
        let textColor;
        let value;
        let maxValue = Math.max(...this.agent.value_table.flat().slice(0,6*6-2)) + epsilon;
        let minValue = Math.min(...this.agent.value_table.flat()) + epsilon;
        let nodeScale = 1 / this.environment.boardShape[0];

        // draw value table
        for (let y = 0; y < this.environment.boardShape[0]; ++y) {
            for (let x = 0; x < this.environment.boardShape[1]; ++x) {
                value = this.agent.value_table[y][x];

                // calculate color
                let cell = this.environment._getCell(new Position(y, x));
                let vCell = this.agent.value_table.getCell(new Position(y, x));
                let place = cell.lastChild;
                if (place && place.classList.contains("place") && place.done) {
                    vCell.style.backgroundColor = rgba(255, 255, 255, 0.7);
                    textColor = rgba(0, 0, 0, 1.0);
                } else if (value === 0) {
                    vCell.style.backgroundColor = rgba(255, 255, 255, alpha);
                    textColor = rgba(0, 0, 0, 1.0);
                } else {
                    let min_r = 24, max_r = 236;
                    let min_g = 40, max_g = 237;
                    let min_b = 198, max_b = 245;
                    let normalize = (value- minValue)/(maxValue - minValue);
                    let r = (normalize)*(max_r-min_r)
                    let g = (normalize)*(max_g-min_g)
                    let b = (normalize)*(max_b-min_b)
                    vCell.style.backgroundColor = rgba(min_r + r, min_g + g, min_b + b, alpha);

                    if (normalize < 0.12) {
                        let color = (1 - normalize) * 240;
                        textColor = rgba(color, color, color, 1.0);
                    } else {
                        textColor = rgba(0, 0, 0, 1.0);
                    }
                }

                // render highlight when value changed
                if (vCell.innerText !== value.toFixed(2)) {
                    renderHighlight(vCell, 200);
                }

                // set text
                vCell.innerText = value.toFixed(2);
            }
        }
    }
}

export class TDGame extends MCGame {
    _makeAgent() {
        this.agent = new TDAgent(this.environment);
    }

    async run(max_episode_num, sleep_time=10, episodeTextDom=null) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action ,reward, done;
            let state = this.environment.reset();
            let rewards = [];

            // delay
            await sleep(sleep_time);

            for (step = 1; step < this.max_step_num; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    return;
                }

                // get action
                // action = this.agent.getAction(state);
                action = this.agent.getRndAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);
                rewards.push(reward);

                // render effect
                renderEffect(this.environment._getCell(new Position(next_state[0], next_state[1])), 100);

                // update
                this.agent.learn(state, reward, next_state);
                state = [next_state[0], next_state[1]];
                // episode done
                if (done) {
                    if (episodeTextDom !== null) {
                        episodeTextDom.innerText = parseInt(episodeTextDom.innerText) + 1;
                    }
                    break;
                }

                // delay
                await sleep(sleep_time);
            }
        }
    }
}

export class NstepTDGame extends TDGame{
    _makeAgent() {
        this.agent = new NstepTDAgent(this.environment);
    }

    async run(max_episode_num, sleep_time=10, episodeTextDom=null) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action ,reward, done;
            let state = this.environment.reset();
            let rewards = [];

            // delay
            await sleep(sleep_time);

            for (step = 1; step < this.max_step_num; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    return;
                }

                // get action
                // action = this.agent.getAction(state);
                action = this.agent.getRndAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);
                rewards.push(reward);

                // render effect
                renderEffect(this.environment._getCell(new Position(next_state[0], next_state[1])), 100);

                // update
                this.agent.learn(state, reward, next_state, done);
                state = [next_state[0], next_state[1]];
                // episode done
                if (done) {
                    if (episodeTextDom !== null) {
                        episodeTextDom.innerText = parseInt(episodeTextDom.innerText) + 1;
                    }
                    break;
                }

                // delay
                await sleep(sleep_time);
            }
        }
    }
}

export class OptimGame extends MCGame {
    _makeAgent() {
        this.agent = new OptimAgent(this.environment, true);
    }
}

export class OptimGameAVG extends MCGame {
    _makeAgent() {
        this.agent = new OptimAgent(this.environment, false);
    }
}

export class CompareGame {
    constructor(mcDiv, tdDiv) {
        this.games = {};
        this.games["MC"] = new MCGame(mcDiv);
        this.games["TD"] = new TDGame(tdDiv);

        this.interrupt = false;
    }

    Interrupt() {
        this.interrupt = true;
        for (let key in this.games) {
            this.games[key].interrupt = true;
        }
    }

    async run(max_episode_num, sleep_time=10, episodeTextDom=null) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = Object.values(this.games)[0].environment.reset();
            for (let key in this.games) {
                this.games[key].environment.reset();
            }

            // delay
            if (sleep_time != 0){
                await sleep(sleep_time);
            }

            // get first one of this.games
            for (step = 1; step < Object.values(this.games)[0].max_step_num; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    for (let key in this.games) {
                        this.games[key].interrupt = false;
                    }
                    return;
                }

                // get action
                action = Object.values(this.games)[0].agent.getRndAction(state);

                // step
                for (let key in this.games) {
                    [next_state, reward, done] = this.games[key].environment.step(action);
                }

                // render effect
                for (let key in this.games) {
                    renderEffect(this.games[key].environment._getCell(new Position(next_state[0], next_state[1])), 100);
                }

                // update algorithms
                for (let key in this.games) {
                    if (key === "MC") {
                        this.games["MC"].agent.saveSample(state, reward, done);
                    } else {
                        this.games[key].agent.learn(state, reward, next_state);
                    }
                }

                // state
                state = [next_state[0], next_state[1]];

                // episode done
                if (done) {
                    if (episodeTextDom !== null) {
                        episodeTextDom.innerText = parseInt(episodeTextDom.innerText) + 1;
                    }
                    break;
                }

                // delay
                if (sleep_time != 0){
                    await sleep(sleep_time);
                }
            }

            this.games["MC"].agent.update();
        }
    }

    async run_test(max_episode_num, sleep_time=300) {
        let dones = {};
        for (let key in this.games) {
            dones[key] = false;
            this.games[key].run_test(max_episode_num, sleep_time).then(() => dones[key] = true);
        }

        // sync each game
        while (!Object.values(dones).every((done) => done)) { await sleep(); }

        this.interrupt = false;
    }

    reset() {
        for (let key in this.games) {
            this.games[key].environment.reset();
            this.games[key].agent.reset();
        }
    }

    render() {
        for (let key in this.games) {
            this.games[key].render();
        }
    }
}

export class RMSEGame extends CompareGame {
    constructor(frame) {
        let mcDiv = document.createElement("div");
        let tdDiv = document.createElement("div");
        let optimDiv = document.createElement("div");

        mcDiv.style.display = "none";
        tdDiv.style.display = "none";
        optimDiv.style.display = "none";

        frame.appendChild(mcDiv);
        frame.appendChild(tdDiv);
        frame.appendChild(optimDiv);

        super(mcDiv, tdDiv);
        this.optimGame = new OptimGameAVG(optimDiv);
        this.optimGame.agent.value_table.div.style.display = "none";

        // set value_table invisible
        for (let key in this.games) {
            this.games[key].agent.value_table.div.style.display = "none";
        }

        this.reset();
    }

    async run(max_episode_num, sleep_time=10) {
        for (let i = 0; i< max_episode_num; ++i)
        {
            // calculate rmse
            this._calcRmse();

            // plot
            this._plot();

            // run
            let done = false;
            super.run(1, 0).then(() => {done = true})
            while (!done) { await sleep(); }

            if (this.interrupt) {
                this.interrupt = false;
                return;
            }
        }
    }

    reset() {
        super.reset();

        this.rmses = {};
        for (let key in this.games) {
            this.rmses[key] = [];
        }

        // plot
        this._plot();
    }

    _calcRmse() {
        const optim_value_table = this.optimGame.agent.value_table;
        const temp_value_table = math.zeros(optim_value_table.data.length, optim_value_table[0].length)._data;

        for (let key in this.games) {
            for (let y = 0; y < optim_value_table.data.length; ++y) {
                for (let x = 0; x < optim_value_table[0].length; ++x) {
                    temp_value_table[y][x] = optim_value_table[y][x] - this.games[key].agent.value_table[y][x];
                }
            }

            this.rmses[key].push(math.sqrt(math.mean(math.square(temp_value_table))));
        }
    }

    _plot() {
        const data = [];
        for (let key in this.rmses) {
            data.push({x: [...Array(this.rmses[key].length).keys()], y: this.rmses[key], type: 'line', name: key});
        }
        Plotly.react('chart', data);
    }
}

export class RMSEGame2 extends RMSEGame {
    constructor(frame) {
        super(frame);

        let TD3Div = document.createElement("div");
        let td5Div = document.createElement("div");
        let td10Div = document.createElement("div");

        TD3Div.style.display = "none";
        td5Div.style.display = "none";
        td10Div.style.display = "none";

        frame.appendChild(TD3Div);
        frame.appendChild(td5Div);
        frame.appendChild(td10Div);

        this.games["3-step TD"] = new NstepTDGame(TD3Div);
        this.games["3-step TD"].agent.N = 3;
        this.games["3-step TD"].agent.learning_rate = 0.7;
        this.games["3-step TD"].agent.initial_learning_rate = this.games["3-step TD"].agent.learning_rate;
        this.games["3-step TD"].agent.lr_decay = 0.9996;

        this.games["5-step TD"] = new NstepTDGame(td5Div);
        this.games["5-step TD"].agent.N = 5;
        this.games["5-step TD"].agent.learning_rate = 0.7;
        this.games["5-step TD"].agent.initial_learning_rate = this.games["5-step TD"].agent.learning_rate;
        this.games["5-step TD"].agent.lr_decay = 0.9993;

        this.games["10-step TD"] = new NstepTDGame(td10Div);
        this.games["10-step TD"].agent.N = 10;
        this.games["10-step TD"].agent.learning_rate = 0.7;
        this.games["10-step TD"].agent.initial_learning_rate = this.games["10-step TD"].agent.learning_rate;
        this.games["10-step TD"].agent.lr_decay = 0.9987;

        // set value_table invisible
        for (let key in this.games) {
            this.games[key].agent.value_table.div.style.display = "none";
        }

        this.reset();
    }

    _plot() {
        const data = [];
        for (let key in this.rmses) {
            data.push({x: [...Array(this.rmses[key].length).keys()], y: this.rmses[key], type: 'line', name: key});
        }
        Plotly.react('chart2', data);
    }
}
