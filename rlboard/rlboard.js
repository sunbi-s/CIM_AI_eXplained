import configs from "./config.js";
import { ControlAgent, RandomAgent, MCAgent, QLearningAgent, TDAgent } from "./agents.js";
import { rgb, rgba } from "./utill.js";

const boardShape = [10, 10];
const nodeScale = 1 / boardShape[0]; //  400/10 40 -> 10


function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}


export class Position {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    set(position) {
        this.y = position.y;
        this.x = position.x;
    }

    get() {
        return [this.y, this.x];
    }
}

class Node{
    constructor(position, reward, done, path, div) {
        this.position = new Position(position.y, position.x);
        this.imagePath = path;
        this.reward = reward;
        this.done = done;
        this.div = div;

        // create dom element
        this.dom = document.createElement('img');
        this.dom.className = 'place';
        this.move(this.position);
    }

    move(position) {
        //out position check
        position.y = Math.min(Math.max(0, position.y), boardShape[0] - 1);
        position.x = Math.min(Math.max(0, position.x), boardShape[1] - 1);

        this.position.set(position);

        let row = this.div.childNodes[this.position.y];
        let cell = row.childNodes[this.position.x];
        cell.insertBefore(this.dom, cell.firstChild);
    }

    render() {
        this.dom.src = this.imagePath;
    }
}

class Player{
    constructor(position, path, div) {
        this.position = new Position(position.y, position.x);
        this.imagePath = path;
        this.imageIdx = 0;
        this.div = div;

        // create dom element
        this.dom = document.createElement('img');
        this.dom.className = 'player';
        this.move(this.position);
    }

    move(position) {
        //out position check
        position.y = Math.min(Math.max(0, position.y), boardShape[0] - 1);
        position.x = Math.min(Math.max(0, position.x), boardShape[1] - 1);

        this.position.set(position);

        let row = this.div.childNodes[this.position.y];
        let cell = row.childNodes[this.position.x];
        cell.insertBefore(this.dom, cell.firstChild);
    }

    render() {
        this.dom.src = this.imagePath[this.imageIdx % 10];
        this.imageIdx = (this.imageIdx + 1) % this.imagePath.length;
    }
}

class Environment{
    constructor(div, config) {
        this.board = [];
        this.nodes = [];
        this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.div = div;
        this.config = config;
        this._make_board();
    }

    _make_board() {
        // make board
        for (let y=0; y<boardShape[0]; ++y) {
            this.board.push([]);

            let row = document.createElement('div');
            row.className = 'row';
            this.div.appendChild(row);
            for (let x=0; x<boardShape[0]; ++x) {
                this.board[y].push(null);
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.backgroundImage = "url('../img/rlboard/background/background_" + (y * boardShape[0] + x + 1).toString() + ".jpg')";
                row.appendChild(cell);
            }
        }

        // make nodes
        for (let i=0; i<this.config.nodes.length; ++i) {
            let [_position, _reward, _done, _path] = this.config.nodes[i];
            let node = new Node(new Position(_position[0], _position[1]), _reward, _done, _path, this.div);
            this.nodes.push(node);
            this.board[_position[0]][_position[1]] = node;
        }

        // make player
        let position = new Position(this.config.agentStartPosition[0], this.config.agentStartPosition[1]);
        this.player = new Player(position, this.config.agentImagePath, this.div);
    }

    reset() {
        let position = new Position(this.config.agentStartPosition[0], this.config.agentStartPosition[1]);
        this.player.move(position);
        return this.player.position.get();
    }

    step(action) {
        // move agent
        let tempPosition = new Position(this.player.position.y, this.player.position.x);
        tempPosition.y += this.actions[action][0]
        tempPosition.x += this.actions[action][1]
        this.player.move(tempPosition);
        let next_state = this.player.position.get();

        //reward
        let reward;
        let place = this.board[this.player.position.y][this.player.position.x];
        if (place) {
            reward = place.reward;
            console.log("reward", reward);
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

    move_node(currentPos, targetPos) {
        let node = this.board[currentPos.y][currentPos.x];
        node.move(targetPos);

        // apply to board
        console.log('sdf')
        this.board[targetPos.y][targetPos.x] = node;
        this.board[currentPos.y][currentPos.x] = null;
    }

    render() {
        // render node
        this.nodes.forEach(node => {
            node.render();
        });

        // render player
        this.player.render();
    }
}

export class Game{
    constructor(div, seed, policyName) {
        this.environment = new Environment(div, configs[seed]);

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
                this.agent = new TDAgent(this.environment)
                // this.agent = new QLearningAgent(this.environment);
                break;
            default:
                throw "There is no policy named" + policyName;
        }

        this.max_step_num = 20;
        this.episode_rewards = [];
        this.current_step = 0;
    }

    render() {
        // draw environment
        this.environment.render();
    }

    async run(max_episode_num, sleep_time=10) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();
            action = this.agent.getAction(state);

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < this.max_step_num; ++step) {
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
            let next_state, action ,reward, done;
            let pre_reward = 0 // check
            let state = this.environment.reset();

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < this.max_step_num; ++step) {
                // get action
                action = this.agent.getAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);

                this.agent.learn(state, pre_reward, reward, next_state, done);
                pre_reward = reward
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
            let state = this.environment.reset();
            action = this.agent.getAction(state);

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < this.max_step_num; ++step) {
                // get action
                action = this.agent.getOptimalAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);
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

    async run_qtd(max_episode_num, sleep_time=10) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            // delay
            await sleep(sleep_time);

            for (let step = 1; step < this.max_step_num; ++step) {
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
}

export class MCGame extends Game {
    constructor(div, context, seed, policyName) {
        super(div, seed, policyName);
        this.context = context;
    }

    render() {
        super.render();

        // draw value table
        this.context.beginPath();
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.context.width, this.context.height);

        for (let y = 0; y < boardShape[0]; ++y) {
            for (let x = 0; x < boardShape[1]; ++x) {
                let key = [y, x].toString();
                let value = this.agent.value_table[key] || 0;

                let epsilon = 0.0000000001
                let maxValue = Math.max(...Object.values(this.agent.value_table))+epsilon ;
                let minValue = Math.min(...Object.values(this.agent.value_table))+epsilon;

                // 기준치를 정해놓고 점점 올라가게? 아니면 현재 상태에 비교해서? <- max랑 차이가 너무 많이 남 나중에 생각
                // draw tile color
                if (value === 0) {
                    this.context.fillStyle = rgb(255, 255, 255);
                }
                else if (value < 0) {
                    let alpha = Math.abs((value/minValue))*(1-0.6) + 0.6
                    this.context.fillStyle = rgba(255, 200, 200, alpha);
                }
                else {
                    let alpha = Math.abs(value / maxValue) * (1 - 0.6) + 0.6;
                    this.context.fillStyle = rgba(200, 255, 200, alpha);
                }

                // draw grid line
                let tileScale = nodeScale * 0.99;
                this.context.fillRect(
                    x * tileScale * this.context.width + 3,
                    y * tileScale * this.context.height + 3,
                    tileScale * this.context.width - 1,
                    tileScale * this.context.height - 1
                );

                // draw text
                this.context.fillStyle = 'black';
                this.context.font = "15px serif";
                this.context.fillText(value, (x + 1 / 4) * nodeScale * this.context.width, (y + 2 / 3) * nodeScale * this.context.width);
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
