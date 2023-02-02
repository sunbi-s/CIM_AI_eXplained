export class RandomAgent{
    constructor(actions){
        this.actions = actions
        this.n_action = actions.length
    }

    get_action(state){
        return Math.floor(Math.random( )*this.n_action)
    }

}

export class MCAgent{
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
