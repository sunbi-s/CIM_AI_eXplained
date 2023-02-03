export class RandomAgent{
    constructor(actions){
        this.name = "RandomAgent"
        this.actions = actions
        this.n_action = actions.length
    }

    get_action(state){
        return Math.floor(Math.random( )*this.n_action)
    }

}

export class MCAgent{
    constructor(actions) {
        this.name = "MCAgent"
        this.width = 10
        this.height = 10
        this.actions = actions
        this.learning_rate = 0.01
        this.discount_factor = 0.9
        this.epsilon = 0.1
        this.samples = []
        this.value_table = {}

    }
    // Add a sample to memory
    save_sample(state, reward, done){
        console.log(state)
        this.samples.push([state, reward, done])
        console.log(this.samples, this.samples.length)
    }

    // Update the Q-value of all states visited by the agent in all episodes
    update(){
        let G_t = 0;
        let visit_state = [];
        let reverse_samples = [...this.samples].reverse() // 원본도 유지
        
        console.log(this.samples)
        // this.samples.forEach(function(sample){
        //     // let state = sample[0].toString();
        //     console.log(sample[0])
        //     // if (!visit_state.includes(state)) {
        //     //     visit_state.push(state);
        //     //     G_t = sample[1] + this.discount_factor * G_t;
        //     //     let value = this.value_table[state] || 0 ; //default value
        //     //     this.value_table[state] = (value + this.learning_rate * (G_t - value));
        //     // }
        // })
    }

    samples_clear(){
        this.samples = []
    }
    
    // Return an action based on Q-value
    // Return an action based on epsilon-greedy policy
    get_action(state) {
        if (Math.random() < this.epsilon) {
            // Random action
            let action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on Q-value
            let next_state = this.possible_next_state(state);
            let action = this.arg_max(next_state);
            return action;
        }
    }
    // Calculate arg_max if there are multiple candidates and return one randomly
    arg_max(next_state) {
        let max_index_list = [];
        let max_value = next_state[0];
        for (let i = 0; i < next_state.length; i++) {
            let value = next_state[i];
            if (value > max_value) {
                max_index_list.length = 0;
                max_value = value;
                max_index_list.push(i);
            } else if (value === max_value) {
                max_index_list.push(i);
            }
        }
        return max_index_list[Math.floor(Math.random() * max_index_list.length)];
    }

    possible_next_state(state) {
        let col = state[0];
        let row = state[1];
        let next_state = [0, 0, 0, 0];

        if (row !== 0) {
            next_state[0] = this.value_table[[col, row - 1].toString()] || 0;
        } else {
            next_state[0] = this.value_table[state.toString()] || 0;
        }
        if (row !== this.height - 1) {
            next_state[1] = this.value_table[[col, row + 1].toString()] || 0;
        } else {
            next_state[1] = this.value_table[state.toString()] || 0;
        }
        if (col !== 0) {
            next_state[2] = this.value_table[[col - 1, row].toString()] || 0;
        } else {
            next_state[2] = this.value_table[state.toString()] || 0;
        }
        if (col !== this.width - 1) {
            next_state[3] = this.value_table[[col + 1, row].toString()] || 0;
        } else {
            next_state[3] = this.value_table[state.toString()] || 0;
        }
        return next_state;
    }
}





