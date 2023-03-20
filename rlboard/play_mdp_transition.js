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
        img.src = "img/mdp/transition.png"
        this.context.drawImage(img, 50, 10, this.context.width * 0.9, this.context.height);

        // draw current position
        let circleImg = new Image();
        circleImg.src = "img/mdp/circle.png"
        let radius = 122;
        let currentPos = this.positions[this.currentIdx];
        this.context.drawImage(circleImg, currentPos[0] - radius/2, currentPos[1] - radius/2, radius, radius);
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
