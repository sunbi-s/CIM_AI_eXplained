import config from "./config.js";

const canvas = document.querySelector('#canvas_1');
const c = canvas.getContext('2d');
c.width = canvas.width;
c.height = canvas.height;

const boardShape = [10, 10];
const nodeSize = c.width / boardShape[0];
const agentSize = nodeSize / 3;

const actions = [[0, 1], [1, 0], [0, -1], [-1, 0]]


class Node{
    constructor(position, reward, done) {
        this.position = position;
        this.reward = reward;
        this.done = done;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = 'blue'
        if (this.done) {
            context.fillStyle = 'yellow';
        }
        context.fillRect(this.position[0] * nodeSize, this.position[1] * nodeSize, nodeSize, nodeSize);
    }
}


class Environment{
    constructor(config){
        this.board = []
        this.nodes = []
        this._make_board(config);
    }

    _make_board(config) {
        for (let i=0; i<config.nodes.length; ++i) {
            let [_position, _reward, _done] = config.nodes[i];
            this.nodes.push(new Node(_position, _reward, _done));
        }

        for (let y=0; y<boardShape[0]; ++y) {
            this.board.push([]);
            for (let x=0; x<boardShape[0]; ++x) {
                this.board[y].push(null);
            }
        }
        config.nodes.forEach(node => {
            let [_position, _reward, _done] = node;
            this.board[_position[0]][_position[1]] = new Node(_position, _reward, _done);
        });
    }

    draw(context) {
        // draw node
        this.nodes.forEach(node => {
            node.draw(context);
        });
    }
}


class Agent{
    constructor(position, policy) {
        this.position = position;
        this.policy = policy;
    }

    draw(context) {
        context.fillStyle = 'red'
        context.beginPath();
        context.arc((this.position[0] + 1 / 2) * nodeSize, (this.position[1] + 1 / 2) * nodeSize, agentSize, 0, 2 * Math.PI)
        context.fill();
    }
}


class Game{
    constructor(context, seed, policy) {
        this.context = context;
        this.episode_rewards = [];
        this.current_step = 0;

        this._config_make(seed, policy);
    }

    _config_make(seed, policy) {
        this.environment = new Environment(config[seed]);
        this.agent = new Agent(config[seed].agentStartPosition, policy);
        this.values = [];
        for (let i=0; i<this.environment.nodes.length; ++i) {
            this.values.push(0);
        }
    }

    calculate_reward() {
        let place = this.environment.board[this.agent.position[0]][this.agent.position[1]];
        if (place) {
            this.episode_rewards.push(place.reward);
        }
        else{
            this.episode_rewards.push(0);
        }
    }

    step(discrete_action) {
        let reward = 0;
        let done = false;

        // move agent
        this.agent.position[0] += actions[discrete_action][0]
        this.agent.position[1] += actions[discrete_action][1]
        this.agent.position[0] = Math.min(Math.max(0, this.agent.position[0]), 9)
        this.agent.position[1] = Math.min(Math.max(0, this.agent.position[1]), 9)
        let state = this.agent.position;

        // accumulate earned reward
        this.calculate_reward();

        // increase step count
        this.current_step += 1;

        // render
        this.render();

        // check terminal
        let place = this.environment.board[this.agent.position[0]][this.agent.position[1]];
        if (place && place.done) {
            done = true;
        }

        return [state, reward, done]
    }
    
    render() {
        // fill background black for debugging
        this.context.beginPath();
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.context.width, this.context.height);

        // draw
        this.environment.draw(this.context);
        this.agent.draw(this.context);
    }
}


let game = new Game(c, 0, null)

for (let i=0; i<1000; ++i) {
    let action = Math.floor(Math.random() * actions.length);
    setTimeout(() => {
        let [state, reward, done] = game.step(action);
        console.log("step", game.current_step, "state", state, "reward", reward, "done", done);
    }, 100 * i);
}
