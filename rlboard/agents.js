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
    // https://sumniya.tistory.com/11
    constructor(env) {
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.n_action = env.actions.length;
        this.learning_rate = 0.1;
        this.discount_factor = 0.9;
        this.epsilon = 0.9;
        this.samples = [];

        this.value_table = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            this.value_table.push(row);
        }
    }

    // Add a sample to memory
    saveSample(state, reward, done) {
        this.samples.push([state, reward, done])
    }

    // Update the Q-value of all states visited by the agent in all episodes
    update() {
        let state, reward, done, V_t;
        let visit_state = [];
        let G_t = 0;

        for (let i = this.samples.length-1; i >= 0; --i) {
            [state, reward, done] = this.samples[i];
            if (!visit_state.includes(state.toString())) {
                visit_state.push(state.toString());

                G_t = reward + this.discount_factor * G_t;
                V_t = this.value_table[state[0]][state[1]]; //default value
                this.value_table[state[0]][state[1]] = V_t + this.learning_rate * (G_t - V_t);
                console.log(state[0],state[1], G_t - V_t)
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

    getRndAction(state) {
        return Math.floor(Math.random( )*this.n_action);
    }

    getOptimalAction(state) {
        // Action based on Q-value
        let next_state_value = this._possilbeNextState(state);
        return this._argMax(next_state_value);
    }

    // Calculate arg_max if there are multiple candidates and return one randomly
    _argMax(value) {
        let max_index_list = [];
        let max_value = value[0];
        for (let i = 0; i < value.length; i++) {
            let temp = value[i];
            if (temp > max_value) {
                max_index_list.length = 0;
                max_value = temp;
                max_index_list.push(i);
            } else if (temp === max_value) {
                max_index_list.push(i);
            }
        }
        return max_index_list[Math.floor(Math.random() * max_index_list.length)];
    }

    _possilbeNextState(state) {
        let row = state[0];
        let col = state[1];

        let next_state_value = [0, 0, 0, 0];
        if (row !== 0) {
            next_state_value[0] = this.value_table[row - 1][col];
        } else {
            next_state_value[0] = this.value_table[state[0]][state[1]];
        }
        if (row !== this.height - 1) {
            next_state_value[1] = this.value_table[row + 1][col];
        } else {
            next_state_value[1] = this.value_table[state[0]][state[1]];
        }
        if (col !== 0) {
            next_state_value[2] = this.value_table[row][col -1];
        } else {
            next_state_value[2] = this.value_table[state[0]][state[1]];
        }
        if (col !== this.width - 1) {
            next_state_value[3] = this.value_table[row][col + 1];
        } else {
            next_state_value[3] = this.value_table[state[0]][state[1]];
        }
        return next_state_value;
    }

    reset() {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.value_table[y][x] = 0;
            }
        }
    }
}

export class TDAgent extends MCAgent {
    // learn value of all states visited by the agent in all episodes
    learn(state, reward, next_state) {
        let V = this.value_table[state[0]][state[1]];
        let nextV = this.value_table[next_state[0]][next_state[1]];
        let targetV = reward + this.discount_factor * nextV;
        this.value_table[state[0]][state[1]] = V + this.learning_rate * (targetV - V);

    }
}

export class OptimAgent {
    // https://github.com/rlcode/reinforcement-learning/blob/master/1-grid-world/2-value-iteration/value_iteration.py#L4
    constructor(env) {
        this.env = env;
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.discount_factor = 0.9;

        this.initValueTable();
    }

    initValueTable() {
        this.value_table = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            this.value_table.push(row);
        }

        // calculate optimal value table
        for (let i = 0; i < 1000; ++i) {
            this._valueIteration();
        }
    }

    _valueIteration() {
        let next_value_table = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            next_value_table.push(row);
        }

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                let state = [y, x];
                let cell = this.env._getCell(new Position(state[0], state[1]));
                if (cell) {
                    let place = cell.lastChild;
                    if (place && place.classList.contains("place")) {
                        if (place.done) {
                            next_value_table[state[0]][state[1]] = 0;
                            continue;
                        }
                    }
                }

                let value_list = [];

                for (let action of this.actions) {
                    let next_state = [state[0], state[1]];
                    if (next_state[0] + action[0] < 0 || next_state[0] + action[0] > this.height - 1){
                        continue;
                    }
                    if (next_state[1] + action[1] < 0 || next_state[1] + action[1] > this.width - 1){
                        continue;
                    }

                    next_state[0] = next_state[0] + action[0]
                    next_state[1] = next_state[1] + action[1]

                    let reward = -1;
                    let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
                    if (next_cell) {
                        let place = next_cell.lastChild;
                        if (place && place.classList.contains("place")) {
                            reward += place.reward;
                        }

                        let next_value = this.value_table[next_state[0]][next_state[1]];
                        value_list.push(reward + this.discount_factor * next_value);
                    }
                }
                let sum = value_list.reduce((a, b) => a + b, 0);
                // next_value_table[state[0]][state[1]] = sum / value_list.length;
                next_value_table[state[0]][state[1]] = Math.max(...value_list);
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

            let reward = -1;
            let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
            if (next_cell) {
                let place = next_cell.lastChild;
                if (place && place.classList.contains("place")) {
                    reward += place.reward;
                }
                let next_value = this.value_table[next_state[0]][next_state[1]];
                console.log(reward, state[0], state[1], next_state[0], next_state[1], next_value)
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

export class OptimAgentAVG{
    // https://github.com/rlcode/reinforcement-learning/blob/master/1-grid-world/2-value-iteration/value_iteration.py#L4
    constructor(env) {
        this.env = env;
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.discount_factor = 0.9;

        this.initValueTable();
    }

    initValueTable() {
        this.value_table = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            this.value_table.push(row);
        }

        // calculate optimal value table
        for (let i = 0; i < 1000; ++i) {
            this._valueIteration();
        }
    }

    _valueIteration() {
        let next_value_table = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            next_value_table.push(row);
        }

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                let state = [y, x];
                let cell = this.env._getCell(new Position(state[0], state[1]));
                if (cell) {
                    let place = cell.lastChild;
                    if (place && place.classList.contains("place")) {
                        if (place.done) {
                            next_value_table[state[0]][state[1]] = 0;
                            continue;
                        }
                    }
                }

                let value_list = [];

                for (let action of this.actions) {
                    let next_state = [state[0], state[1]];
                    if (next_state[0] + action[0] < 0 || next_state[0] + action[0] > this.height - 1){
                        continue;
                    }
                    if (next_state[1] + action[1] < 0 || next_state[1] + action[1] > this.width - 1){
                        continue;
                    }

                    next_state[0] = next_state[0] + action[0]
                    next_state[1] = next_state[1] + action[1]

                    let reward = -1;
                    let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
                    if (next_cell) {
                        let place = next_cell.lastChild;
                        if (place && place.classList.contains("place")) {
                            reward += place.reward;
                        }

                        let next_value = this.value_table[next_state[0]][next_state[1]];
                        value_list.push(reward + this.discount_factor * next_value);
                    }
                }
                let sum = value_list.reduce((a, b) => a + b, 0);
                next_value_table[state[0]][state[1]] = sum / value_list.length;
                // next_value_table[state[0]][state[1]] = Math.max(...value_list);
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

            let reward = -1;
            let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
            if (next_cell) {
                let place = next_cell.lastChild;
                if (place && place.classList.contains("place")) {
                    reward += place.reward;
                }
                let next_value = this.value_table[next_state[0]][next_state[1]];
                console.log(reward, state[0], state[1], next_state[0], next_state[1], next_value)
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

