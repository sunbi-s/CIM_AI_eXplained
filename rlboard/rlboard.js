import { RandomAgent, MCAgent } from "./Agents.js";
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
        context.fillStyle = 'yellow'
        context.fillRect(this.position[0] * nodeSize, this.position[1] * nodeSize, nodeSize, nodeSize);

        context.fillStyle = 'black';
        context.font = "15px serif";
        context.fillText(this.reward, (this.position[0] + 1 / 4) * nodeSize, (this.position[1] + 2 / 3) * nodeSize);
    }
}

class player{
    constructor(position) {
        this.position = [position[0], position[1]];
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
        this.player.position[0] = this.config.agentStartPosition[0];
        this.player.position[1] = this.config.agentStartPosition[1];
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
        // draw player
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
        
        console.log(agent.name)
        
        function sleep(msec) {
            return new Promise(resolve => setTimeout(resolve, msec));
        }

        switch(agent.name) {
            case "RandomAgent":

        
                for (let episode = 1; episode < max_episode_num; ++episode) {
                    //Random
                    let state = this.environment.reset();
                    let action, reward, done;
                    //render
                    this.render()
        
                    for (let step = 1; step < 1000; ++step) {
                        //step
                        action = agent.get_action(state);
                        [state, reward, done] = this.environment.step(action);
                        console.log("action", actions[action], "state", state, "reward", reward, "done", done);
        
                        //episode done
                        if (done) {
                            console.log("[episode", episode, "] done in", step, "steps");
                            this.render()
                            break;
                        }
        
                        //render
                        this.render()
        
                        //delay
                        await sleep(100);
                    }
                }
            
            case "MCAgent":
        
                for (let episode = 1; episode < max_episode_num; ++episode) {
                    
                    let next_state, action, reward, done;
                    
                    let state = this.environment.reset();
                    action = agent.get_action(state);
                 
                    //render
                    this.render()
                    
                    //step
                    for (let step = 1; step < 1000; ++step) {
            
                        // console.log(action) ???? 여기에 콘솔 찍으면 step 에서 오류남
                        [next_state, reward, done] = this.environment.step(action);
                        
                        //save sample
                        agent.save_sample(next_state, reward, done)
                        
                        console.log("action", actions[action],"next_state",next_state, "reward", reward,"step", step, "done", done);
                        
                        // get action
                        action = agent.get_action(next_state)

                        //episode done
                        if (done) {
                            agent.update()
                            agent.samples_clear()
                            console.log("[episode", episode, "] done in", step, "steps");
                            this.render()
                            break;
                        }
        
                        //render
                        this.render()
        
                        //delay
                        await sleep(100);
                    }
                }

        }

   
    }
}

let game = new Game(c, 0)
// let agent = new RandomAgent(actions);
let agent = new MCAgent(actions);
game.run(1000, agent);





// 나중에 while true변경
