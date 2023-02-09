import configs from "./config.js";
import { ControlAgent, RandomAgent, MCAgent, QLearningAgent } from "./agents.js";
import { rgb, rgba } from "./utill.js";

const boardShape = [10, 10];
const nodeScale = 1 / boardShape[0]; //  400/10 40 -> 10


function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

class Node{
    constructor(position, reward, done) {
        this.position = position;
        this.reward = reward;
        this.done = done;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = 'yellow'
        context.fillRect(this.position[0] * nodeScale * context.width, this.position[1] * nodeScale * context.width, nodeScale * context.width, nodeScale * context.width);

        context.fillStyle = 'black';
        context.font = "15px serif";
        context.fillText(this.reward, (this.position[0]) * nodeScale * context.width, (this.position[1] + 2 / 3) * nodeScale * context.width);
    }
}

class player{
    constructor(position, path) {
        this.position = [position[0], position[1]];
        this.imagePath = path;
        this.imageIdx = 0;
    }

    draw(context) {
        let img = new Image();
        img.src = this.imagePath[this.imageIdx % 10];
        img.onload = () => {
            let startX = this.position[0] * nodeScale * context.width;
            let startY = this.position[1] * nodeScale * context.width;
            let width = nodeScale * context.width;
            let height = nodeScale * context.width;
            context.drawImage(img, startX, startY, width, height);
        };
        this.imageIdx = (this.imageIdx + 1) % this.imagePath.length;
    }
}

class Environment{
    constructor(config) {
        this.board = [];
        this.nodes = [];
        this.actions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        this.config = config;
        this._make_board();
    }

    _make_board() {
        // make nodes
        for (let i=0; i<this.config.nodes.length; ++i) {
            let [_position, _reward, _done] = this.config.nodes[i];
            this.nodes.push(new Node(_position, _reward, _done));
        }

        // make board
        for (let y=0; y<boardShape[0]; ++y) {
            this.board.push([]);
            for (let x=0; x<boardShape[0]; ++x) {
                this.board[y].push(null);
            }
        }
        // push node into board
        this.config.nodes.forEach(node => {
            let [_position, _reward, _done] = node;
            this.board[_position[0]][_position[1]] = new Node(_position, _reward, _done);
        });

        // make player
        this.player = new player(this.config.agentStartPosition, this.config.agentImagePath);
    }

    reset() {
        this.player.position[0] = this.config.agentStartPosition[0];
        this.player.position[1] = this.config.agentStartPosition[1];
        return this.player.position;
    }

    step(action) {
        // move agent
        this.player.position[0] += this.actions[action][0]
        this.player.position[1] += this.actions[action][1]
        //out position check
        this.player.position[0] = Math.min(Math.max(0, this.player.position[0]), 9)
        this.player.position[1] = Math.min(Math.max(0, this.player.position[1]), 9)
        let next_state = this.player.position;

        //reward
        let reward;
        let place = this.board[this.player.position[0]][this.player.position[1]];
        if (place) {
            reward = place.reward;
        }
        else{
            reward = 0;
        }

        // check terminal
        let done = false;
        if (place && place.done) {
            done = true;
        }
        
        return [next_state, reward, done]
    }

    draw(context) {
        // draw background
        let img = new Image();
        img.src = this.config.backgroundImagePath;
        img.onload = () => {
            context.drawImage(img, 0, 0, context.width, context.height);

            // draw node
            this.nodes.forEach(node => {
                node.draw(context);
            });
            // draw player
            this.player.draw(context)
        };
    }
}

export class Game{
    constructor(context, seed, policyName) {
        this.context = context;
        this.environment = new Environment(configs[seed]);

        // make agent
        switch (policyName) {
            case "control":
                this.agent = new ControlAgent(this.environment);
                break;
            case "random":
                this.agent = new RandomAgent(this.environment);
                break;
            case "mc":
                this.agent = new MCAgent(this.environment);
                break;
            case "td":
                this.agent = new QLearningAgent(this.environment);
                break;
            default:
                throw "There is no policy named" + policyName;
        }

        this.episode_rewards = [];
        this.current_step = 0;
    }
    
