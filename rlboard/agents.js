export class ControlAgent{
    constructor(env) {
        this.n_action = env.actions.length;
    }

    saveSample(state, reward, done) {
        // pass
    }

    update() {
        // update
    }

    getAction(state) {
        return Math.floor(Math.random( )*this.n_action);
    }

    reset() {
        // reset
    }
}

export class UserAgent{
    constructor(env) {
        this.n_action = env.actions.length;
        this.action_table = Array.from(Array(10), () => Array(10).fill(-1));
    }

    getAction(state) {
        let y = state[0]
        let x = state[1]
        let action =  this.action_table[x][y]
        return action
    }

    reset() {
        // reset
    }
}

export class RandomAgent{
    constructor(env) {
        this.n_action = env.actions.length;
    }

    saveSample(state, reward, done) {
        // pass
    }

    update() {
        // update
    }

    getAction(state) {
        return Math.floor(Math.random( )*this.n_action);
    }

    reset() {
        // reset
    }
}

export class MCAgent{
    constructor(env) {
        this.width = 10;
        this.height = 10;
        this.actions = env.actions;
        this.learning_rate = 0.01;
        this.discount_factor = 0.9;
        this.epsilon = 0.1;
        this.samples = [];
        this.value_table = {};
    }

    // Add a sample to memory
    saveSample(state, reward, done) {
        let new_state = [state[0], state[1]];
        this.samples.push([new_state, reward, done])
    }

    // Update the Q-value of all states visited by the agent in all episodes
    update(){
        let sample, state, reward, V_t;
        let visit_state = [];
        let G_t = 0;

        for (let i=this.samples.length-1; i>=0; --i) {
            sample = this.samples[i];
            state = sample[0].toString();
            reward = sample[1];
            if (!visit_state.includes(state)) {
                visit_state.push(state);
                G_t = reward + this.discount_factor * G_t;
                V_t = this.value_table[state] || 0 ; //default value
                this.value_table[state] = V_t + this.learning_rate * (G_t - V_t);
            }
        }

        // samples clear
        this.samples = [];
    }
    
    // Return an action based on Q-value
    // Return an action based on epsilon-greedy policy
    getAction(state) {
        if (Math.random() < this.epsilon) {
            // Random action
            let action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on Q-value
            let next_state_value = this._possilbeNextState(state);
            let action = this._argMax(next_state_value);
            return action;
        }
    }

    getOptimalAction(state) {
        // Action based on Q-value
        let next_state_value = this._possilbeNextState(state);
        let action = this._argMax(next_state_value);
        return action;
    }

    // Calculate arg_max if there are multiple candidates and return one randomly
    _argMax(next_state) {
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

    _possilbeNextState(state) {
        let row = state[0];
        let col = state[1];

        let next_state_value = [0, 0, 0, 0];
        //this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        if (row !== 0) {
            next_state_value[0] = this.value_table[[row - 1, col].toString()] || 0;
        } else {
            next_state_value[0] = this.value_table[state.toString()] || 0;
        }
        if (row !== this.height - 1) {
            next_state_value[1] = this.value_table[[row + 1, col].toString()] || 0;
        } else {
            next_state_value[1] = this.value_table[state.toString()] || 0;
        }
        if (col !== 0) {
            next_state_value[2] = this.value_table[[row, col -1 ].toString()] || 0;
        } else {
            next_state_value[2] = this.value_table[state.toString()] || 0;
        }
        if (col !== this.width - 1) {
            next_state_value[3] = this.value_table[[row, col + 1].toString()] || 0;
        } else {
            next_state_value[3] = this.value_table[state.toString()] || 0;
        }
        return next_state_value;
    }

    reset() {
        this.value_table = {};
    }
}

export class TDAgent {
    constructor(env) {
        this.width = 10;
        this.height = 10;
        this.actions = env.actions;
        this.learning_rate = 0.01;
        this.discount_factor = 0.9;
        this.epsilon = 0.1;
        this.samples = [];
        this.value_table = {};
    }

