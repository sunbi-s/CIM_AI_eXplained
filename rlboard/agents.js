import { clamp, Position } from "./utill.js";
import configs from "./config.js";

export class RandomAgent{
    constructor(env) {
        this.n_action = env.actions.length;
    }

    getAction(state) {
        return Math.floor(Math.random( )*this.n_action);
    }
}

export class CommonAgent {
    constructor(env) {
        this.env = env;
        this.height = env.boardShape[0];
        this.width = env.boardShape[1];
        this.actions = env.actions;
        this.n_action = env.actions.length;
        this.discount_factor = 1;

        this._initValueTable();
    }

    _initValueTable() {
        this.value_table = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            this.value_table.push(row);
        }
    }

    _initVisitTable() {
        this.N = [];
        for (let y = 0; y < this.height; ++y) {
            let row = [];
            for (let x = 0; x < this.width; ++x) {
                row.push(0);
            }
            this.N.push(row);
        }
    }

    _apply_action(state, action){
        let next_state = [0, 0];
        let valid = true
        next_state[0] = state[0] + action[0]
        next_state[1] = state[1] + action[1]

        if (next_state[0] < 0 || next_state[0] > this.height - 1){
            valid = false;
        }
        if (next_state[1] < 0 || next_state[1] > this.width - 1){
            valid = false;
        }
        return [next_state, valid];
    }

    getOptimalAction(state) {
        let max_value = -99999;
        let max_action;
        let next_state;
        let valid;
        let result;

        for (let [idx, action] of this.actions.entries()) {
            result = this._apply_action(state, action)
            next_state = result[0]
            valid = result[1]

            if (!valid){continue;}

            let next_value = this.value_table[next_state[0]][next_state[1]];
            if (next_value > max_value){
                max_action = idx
                max_value = next_value
            }
        }
        return max_action;
    }

    getRndAction(state) {
        return Math.floor(Math.random( )*this.n_action);
    }
}

export class MCAgent extends CommonAgent{
    // https://sumniya.tistory.com/11
    constructor(env) {
        super(env);
        this.learning_rate = 0.1;
        this.epsilon = 0.9;
        this.samples = [];
    }

    // Add a sample to memory
    saveSample(state, reward, done) {
        this.samples.push([state, reward, done])
    }

    // Update the Q-value of all states visited by the agent in all episodes
    update() {
        this._initVisitTable();
        let state, reward, done, V_t;
        let visit_state = [];
        let G_t = 0;

        for (let i = this.samples.length-1; i >= 0; --i) {
            [state, reward, done] = this.samples[i];
            G_t = reward + this.discount_factor * G_t;
            
            let flag = true
            for (let j = 0; j < i; ++j) {
                let pre_state, pre_reward, pre_done
                [pre_state, pre_reward, pre_done] = this.samples[j];
                if (pre_state[0] == state[0] && pre_state[1] == state[1]){
                    flag = false
                }
            }
                
            if (flag) {
                this.N[state[0]][state[1]] =  this.N[state[0]][state[1]]  + 1
                V_t = this.value_table[state[0]][state[1]]; //default value
                this.value_table[state[0]][state[1]] = V_t + this.learning_rate * (G_t - V_t)/ this.N[state[0]][state[1]];
                // console.log(state[0],state[1], G_t , V_t, this.value_table[state[0]][state[1]],this.N[state[0]][state[1]])
            }
        }
        // samples clear
        this.samples = [];
    }

    // Return an action based on epsilon-greedy policy
    getAction(state) {
        let action;
        if (Math.random() < this.epsilon) {
            // Random action
            action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on value
            return this.getOptimalAction(state);
        }
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

export class OptimAgent extends CommonAgent{
    // https://github.com/rlcode/reinforcement-learning/blob/master/1-grid-world/2-value-iteration/value_iteration.py#L4
    constructor(env, optimal_equation) {
        super(env);
        this.computeValues(optimal_equation)
    }

    computeValues(optimal_equation) {
        // calculate optimal value table
        for (let i = 0; i < 1000; ++i) {
            this._valueIteration(optimal_equation);
        }
    }

    _valueIteration(optimal_equation) {
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
                    let result = this._apply_action(state, action)
                    let next_state = result[0]
                    let valid = result[1]
                    if (!valid){
                        continue;
                    }

                    let reward = configs[0].defaultReward;

                    let curr_cell = this.env._getCell(new Position(state[0], state[1]));
                    let place = curr_cell.lastChild;
                    if (place && place.classList.contains("place")) {
                        reward += place.reward;
                    }
                    let next_cell = this.env._getCell(new Position(next_state[0], next_state[1]));
                    if (next_cell) {
                        // let place = next_cell.lastChild;
                        // if (place && place.classList.contains("place")) {
                        //     reward += place.reward;
                        // }

                        let next_value = this.value_table[next_state[0]][next_state[1]];
                        value_list.push(reward + this.discount_factor * next_value);
                    }
                }

                if (optimal_equation){
                    next_value_table[state[0]][state[1]] = Math.max(...value_list);
                }
                else{
                    let sum = value_list.reduce((a, b) => a + b, 0);
                    next_value_table[state[0]][state[1]] = sum / value_list.length;
                }
            }
        }
        this.value_table = next_value_table;
    }

}
