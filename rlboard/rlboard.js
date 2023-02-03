import { RandomAgent } from "./Agents.js";
import configs from "./config.js";

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

class player{
    constructor(position) {
        this.position = position;
    }

    draw(context) {
        context.fillStyle = 'red'
        context.beginPath();
        context.arc((this.position[0] + 1 / 2) * nodeSize, (this.position[1] + 1 / 2) * nodeSize, agentSize, 0, 2 * Math.PI)
        context.fill();
    }
}

class Environment{
    constructor(config){
        this.board = []
        this.nodes = []
        this.config = config
        this.player = new player(config.agentStartPosition)
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

    reset() {
        this.player.position[0] = this.config.agentStartPosition[0]
        this.player.position[1] = this.config.agentStartPosition[1]
        return this.player.position;
    }

    step(action) {

        // move agent
        this.player.position[0] += actions[action][0]
        this.player.position[1] += actions[action][1]
   
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
        // draw node
        this.nodes.forEach(node => {
            node.draw(context);
        });
        this.player.draw(context)
    }
}

class Game{
    constructor(context, seed) {
        this.context = context;
        this.environment = new Environment(configs[seed]);
        this.episode_rewards = [];
        this.current_step = 0;
    }
    
    render() {
        // fill background black for debugging
        this.context.beginPath();
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.context.width, this.context.height);

        // draw
        this.environment.draw(this.context);
    }

    async run(max_episode_num, agent) {
        function sleep(msec) {
            return new Promise(resolve => setTimeout(resolve, msec));
        }

        //Random
        let state = game.environment.reset();
        let action, reward, done;
        //render
        game.render()

        for (let step = 1; step < max_episode_num; ++step) {
            //step
            action = agent.get_action(state);
            [state, reward, done] = game.environment.step(action)
            // game.agent.save_sample(next_state, reward, done)
            console.log("action", actions[action], "state", state, "reward", reward, "done", done);

            //episode done
            if (done) {
                // game.agent.update()
                // game.agent.samples.clear()
                console.log("done in", step, "steps");
                game.render()
                break;
            }

            //render
            game.render()

            //delay
            await sleep(100);
        }
    }
}


let game = new Game(c, 0)
let agent = new RandomAgent(actions);
game.run(1000, agent);






// 나중에 while true변경