    render() {
        // draw environment
        this.environment.draw(this.context);
    }

    async run(max_episode_num, sleep_time=10) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();
            action = this.agent.getAction(state);

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < 1000; ++step) {
                // get action
                action = this.agent.getAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);

                // save sample
                this.agent.saveSample(next_state, reward, done);

                // episode done
                if (done) {
                    this.agent.update()
                    console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps");
                    break;
                } else {
                    state = [next_state[0], next_state[1]];
                }

                //delay
                await sleep(sleep_time);
            }
        }
    }

    async run_td(max_episode_num, sleep_time=10) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < 1000; ++step) {
                // get action
                action = this.agent.getAction(state.toString());
         
                // step
                [next_state, reward, done] = this.environment.step(action);

                this.agent.learn(state.toString(), action, reward, next_state.toString());

                // episode done
                if (done) {
                    console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps");
                    break;
                }
                else {
                    state = [next_state[0], next_state[1]];
                } 

                // delay
                await sleep(sleep_time);
            }
        }
    }

    async run_test(max_episode_num, sleep_time=300) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset()

            // delay
            await sleep(sleep_time);
            // draw q-value table? 어떤식으로?

            for (let step = 1; step < 1000; ++step) {
                // get action
                action = this.agent.getOptimalAction(state.toString());
         
                // step
                [next_state, reward, done] = this.environment.step(action);

                // episode done
                if (done) {
                    break;
                } else {
                    state = [next_state[0], next_state[1]];
                }

                // delay
                await sleep(sleep_time);
            }
        }
    }
}

export class MCGame extends Game {
    constructor(context_1, context_2, seed, policyName) {
        super(context_1, seed, policyName);
        this.context_2 = context_2;
    }

    render() {
        super.render();

        // draw value table
        this.context_2.beginPath();
        this.context_2.fillStyle = 'black'
        this.context_2.fillRect(0, 0, this.context_2.width, this.context_2.height);

        for (let x = 0; x < boardShape[0]; ++x) {
            for (let y = 0; y < boardShape[1]; ++y) {
                let key = [x, y].toString();
                let value = this.agent.value_table[key] || 0;

                let maxValue = Math.max(...Object.values(this.agent.value_table));
                let minValue = Math.min(...Object.values(this.agent.value_table));

                // 기준치를 정해놓고 점점 올라가게? 아니면 현재 상태에 비교해서? <- max랑 차이가 너무 많이 남 나중에 생각
                // draw tile color
                if (value === 0) {
                    this.context_2.fillStyle = rgb(255, 255, 255);
                }
                else if (value < 0) {
                    let alpha = Math.abs((value/minValue))*(1-0.6) + 0.6
                    this.context_2.fillStyle = rgba(255, 200, 200, alpha);
                }
                else {
                    let alpha = Math.abs(value / maxValue) * (1 - 0.6) + 0.6;
                    this.context_2.fillStyle = rgba(200, 255, 200, alpha);
                }

                // draw grid line
                let tileScale = nodeScale * 0.99;
                this.context_2.fillRect(
                    x * tileScale * this.context_2.width + 3,
                    y * tileScale * this.context_2.height + 3,
                    tileScale * this.context_2.width - 1,
                    tileScale * this.context_2.height - 1
                );

                // draw text
                this.context_2.fillStyle = 'black';
                this.context_2.font = "15px serif";
                this.context_2.fillText(value, (x + 1 / 4) * nodeScale * this.context_2.width, (y + 2 / 3) * nodeScale * this.context_2.width);
            }
        }
    }
}

export function animate(game) {
    setTimeout(() => {
        requestAnimationFrame(function () {
            animate(game);
        });
        }, 50);

    game.render();
}
