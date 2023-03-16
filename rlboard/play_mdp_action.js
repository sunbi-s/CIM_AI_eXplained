import { animate } from "./game.js";
import { Edge, MDP } from "./mdp.js";

const frame = document.querySelector('#play_mdp_action');


// Create Canvas Dom
const canvas = frame.querySelector('canvas');
frame.insertBefore(canvas, frame.firstChild);

const context = canvas.getContext('2d');
context.width = canvas.width;
context.height = canvas.height;
canvas.onclick = (ev) => {
    let bounds = canvas.getBoundingClientRect();
    let mouseX = (ev.clientX / bounds.width) * canvas.width - bounds.x;
    let mouseY = (ev.clientY / bounds.height) * canvas.height - bounds.y;
    console.log(mouseX, mouseY);
};

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

        this.positions[this.DUMMY_IDX] = [240, 235];
    }

    render() {
        // draw background image
        let img = new Image();
        img.src = "img/mdp/action.png"
        this.context.drawImage(img, 50, 10, this.context.width * 0.9, this.context.height);

        // draw title text
        this.context.fillStyle = "#e7326b";
        this.context.font = "bold 20pt Arial";
        this.context.fillText("MDP for Improving child’s sleep quality", 40, 20);

        // draw current position
        this.context.beginPath();
        this.context.strokeStyle = "#eeb540";
        let radius;
        if (this.currentIdx === this.DUMMY_IDX) {
            radius = 8;
        } else {
            radius = 50;
        }
        let currentPos = this.positions[this.currentIdx];
        this.context.arc(currentPos[0], currentPos[1], radius, 0, 2 * Math.PI);
        this.context.lineWidth = 4;
        this.context.stroke();
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
