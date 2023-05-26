import configs from "./config.js";
import { Environment } from "./rlboard.js";
import { RandomAgent, MCAgent, TDAgent, OptimAgent } from "./agents.js";
import { Position, rgba, sleep } from "./utill.js";


const math = window['math'];


export function animate(game) {
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
            effect.style.height = "200px";
            effect.style.width = "400px";
            effect.style.marginTop = "-205px";
            effect.style.marginLeft = "-330px";
        } else {
            effect.src = "img/rlboard/effect/Explosion.png";
        }
        cell.insertBefore(effect, cell.lastChild);
        setTimeout(() => effect.remove(), timeout);
    }
}

function renderHighlight(cell, timeout=500) {
    let effect = document.createElement("img");
    effect.classList.add("effect");
    effect.src = "img/rlboard/effect/water.png";
    cell.parentNode.appendChild(effect);

    // set effect element position to cell
    effect.style.position = "absolute";
    effect.style.top = cell.offsetTop + "px";
    effect.style.left = cell.offsetLeft + cell.offsetWidth / 2 + "px";

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

    async run_test(max_episode_num, sleep_time=50) {
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
            // console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps",
            //     ", total reward:", rewards.reduce((a, b) => a + b, 0));
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

            // console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps",
            //     ", total reward:", rewards.reduce((a, b) => a + b, 0));
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
        this.mcGame = new MCGame(mcDiv);
        this.tdGame = new TDGame(tdDiv);

        this.interrupt = false;
    }

    Interrupt() {
        this.interrupt = true;
        this.mcGame.interrupt = true;
        this.tdGame.interrupt = true;
    }

    async run_old(max_episode_num, sleep_time=10, episodeTextDom) {
        this.mcGame.interrupt = false;
        this.tdGame.interrupt = false;

        for (let episode = 1; episode <= max_episode_num; ++episode)
        {
            let done1 = false, done2 = false;
            this.mcGame.run(1, sleep_time).then(() => done1 = true);
            this.tdGame.run(1, sleep_time).then(() => done2 = true);

            // sync each game
            while (!(done1 && done2)) { await sleep(); }

            if (episodeTextDom !== null && !this.interrupt) {
                episodeTextDom.innerText = parseInt(episodeTextDom.innerText) + 1;
            }

            if (this.interrupt) {
                this.interrupt = false;
                return;
            }
        }
    }

    async run(max_episode_num, sleep_time=10, episodeTextDom=null) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let mc_next_state, mc_action, mc_reward, mc_done;
            let td_next_state, td_action, td_reward, td_done;
            let mc_state = this.mcGame.environment.reset();
            let td_state = this.tdGame.environment.reset();
            let mc_rewards = [];
            let td_rewards = [];
            let action;

            // delay
            await sleep(sleep_time);


            for (step = 1; step < this.mcGame.max_step_num; ++step) {
                // interrupt
                if (this.interrupt) {
                    this.interrupt = false;
                    this.mcGame.interrupt = false;
                    this.tdGame.interrupt = false;
                    return;
                }

                // get action
                action = this.mcGame.agent.getRndAction(mc_state);

                // step
                [mc_next_state, mc_reward, mc_done] = this.mcGame.environment.step(action);
                mc_rewards.push(mc_reward);

                [td_next_state, td_reward, td_done] = this.tdGame.environment.step(action);
                td_rewards.push(td_reward);

                if (mc_next_state[0]!=td_next_state[0] || mc_next_state[0]!=td_next_state[0]){
                    console.log("Error: state mismatch!")
                }
                if (mc_reward!=td_reward){
                    console.log("Error: reward mismatch!")
                }
                if (mc_done!=td_done){
                    console.log("Error: done mismatch!")
                }

                // render effect
                renderEffect(this.mcGame.environment._getCell(new Position(mc_next_state[0], mc_next_state[1])), 100);
                renderEffect(this.mcGame.environment._getCell(new Position(td_next_state[0], td_next_state[1])), 100);

                // update algorithms
                this.tdGame.agent.learn(td_state, td_reward, td_next_state);
                this.mcGame.agent.saveSample(mc_state, mc_reward, mc_done);

                // state
                mc_state = [mc_next_state[0], mc_next_state[1]];
                td_state = [td_next_state[0], td_next_state[1]];

                // episode done
                if (mc_done) {
                    if (episodeTextDom !== null) {
                        episodeTextDom.innerText = parseInt(episodeTextDom.innerText) + 1;
                    }
                    break;
                }

                // delay
                await sleep(sleep_time);
            }

            this.mcGame.agent.update();
        }
    }

    async run_test(max_episode_num, sleep_time=300) {
        let done1 = false, done2 = false;
        this.mcGame.run_test(max_episode_num, sleep_time).then(() => done1 = true);
        this.tdGame.run_test(max_episode_num, sleep_time).then(() => done2 = true);

        // sync each game
        while (!(done1 && done2)) { await sleep(); }

        this.interrupt = false;
    }

    reset() {
        this.mcGame.environment.reset();
        this.mcGame.agent.reset();
        this.tdGame.environment.reset();
        this.tdGame.agent.reset();
    }

    render() {
        this.mcGame.render();
        this.tdGame.render();
    }
}

export class BiasGame extends CompareGame {
    constructor(mcDiv, tdDiv, optimDiv) {
        super(mcDiv, tdDiv);
        this.optimGame = new OptimGameAVG(optimDiv);

        this.mcRmse = [];
        this.tdRmse = [];

        Plotly.newPlot('chart', [
            { x: [], y: [], type:'line', name: 'MC' },
            { x: [], y: [], type:'line', name: 'TD' },
        ]);
    }

    async run(max_episode_num, sleep_time=10) {
        for (let i = 0; i< max_episode_num; ++i)
        {
            let done1 = false, done2 = false;
            this.mcGame.run(1, sleep_time).then(() => {done1 = true});
            this.tdGame.run(1, sleep_time).then(() => {done2 = true});

            // sync each game
            while (!(done1 && done2)) { await sleep(); }

            // calculate rmse
            this._calcRmse();

            // plot
            this._plot();

            if (this.interrupt) {
                this.interrupt = false;
                return;
            }
        }
    }

    reset() {
        super.reset();

        this.mcRmse = [];
        this.tdRmse = [];

        // plot
        this._plot();
    }

    _calcRmse() {
        const mc_value_table = this.mcGame.agent.value_table;
        const td_value_table = this.tdGame.agent.value_table;
        const optim_value_table = this.optimGame.agent.value_table;
        const temp_value_table = math.zeros(optim_value_table.data.length, optim_value_table[0].length)._data;

        // mc
        for (let y = 0; y < optim_value_table.data.length; ++y) {
            for (let x = 0; x < optim_value_table[0].length; ++x) {
                temp_value_table[y][x] = optim_value_table[y][x] - mc_value_table[y][x];
            }
        }
        this.mcRmse.push(math.sqrt(math.mean(math.square(temp_value_table))));

        // td
        for (let y = 0; y < optim_value_table.data.length; ++y) {
            for (let x = 0; x < optim_value_table[0].length; ++x) {
                temp_value_table[y][x] = optim_value_table[y][x] - td_value_table[y][x];
            }
        }
        this.tdRmse.push(math.sqrt(math.mean(math.square(temp_value_table))));
    }

    _plot() {
        Plotly.react('chart', [
            { x: [...Array(this.mcRmse.length).keys()], y: this.mcRmse, type:'line', name: 'MC' },
            { x: [...Array(this.mcRmse.length).keys()], y: this.tdRmse, type:'line', name: 'TD' },
        ]);
    }
}