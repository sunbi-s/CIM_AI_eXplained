export class ControlAgent{
    constructor(env) {
        this.n_action = env.actions.length;
    }

    save_sample(state, reward, done) {
        // pass
    }

    update() {
        // update
    }

    get_action(state) {
        return Math.floor(Math.random( )*this.n_action);
    }
}

export class RandomAgent{
    constructor(env) {
        this.n_action = env.actions.length;
    }

    save_sample(state, reward, done) {
        // pass
    }

    update() {
        // update
    }

    get_action(state) {
        return Math.floor(Math.random( )*this.n_action);
    }
}

export class MCAgent{
    constructor(env) {
        this.width = 10;
        this.height = 10;
        this.actions = env.actions;
        this.learning_rate = 0.01;
        this.discount_factor = 0.9;
        this.epsilon = 0.3;
        this.samples = [];
        this.value_table = {};
    }
    // Add a sample to memory
    save_sample(state, reward, done) {
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
    get_action(state) {
        if (Math.random() < this.epsilon) {
            // Random action
            let action = Math.floor(Math.random() * this.actions.length);
            return action;
        } else {
            // Action based on Q-value
            let next_state = this._possible_next_state(state);
            let action = this._arg_max(next_state);
            return action;
        }
    }

    // Calculate arg_max if there are multiple candidates and return one randomly
    _arg_max(next_state) {
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

    _possible_next_state(state) {
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

export class SARSAgent {
    constructor(env) {
      this.actions = env.actions;
      this.learning_rate = 0.01;
      this.discount_factor = 0.9;
      this.epsilon = 0.1;
      this.q_table = new Map();
    }
  
    // Update the Q-table based on a sample of the form (state, action, reward, next_state, next_action)
    learn(state, action, reward, next_state, next_action) {
      let currentQ = this.getQValue(state, action);
      let nextStateQ = this.getQValue(next_state, next_action);
      let newQ = currentQ + this.learning_rate * (reward + this.discount_factor * nextStateQ - currentQ);
      this.setQValue(state, action, newQ);
    }
  
    // Return an action based on the epsilon-greedy policy
    get_action(state) {
      if (Math.random() < this.epsilon) {
        // Return a random action
        return Math.floor(Math.random() * this.actions.length);
      } else {
        // Return the action with the highest expected reward
        // console.log(this.q_table.size, state, this.getState(state))
        return this.argMax(this.getState(state));
      }
    }
  
    // Return the action with the highest expected reward
    argMax(stateAction) {
      let maxIndexList = [];
      let maxValue = stateAction[0];
      for (let i = 0; i < stateAction.length; i++) {
        if (stateAction[i] > maxValue) {
          maxIndexList = [];
          maxValue = stateAction[i];
          maxIndexList.push(i);
        } else if (stateAction[i] === maxValue) {
          maxIndexList.push(i);
        }
      }
    //   console.log("argmax", Math.floor(Math.random() * maxIndexList.length))
      return Math.floor(Math.random() * maxIndexList.length);
    }
  
    getQValue(state, action) {
      if (!this.q_table.has(state)) {
        this.q_table.set(state, Array(this.actions.length).fill(0));
      }
    //   console.log(action)
    //   console.log(this.q_table.get(state),action)
      return this.q_table.get(state)[action];
    }

    getState(state) {
        if (!this.q_table.has(state)) {
          this.q_table.set(state, Array(this.actions.length).fill(0));
        }
        return this.q_table.get(state);
      }
  
    setQValue(state, action, value) {
      if (!this.q_table.has(state)) {
          let new_state = [state[0], state[1]];
          this.q_table.set(new_state, Array(this.actions.length).fill(0));
      }
      let stateAction = this.q_table.get(state);
      stateAction[action] = value;
      let new_state = [state[0], state[1]];
      this.q_table.set(new_state, stateAction);
    }
  }




