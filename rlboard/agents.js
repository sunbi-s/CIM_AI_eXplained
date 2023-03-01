import { clamp, Position } from "./utill.js";


export class RandomAgent{
    constructor(env) {
        this.n_action = env.actions.length;
    }

    getAction(state) {
        return Math.floor(Math.random( )*this.n_action);
    }
}

export class MCAgent {
    constructor(env) {
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.learning_rate = 0.01;
        this.discount_factor = 0.9;
        this.epsilon = 0.3;
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
        let action;
        if (Math.random() < this.epsilon) {
            // Random action
            action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on Q-value
            let next_state_value = this._possilbeNextState(state);
            action = this._argMax(next_state_value);
            return action;
        }
    }

    getOptimalAction(state) {
        // Action based on Q-value
        let next_state_value = this._possilbeNextState(state);
        return this._argMax(next_state_value);
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

    get_value_table() {
        let value_table = [];
        for (let y = 0; y < this.height; ++y) {
            value_table.push([]);
            for (let x = 0; x < this.width; ++x) {
                let key = [y, x].toString();
                let value = this.value_table[key] || 0;

                value_table[y].push(value);
            }
        }
        return value_table
    }
}

export class TDAgent {
    constructor(env) {
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.learning_rate = 0.01;
        this.discount_factor = 0.9;
        this.epsilon = 0.3;
        this.value_table = {};
    }

    // learn value of all states visited by the agent in all episodes
    learn(state, pre_reward, reward, next_state, done){
        state = state.toString()
        next_state = next_state.toString()
        // console.log(state, next_state, reward, done);

        let V_next = this.value_table[next_state] || 0 ; //default value
        let V_cur = this.value_table[state] || 0 ; //default value
        this.value_table[state] = V_cur + this.learning_rate * (pre_reward + this.discount_factor * V_next - V_cur);

        // console.log(V_cur, V_next);
        if (done){
            let V_next_next = 0
            this.value_table[next_state] = V_next + this.learning_rate * (reward + this.discount_factor * V_next_next - V_next); 
            // console.log(this.value_table[next_state]);
        }

    }
    
    // Return an action based on Q-value
    // Return an action based on epsilon-greedy policy
    getAction(state) {
        let action;
        if (Math.random() < this.epsilon) {
            // Random action
            action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on Q-value
            let next_state_value = this._possilbeNextState(state);
            action = this._argMax(next_state_value);
            return action;
        }
    }

    getOptimalAction(state) {
        // Action based on Q-value
        let next_state_value = this._possilbeNextState(state);
        return this._argMax(next_state_value);
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

export class OptimAgent {
    constructor(env) {
        this.env = env;
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.discount_factor = 0.9;

        this._calcOptimal();
    }

    _calcOptimal() {
        this.value_table = {};
        // TODO: implementation optimal value table
        for (let i = 0; i < 10; ++i) {
            this._valueIteration();
        }
    }

    _valueIteration() {
        let next_value_table = {};
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                let state = [y, x];
                let cell = this.env._getCell(new Position(state[0], state[1]));
                if (cell) {
                    let place = cell.lastChild;
                    if (place && place.classList.contains("place")) {
                        if (place.done) {
                            next_value_table[state.toString()] = 0;//place.reward;
                            continue;
                        }
                    }
                }

                let value_list = [];

                for (let action of this.actions) {
                    let next_state = [state[0], state[1]];
                    next_state[0] = clamp(next_state[0] + action[0], 0, this.height - 1);
                    next_state[1] = clamp(next_state[1] + action[1], 0, this.width - 1);

                    let reward = 0;
                    let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
                    if (next_cell) {
                        let place = next_cell.lastChild;
                        if (place && place.classList.contains("place")) {
                            reward = place.reward;
                        }


                        let next_value = this.value_table[next_state.toString()] || 0;
                        value_list.push(reward + this.discount_factor * next_value);
                    }

                    // let sum = value_list.reduce((a, b) => a + b, 0);
                    // next_value_table[state.toString()] = sum / value_list.length;
                    next_value_table[state.toString()] = Math.max(...value_list);
                }
            }
        }
        this.value_table = next_value_table;
    }

    getOptimalAction(state) {
        // Action based on Q-value
        let value_list = [];
        for (let action of this.actions) {
            let next_state = [state[0], state[1]];
            next_state[0] = clamp(next_state[0] + action[0], 0, this.height - 1);
            next_state[1] = clamp(next_state[1] + action[1], 0, this.width - 1);

            let reward = 0;
            let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
            if (next_cell) {
                let place = next_cell.lastChild;
                if (place && place.classList.contains("place")) {
                    reward = place.reward;
                }

                let next_value = this.value_table[next_state.toString()] || 0;
                value_list.push(reward + this.discount_factor * next_value);
            }
        }
        return this._argMax(value_list);
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
}
