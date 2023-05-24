import { animate } from "./game.js";
import { Edge, MDP } from "./mdp.js";

const frame = document.querySelector('#play_mdp_action');


// Create Canvas Dom
const canvas = frame.querySelector('canvas');
frame.insertBefore(canvas, frame.firstChild);

const context = canvas.getContext('2d');
context.width = canvas.width;
context.height = canvas.height;

class MDP_Action extends MDP {
    constructor(context) {
        super(context);

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

        this.positions[this.DUMMY_IDX] = [222, 236];
    }

    render() {
        // draw background image
        let img = new Image();
        img.src = "img/mdp/action.png"
        this.context.drawImage(img, 50, 10, this.context.width * 0.9, this.context.height);

        // draw cumulated reward text
        this.context.font = "bold 16px Arial";
        this.context.fillStyle = "black";
        this.context.fillText("Σ Reward = " + this.reward, 370, 220);

        // draw current position
        let circleImg = new Image();
        let radius;
        if (this.currentIdx === this.DUMMY_IDX) {
            circleImg.src = "img/mdp/circle_small.png"
            radius = 35;
        } else {
            circleImg.src = "img/mdp/circle.png"
            radius = 122;
        }
        let currentPos = this.positions[this.currentIdx];
        this.context.drawImage(circleImg, currentPos[0] - radius/2, currentPos[1] - radius/2, radius, radius);
    }
}


let mdp = new MDP_Action(context);
animate(mdp);


// Add btn event
frame.querySelector('.btn_action_0').addEventListener("click", function() {
    mdp.step(0);
});
frame.querySelector('.btn_action_1').addEventListener("click", function() {
    mdp.step(1);
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    mdp.reset();
});
