import config from "./config.js";

const canvas = document.querySelector('#canvas_1');
const c = canvas.getContext('2d');
c.width = canvas.width;
c.height = canvas.height;

const boardShape = [5, 5];
const nodeSize = c.width / (boardShape[0] * 2);
const edgeSize = nodeSize / 2;
const agentSize = nodeSize * 1 / 3;


class Node{
    constructor(position, edge, reward, done) {
        this.position = position;
        this.edge = edge;
        this.reward = reward;
        this.done = done;
    }

    draw(context) {
        // draw node
        context.fillStyle = 'blue'
        context.fillRect(this.position[0] * nodeSize, this.position[1] * nodeSize, nodeSize, nodeSize);
    }
}


class Environment{
    constructor(config){
        this.nodes = []
        this._make_board(config);
    }

    _make_board(config) {
        for (let i=0; i<config.nodes.length; ++i) {
            let _position, _edge, _reward, _done;
            [_position, _edge, _reward, _done] = config.nodes[i];
            this.nodes.push(new Node(_position, _edge, _reward, _done));
        }
    }

    draw(context) {
        this.nodes.forEach(node => {
            node.draw(context);
            
            // draw path
            node.edge.forEach(e => {
                
                
                let targetNodeIdx = e[0];
                let targetNode = this.nodes[targetNodeIdx];
                
                console.log(targetNode.position[0], node.position[0]);
                
                let is_horizontal = 0;
                if (targetNode.position[0] > node.position[0]) {
                    is_horizontal = 1;
                }
                
                context.fillStyle = 'green'
                if (is_horizontal) {
                    context.fillRect((node.position[0] - 1) * nodeSize, node.position[1] * nodeSize + (nodeSize - edgeSize) / 2, nodeSize, edgeSize);
                }
                else {
                    context.fillRect(node.position[0] * nodeSize + (nodeSize - edgeSize) / 2, (node.position[1] - 1) * nodeSize, edgeSize, nodeSize);
                }
            });
        });
    }
}


class Agent{
    constructor(currentNode, policy) {
        this.currentNode = currentNode;
        this.policy = policy;
    }

    action(i_action) {
        this.policy.action(i_action);
    }

    draw(context) {
        context.fillStyle = 'red'
        context.arc((this.currentNode.position[0] + 1 / 2) * nodeSize, (this.currentNode.position[1] + 1 / 2) * nodeSize, agentSize, 0, 2 * Math.PI)
        context.fill();
    }
}


class Game{
    constructor(seed, policy) {
        this.episode_rewards = [];
        this.step = 0;

        this._config_make(seed, policy);
    }

    _config_make(seed, policy) {
        this.environment = new Environment(config[seed]);
        this.agent = new Agent(this.environment.nodes[config[seed].agentStartIdx], policy);
        this.values = [];
        for (let i=0; i<this.environment.nodes.length; ++i) {
            this.values.push(0);
        }
    }

    add_reward(reward) {
        this.episode_rewards.push(reward);
    }

    move_agent(y, x) {
        this.agent.move(y, x);
    }
    
    draw(context) {
        // fill background black for debugging
        context.beginPath();
        context.fillStyle = 'black'
        context.fillRect(0, 0, context.width, context.height);

        this.environment.draw(context);
        this.agent.draw(context);
    }

    update(context) {
        this.draw(context);
    }
}


let game = new Game(0, null)
game.update(c)
