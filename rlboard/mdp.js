import { sleep } from "./utill.js"

function weightedRandom(edges) {
    let i;
    let probs = [edges[0].prob];

    for (i = 1; i < edges.length; ++i) {
        probs[i] = edges[i].prob + probs[i - 1];
    }

    let random = Math.random() * probs[probs.length - 1];

    for (i = 0; i < probs.length; ++i) {
        if (probs[i] > random)
            break;
    }

    return edges[i];
}


export class Edge {
    constructor(fromIdx, toIdx, prob, reward) {
        this.fromIdx = fromIdx;
        this.toIdx = toIdx;
        this.prob = prob;
        this.reward = reward;
    }
}

export class MDP {
    constructor(context) {
        this.context = context;

        this.END_IDX = 4;

        this.edges = [
            new Edge(0, 2, 0.6, 0),
            new Edge(0, 1, 0.4, 0),

            new Edge(1, 0, 0.1, 0),
            new Edge(1, 1, 0.9, 0),

            new Edge(2, 3, 0.7, 0),
            new Edge(2, this.END_IDX, 0.3, 0),

            new Edge(3, this.END_IDX, 1.0, 0),
        ];
        this.positions = {
            0: [132, 346],
            1: [132, 158],
            2: [316, 346],
            3: [500, 346],
            4: [684, 346],
        };

        this.initIdx = 0;

        this.reset();
    }

    async step(action=null) {
        if (this.currentIdx === this.END_IDX) {
            alert("Episode is done.\nYou have to reset before playing.");
            return;
        }

        if (action !== null) {
            let candidates = this.edges.filter((e) => e.fromIdx === this.currentIdx);
            if (candidates[action] === undefined) {
                return;
            }
            let edge = candidates[action];
            this.currentIdx = edge.toIdx;
            this.reward += edge.reward;

            this.render();
            await sleep(1000);

            if (this.currentIdx === this.DUMMY_IDX) {
                let prob = Math.random();
                if (prob > 0.7) {
                    this.currentIdx = 1;
                } else {
                    this.currentIdx = 0;
                }
            }

        } else {
            if (this.currentIdx === this.DUMMY_IDX) {
                let prob = Math.random();
                if (prob > 0.7) {
                    this.currentIdx = 1;
                } else {
                    this.currentIdx = 0;
                }
            } else {
                let candidates = this.edges.filter((e) => e.fromIdx === this.currentIdx);
                let edge = weightedRandom(candidates);
                this.currentIdx = edge.toIdx;
                this.reward += edge.reward;
            }
        }

        this.render();

        console.log("accumulated reward: " + this.reward);
    }

    reset() {
        this.currentIdx = this.initIdx;
        this.reward = 0;
    }
}
