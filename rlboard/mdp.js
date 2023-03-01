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


class Edge {
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
        this.DUMMY_IDX = 9;

        this.edges = [
            new Edge(0, 2, 0.6, -1),
            new Edge(0, 1, 0.4, +1),

            new Edge(1, 0, 0.1, -1),
            new Edge(1, 1, 0.9, +0),

            new Edge(2, 3, 0.3, +0),
            new Edge(2, this.DUMMY_IDX, 0.7, +1),  // to dummy node

            new Edge(3, this.END_IDX, 0.8, +10),
            new Edge(3, 2, 0.2, -1),
        ];
        this.positions = {
            0: [89, 492],
            1: [89, 225],
            2: [356, 492],
            3: [623, 492],
            4: [890, 492],
        };
        this.positions[this.DUMMY_IDX] = [245, 336];
        this.initIdx = 0;

        this.reset();
    }

    async step(action=null) {
        if (this.currentIdx === this.END_IDX) {
            console.log("Done. Reset, please");
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