    // learn value of all states visited by the agent in all episodes
    learn(state, pre_reward, reward, next_state, done){
        state = state.toString()
        next_state = next_state.toString()
        console.log(state, next_state, reward, done)

        let V_next = this.value_table[next_state] || 0 ; //default value
        let V_cur = this.value_table[state] || 0 ; //default value
        this.value_table[state] = V_cur + this.learning_rate * (pre_reward + this.discount_factor * V_next - V_cur);

        console.log(V_cur, V_next)
        if (done){
            let V_next_next = 0
            this.value_table[next_state] = V_next + this.learning_rate * (reward + this.discount_factor * V_next_next - V_next); 
            console.log(this.value_table[next_state])
        }

    }
    
    // Return an action based on Q-value
    // Return an action based on epsilon-greedy policy
    getAction(state) {
        if (Math.random() < this.epsilon) {
            // Random action
            let action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on Q-value
            let next_state_value = this._possilbeNextState(state);
            let action = this._argMax(next_state_value);
            return action;
        }
    }

    getOptimalAction(state) {
        // Action based on Q-value
        let next_state_value = this._possilbeNextState(state);
        let action = this._argMax(next_state_value);
        return action;
    }

    // Calculate arg_max if there are multiple candidates and return one randomly
    _argMax(next_state) {
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

    _possilbeNextState(state) {
        let row = state[0];
        let col = state[1];

        let next_state_value = [0, 0, 0, 0];
        //this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        if (row !== 0) {
            next_state_value[0] = this.value_table[[row - 1, col].toString()] || 0;
        } else {
            next_state_value[0] = this.value_table[state.toString()] || 0;
        }
        if (row !== this.height - 1) {
            next_state_value[1] = this.value_table[[row + 1, col].toString()] || 0;
        } else {
            next_state_value[1] = this.value_table[state.toString()] || 0;
        }
        if (col !== 0) {
            next_state_value[2] = this.value_table[[row, col -1 ].toString()] || 0;
        } else {
            next_state_value[2] = this.value_table[state.toString()] || 0;
        }
        if (col !== this.width - 1) {
            next_state_value[3] = this.value_table[[row, col + 1].toString()] || 0;
        } else {
            next_state_value[3] = this.value_table[state.toString()] || 0;
        }
        return next_state_value;
    }

    reset() {
        this.value_table = {};
    }
} 

export class QLearningAgent {
    constructor(env) {
        this.actions = env.actions;
        this.learningRate = 0.1;
        this.discountFactor = 0.9;
        this.epsilon = 0.2;
        this.qTable = {};
    }

    learn(state, action, reward, nextState) {
        let q1 = this._getQValue(state, action);
        let q2 = reward + this.discountFactor * this._getMaxQValue(nextState);
        this._setQValue(state, action, q1 + this.learningRate * (q2 - q1));
    }

    getAction(state) {
        if (Math.random() < this.epsilon) {
        return Math.floor(Math.random() * this.actions.length);
        } 
        else {
        return this._argMax(this._getState(state));
        }
    }

    getOptimalAction(state) {
        return this._argMax(this._getState(state));
    }

    _argMax(stateAction) {
        let maxIndexList = [];
        let maxValue = stateAction[0];
        for (let i = 0; i < stateAction.length; i++) {
            if (stateAction[i] > maxValue) {
                maxIndexList = [];
                maxValue = stateAction[i];
                maxIndexList.push(i);
            } 
            else if (stateAction[i] == maxValue) {
                maxIndexList.push(i);
            }
        }
        return maxIndexList[Math.floor(Math.random() * maxIndexList.length)];
    }

    _getQValue(state, action) {
        if (!this.qTable[state]) {
            this.qTable[state] = Array(this.actions.length).fill(0);
        }
        return this.qTable[state][action];
    }

    _setQValue(state, action, value) {
        if (!this.qTable[state]) {
            this.qTable[state] = Array(this.actions.length).fill(0);
        }
        let stateAction = this.qTable[state];
        stateAction[action] = value;
        this.qTable[state] = stateAction;
    }

    _getMaxQValue(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = Array(this.actions.length).fill(0);
        }
        return Math.max(...this.qTable[state]);
    }

    _getState(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = Array(this.actions.length).fill(0);
        }
        return this.qTable[state];
    }

    reset() {
        this.qTable = {};
    }
}
