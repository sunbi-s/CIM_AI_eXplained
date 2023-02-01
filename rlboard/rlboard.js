class Node{
    constructor(position, edge, reward, done){
        this.position = position;
        this.edge = edge;
        this.reward = reward;
        this.done = done;
    }

    draw(canvas) {
        // draw node
        canvas.fillStyle = 'blue'
        canvas.fillRect(this.position[0] * 30, this.position[1] * 30, 30, 30);

        // draw path
        this.edge.forEach(e => {
            console.log("draw path", e);
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
    constructor(position, policy){
        this.position = position;
    }

    move(y, x) {
        this.position[0] += y;
        this.position[1] += x;
    }

    action(i_action) {
        this.policy.action(i_action);
    }

    draw(canvas) {
        canvas.fillStyle = 'red'
        canvas.fillRect(this.position[0], this.position[1], 30, 30);
    }
}


class Game{
    constructor(seed, policy){
        this.agent = new Agent([0, 0], policy);
        this.episode_rewards = [];
        this.step = 0;

        this._config_make(seed);
    }

    _config_make(seed){
        // configs = ? //json으로 부르기
        // config = configs[seed];
        let config = {
            'nodes': [
                [[2, 2], [[2, 0.1]], 0, false],
                [[4, 4], [[3, 0.3]], 0, false],
                [[4, 2], [[4, 0.4]], 0, false],
                [[2, 4], [[5, 0.7]], 0, false],
                [[6, 4], [[6, 0.2]], 0, false],
                [[6, 2], [[7, 0.1]], 0, false]
            ],
        };
        this.environment = new Environment(config);
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
    
    draw(canvas) {
        // fill background black for debugging
        canvas.beginPath();
        canvas.fillStyle = 'black'
        canvas.fillRect(0, 0, canvas.width, canvas.height);

        this.environment.draw(canvas);
        this.agent.draw(canvas);
    }

    update(canvas) {
        this.draw(canvas);
    }
}


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.width = canvas.width;
c.height = canvas.height;

let game = new Game(0, null)
game.update(c)
