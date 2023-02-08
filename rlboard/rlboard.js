import configs from "./config.js";
import { ControlAgent, RandomAgent, MCAgent, QLearningAgent } from "./agents.js";

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
    }

    draw(context) {
        let img = new Image();
        img.src = this.imagePath;
        img.onload = () => {
            let startX = this.position[0] * nodeScale * context.width;
            let startY = this.position[1] * nodeScale * context.width;
            let width = nodeScale * context.width;
            let height = nodeScale * context.width;
            context.drawImage(img, startX, startY, width, height);
        };
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
    constructor(context_1, context_2, seed, policyName) {
        this.context = context_1;
        this.context_2 = context_2;
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
        this.render();
    }
    
    render() {

        // draw value table
        if (this.agent.value_table) {
            this.context_2.beginPath();
            this.context_2.fillStyle = 'black'
            this.context_2.fillRect(0, 0, this.context_2.width, this.context_2.height);

            this.context_2.fillStyle = 'black';
            for (let x = 0; x < boardShape[0]; ++x) {
                for (let y = 0; y < boardShape[1]; ++y) {
                    let key = [x, y].toString();
                    let value = this.agent.value_table[key] || 0;

                    this.context_2.beginPath();
                    this.context_2.fillStyle = 'white'
                    this.context_2.fillRect(x * nodeScale * this.context_2.width + 1, y * nodeScale * this.context_2.width + 1, nodeScale * this.context_2.width - 2, nodeScale * this.context_2.width - 2);

                    this.context_2.fillStyle = 'black';
                    this.context_2.font = "15px serif";
                    this.context_2.fillText(value, (x + 1 / 4) * nodeScale * this.context_2.width, (y + 2 / 3) * nodeScale * this.context_2.width);
                }
            }
        }

        // draw environment
        this.environment.draw(this.context);
    }

    async run(max_episode_num) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();
            action = this.agent.getAction(state);

            //render
            this.render();

            //step
            for (let step = 1; step < 1000; ++step) {
                // render
                this.render();

                // get action
                action = this.agent.getAction(state);

                // step
                [next_state, reward, done] = this.environment.step(action);

                // save sample
                this.agent.saveSample(next_state, reward, done)


                //render
                this.render()

                // episode done
                if (done) {
                    this.agent.update()
                    console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps");
                    this.render()
                    break;
                } else {
                    state = [next_state[0],next_state[1]];
                }

                //delay
                await sleep(10);
            }
        }
    }

    async run_td(max_episode_num) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset();

            //render
            this.render();
            await sleep(300);

            //step
            for (let step = 1; step < 1000; ++step) {
                // get action
                action = this.agent.getAction(state.toString());
         
                // step
                [next_state, reward, done] = this.environment.step(action);

                this.agent.learn(state.toString(), action, reward, next_state.toString());

                //render
                this.render()

                // episode done
                if (done) {
                    console.log(this.agent.constructor.name, ": [episode", episode, "] done in", step, "steps");
                    this.render()
                    break;
                }
                else {
                    state = [next_state[0],next_state[1]];
                } 

                //delay
                await sleep(10);
            }
        }

    
    
    }

    async run_test(max_episode_num) {
        for (let episode = 1; episode <= max_episode_num; ++episode) {
            let next_state, action, reward, done;
            let state = this.environment.reset()
            
            //render
            this.render()
            await sleep(300);
            // draw q-value table? 어떤식으로?

            //step
            for (let step = 1; step < 1000; ++step) {

                // get action
                action = this.agent.getOptimalAction(state.toString());
         
                //step
                [next_state, reward, done] = this.environment.step(action);


                // 다시 대입
                state = [next_state[0],next_state[1]];
                
                //render
                this.render()

                //episode done
                if (done) {
                    break;
                }

                //delay
                await sleep(300);
            }
        }

    
    
    }

}
