import { animate } from "./game.js";
import { MDP } from "./mdp.js";

const frame = document.querySelector('#play_mdp_transition');


// Create Canvas Dom
const canvas = frame.querySelector('canvas');
frame.insertBefore(canvas, frame.firstChild);

const context = canvas.getContext('2d');
context.width = canvas.width;
context.height = canvas.height;

class MDP_Transition extends MDP {
    render() {
        // draw background image
        let img = new Image();
        img.src = "./../img/mdp/transition.PNG"
        this.context.drawImage(img, 8, 50);

        // draw title text
        this.context.fillStyle = "#e7326b";
        this.context.font = "bold 30pt Arial";
        this.context.fillText("아이 재우기 MDP", 40, 60);

        // draw current position
        this.context.beginPath();
        this.context.strokeStyle = "#eeb540";
        let radius;
        if (this.currentIdx === this.DUMMY_IDX) {
            radius = 10;
        } else {
            radius = 70;
        }
        let currentPos = this.positions[this.currentIdx];
        this.context.arc(currentPos[0], currentPos[1], radius, 0, 2 * Math.PI);
        this.context.lineWidth = 4;
        this.context.stroke();
    }
}


let mdp = new MDP_Transition(context);
animate(mdp);


// Add btn event
frame.querySelector('.btn_transition').addEventListener("click", function() {
    mdp.step();
});
frame.querySelector('.btn_reset').addEventListener("click", function() {
    mdp.reset();
});
