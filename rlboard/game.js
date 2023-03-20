import configs from "./config.js";
import { Environment } from "./rlboard.js";
import { RandomAgent, MCAgent, TDAgent, OptimAgent } from "./agents.js";
import {Position, rgb, sleep} from "./utill.js";


const math = window['math'];


export function animate(game) {
    setTimeout(() => {
        requestAnimationFrame(function () {
            animate(game);
        });
    }, 50);

    game.render();
}


export class Game{
    constructor(div, seed) {
        this.environment = new Environment(div, configs[seed]);
        this.max_step_num = 1000;
    }

    render() {
        // draw environment
        this.environment.render();
    }
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
        cell.appendChild(effect);
        setTimeout(() => effect.remove(), timeout);
    }
}


export class RDGame extends Game {
    constructor(div, seed) {
        super(div, seed);

        this.agent = new RandomAgent(this.environment);
    }

    async run_test(max_episode_num, sleep_time=50) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < this.max_step_num; ++step) {
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
                await sleep(sleep_time);
            }
        }
    }
}

export class MCGame extends Game {
    constructor(div, context, seed) {
        super(div, seed);
        this.context = context;

        this.agent = new MCAgent(this.environment);
    }

    async run(max_episode_num, sleep_time=10) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();
            let rewards = [];

            // delay
            await sleep(sleep_time);

            for (step = 1; step < this.max_step_num; ++step) {
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
                    break;
                } 

                //delay
                await sleep(sleep_time);
            }

            this.agent.update();
            console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps",
                ", total reward:", rewards.reduce((a, b) => a + b, 0));
        }
    }

    async run_test(max_episode_num, sleep_time=300) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < 30; ++step) {
                // get action
                action = this.agent.getOptimalAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);

                // render effect
                renderEffect(this.environment._getCell(new Position(next_state[0], next_state[1])));
                
                // state no change
                if (state[0] === next_state[0] && state[1] === next_state[1]) {
                    // console.log("stateSame")
                    break;
                }
                state = [next_state[0], next_state[1]];
                // episode done
                if (done) {
                    break;
                }

                //delay
                await sleep(sleep_time);
            }
        }
    }

    render() {
        super.render();

        if (this.context == null) {
            return;
        }

        // draw value table
        this.context.beginPath();
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.context.width, this.context.height);

        for (let y = 0; y < this.environment.boardShape[0]; ++y) {
            for (let x = 0; x < this.environment.boardShape[1]; ++x) {
                let value = this.agent.value_table[y][x];

                let epsilon = 0.0000000001;
                // expcept 0  and all Values is negative 2 positive
                let maxValue = Math.max(...this.agent.value_table.flat().slice(0,6*6-2)) + epsilon;
                let minValue = Math.min(...this.agent.value_table.flat()) + epsilon;
                // draw tile color
                if (value === 0) {
                    this.context.fillStyle = rgb(255, 255, 255);
                }
                else {
                    let max_r = 24;
                    let min_r = 236;
                    let max_g = 198;
                    let min_g = 250;
                    let max_b = 40;
                    let min_b = 237;
                    let normalize =(value- minValue)/(maxValue - minValue)
                    let r = (normalize)*(max_r-min_r)
                    let g = (normalize)*(max_g-min_g)
                    let b = (normalize)*(max_b-min_b)
                    this.context.fillStyle = rgb(min_r + r, min_g + g, min_b + b);
                    // this.context.fillRect = ()
                }
                // else {
                //     let alpha = Math.abs(value / maxValue) * (1 - 0.6) + 0.6;
                //     this.context.fillStyle = rgba(200, 255, 200, alpha);
                // }

                // draw grid line
                let nodeScale = 1 / this.environment.boardShape[0];
                let tileScale = nodeScale * 0.99;
                this.context.fillRect(
                    x * tileScale * this.context.width + 3,
                    y * tileScale * this.context.height + 3,
                    tileScale * this.context.width - 2,
                    tileScale * this.context.height - 2
                );

                // draw text
                this.context.fillStyle = 'black';
                this.context.font = "12px serif";
                this.context.textAlign = "center";
                this.context.fillText(value.toFixed(2), (x + 1 / 2) * nodeScale * this.context.width, (y + 2 / 3) * nodeScale * this.context.width);
            }
        }
    }
}

export class TDGame extends MCGame {
    constructor(div, context, seed) {
        super(div, context, seed);

        this.agent = new TDAgent(this.environment);
    }

    async run(max_episode_num, sleep_time=10) {
        let step = 0;

        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action ,reward, done;
            let state = this.environment.reset();
            let rewards = [];

            // delay
            await sleep(sleep_time);

            for (step = 1; step < this.max_step_num; ++step) {
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
                    break;
                }

                // delay
                await sleep(sleep_time);
            }

            console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps",
                ", total reward:", rewards.reduce((a, b) => a + b, 0));
        }
    }
}

export class OptimGame extends MCGame {
    constructor(div, context, seed) {
        super(div, context, seed);

        this.agent = new OptimAgent(this.environment);
    }
}

export class BiasGame {
    constructor(mcDiv, tdDiv, optimDiv, seed) {
        this.mcGame = new MCGame(mcDiv, null, seed);
        this.tdGame = new TDGame(tdDiv, null, seed);
        this.optimGame = new OptimGame(optimDiv, null, seed);

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
        }
    }

    async run_test(max_episode_num, sleep_time=300) {
        await this.mcGame.run_test(max_episode_num, sleep_time);
        await this.tdGame.run_test(max_episode_num, sleep_time);
    }

    reset() {
        this.mcGame.environment.reset();
        this.mcGame.agent.reset();
        this.tdGame.environment.reset();
        this.tdGame.agent.reset();

        this.mcRmse = [];
        this.tdRmse = [];

        // plot
        this._plot();
    }

    _calcRmse() {
        const mc_value_table = this.mcGame.agent.value_table;
        const td_value_table = this.tdGame.agent.value_table;
        const optim_value_table = this.optimGame.agent.value_table;
        const temp_value_table = math.zeros(optim_value_table.length, optim_value_table[0].length)._data;

        // mc
        for (let y = 0; y < optim_value_table.length; ++y) {
            for (let x = 0; x < optim_value_table[0].length; ++x) {
                temp_value_table[y][x] = optim_value_table[y][x] - mc_value_table[y][x];
            }
        }
        this.mcRmse.push(math.sqrt(math.mean(math.square(temp_value_table))));

        // td
        for (let y = 0; y < optim_value_table.length; ++y) {
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

    render() {
        this.mcGame.render();
        this.tdGame.render();
    }
}
