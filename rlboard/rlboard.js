class Node{
    constructor(edge, reward, done){
        this.edge = edge;
        this.reward = reward;
        this.done = done;
    }

    draw (){
        // 길 및 환경 그림
    }
}


class Environment{
    constructor(config, agent){
        this.agent = agent;
        this._make_board(config);
    }

    _make_board(config) {
        this.nodes = []
        for (var i=0; i<config.count; ++i) {
            _edge, _reward, _done = config.nodes[i];
            _node = Node(_edge, _reward, _done);
            this.nodes.push(_node);
        }
    }

    draw() {
        this.nodes.forEach(node => {
            node.draw();
        });
    }
}


class Agent{
    constructor(postion, policy){
        this.postion = postion;
    }

    move(y, x) {
        this.postion[0] += y;
        this.postion[1] += x;
    }

    action(i_action) {
        this.policy.action(i_action);
    }

    draw(){

    }
}


class Game{
    constructor(seed, policy){
        this.agent = Agent((0,0), policy);
        this.episode_rewards = [];
        this.step = 0;

        this._config_make(seed);
    }

    _config_make(seed){
        configs = ? //json으로 부르기
        config = configs[seed];
        this.environment = Environment(config);
        this.values = [];
        for (var i=0; i<this.environment.nodes.count; ++i) {
            this.values.push(0);
        }
    }

    add_reward(reward) {
        this.episode_rewards.push(reward);
    }

    move_agent(y, x) {
        this.agent.move(y, x);
    }
    
    draw() {
        this.environment.draw();
        this.agent.draw();
    }

    update() {
        this.draw();
    }
}

    