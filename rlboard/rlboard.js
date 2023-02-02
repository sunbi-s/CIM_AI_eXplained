const nodeSize = 30;
const edgeSize = 15;
const agentSize = 10;

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

        // draw path
        this.edge.forEach(e => {
            console.log("draw path", e);
            context.fillStyle = 'green'

            let is_horizontal = 0;
            if (is_horizontal) {
                context.fillRect((this.position[0] - 1) * nodeSize, this.position[1] * nodeSize + (nodeSize - edgeSize) / 2, nodeSize, edgeSize);
            }
            else {
                context.fillRect(this.position[0] * nodeSize + (nodeSize - edgeSize) / 2, (this.position[1] - 1) * nodeSize, edgeSize, nodeSize);
            }
        });
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

    draw(canvas) {
        this.nodes.forEach(node => {
            node.draw(canvas);
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
        // configs = ? //json으로 부르기
        // config = configs[seed];
        let config = {
            'nodes': [
                [[0, 0], [[0, 0.1]], 0, false],
                [[2, 2], [[2, 0.1]], 0, false],
                [[4, 4], [[3, 0.3]], 0, false],
                [[4, 2], [[4, 0.4]], 0, false],
                [[2, 4], [[5, 0.7]], 0, false],
                [[6, 4], [[6, 0.2]], 0, false],
                [[6, 2], [[7, 0.1]], 0, false]
            ],
        };
        this.environment = new Environment(config);
        this.agent = new Agent(this.environment.nodes[Math.floor(Math.random() * this.environment.nodes.length)], policy);
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


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.width = canvas.width;
c.height = canvas.height;

let game = new Game(0, null)
game.update(c)
