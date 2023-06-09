import config from './config.js';
import { animate } from "./game.js";
import { sleep } from "./utill.js";

const frame = document.querySelector('#play_various_gamma');
const leftDiv = frame.querySelector('.gamma_board_left');
const rightDiv = frame.querySelector('.gamma_board_right');
const sliderGrid = frame.querySelector('.slider_grid');
const sliderGamma = frame.querySelector('.slider_gamma');

const sizes = [4, 5, 6];
const gammas = [990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000];
const trajectories = [
    [
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ],
        [
            [-110, -10, 0], [-110, 70, 0], [-40, 70, 0], [-40, 140, 0], [36, 140, 0], [36, 210, 0], [112, 210, 1]
        ]
    ],
    [
        [
            [-116, -8, 0], [-61, -8, 0]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [1, 52, 0], [1, 112, 0], [61, 112, 0], [61, 172, 0], [61, 232, 0], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [61, -8, 0], [121, -8, 0], [121, 52, 0], [121, 112, 0], [121, 172, -1], [121, 232, 1]
        ],
        [
            [-116, -8, 0], [-61, -8, 0], [1, -8, 0], [61, -8, 0], [121, -8, 0], [121, 52, 0], [121, 112, 0], [121, 172, -1], [121, 232, 1]
        ],
    ],
    [
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0]
        ],
        [
            [-124, 0, 0], [-74, 0, 0], [-74, 50, 0], [-74, 100, 0], [-24, 100, 0], [-24, 150, 0], [-24, 200, -1], [26, 200, 0], [76, 200, 0], [76, 250, 0], [126, 250, 1]
        ],
        [
            [-124, 0, 0], [-74, 0, 0], [-74, 50, 0], [-74, 100, 0], [-24, 100, 0], [-24, 150, 0], [-24, 200, -1], [26, 200, 0], [76, 200, 0], [76, 250, 0], [126, 250, 1]
        ],
        [
            [-124, 0, 0], [-74, 0, 0], [-24, 0, 0], [-24, 50, 0], [-24, 100, 0], [-24, 150, 0], [26, 150, 0], [26, 200, 0], [76, 200, 0], [76, 250, 0], [126, 250, 1]
        ],
        [
            [-124, 0, 0], [-74, 0, 0], [-24, 0, 0], [-24, 50, 0], [-24, 100, 0], [-24, 150, 0], [26, 150, 0], [26, 200, 0], [76, 200, 0], [76, 250, 0], [126, 250, 1]
        ],
    ]
]


const game = new class Game {
    constructor(parent) {
        this.interrupt = false;
        this._createPlayer(parent);
        this.setParams(2, 10);
    }

    _createPlayer(parent) {
        this.player = document.createElement('img');
        this.player.draggable = false;
        this.player.imagePath = config[0].agentImagePath;
        this.player.imageIndex = 0;
        this.player.style.position = "relative";
        parent.appendChild(this.player);
    }

    _movePlayer(i_step) {
        let trajectory = trajectories[this.i_size][this.i_gamma];
        let [x, y, type] = trajectory[i_step % trajectory.length];
        this.player.style.top = y + "px";
        this.player.style.left = x + "px";

        // if player in empty cell
        if (type === 0) {
            return false;
        }

        let effect = document.createElement("img");
        effect.classList.add("effect");
        effect.style.position = "absolute";
        this.player.parentNode.appendChild(effect);
        setTimeout(() => effect.remove(), 500);

        // show effect
        if (type === -1) {
            effect.src = "img/rlboard/effect/Explosion.png";
            effect.style.top = this.player.offsetTop + parseInt(this.player.style.height) / 10 + "px";
            effect.style.left = this.player.offsetLeft + parseInt(this.player.style.width) / 2 + "px";
        } else if (type === 1) {
            effect.src = "img/rlboard/effect/Clear.png";
            effect.style.height = "200px";
            effect.style.width = "400px";
            effect.style.top = this.player.parentElement.offsetTop + this.player.parentElement.offsetLeft * 0.15 + "px";
            effect.style.left = this.player.parentElement.offsetLeft * 0.93 + "px";
            return true;
        }
        return false;
    }

    async run() {
        let i_step = 0;
        let done = false;
        while (!done) {
            if (this.interrupt) {
                this.interrupt = false;
                break;
            }

            done = this._movePlayer(i_step);
            if (!done) {
                i_step += 1;
                await sleep(500);
            }
        }
    }

    setParams(i_size, i_gamma) {
        this.i_size = i_size;
        this.i_gamma = i_gamma;
        this._movePlayer(0);
    }

    render() {
        // set player image
        let imageSize = "100px";
        switch (Number(this.i_size)) {
            case 0:
                imageSize = "100px";
                break;
            case 1:
                imageSize = "80px";
                break;
            case 2:
                imageSize = "60px";
                break;
        }
        this.player.style.height = imageSize;
        this.player.style.width = imageSize;
        this.player.src = this.player.imagePath[this.player.imageIndex % this.player.imagePath.length];
        this.player.imageIndex = (this.player.imageIndex + 1) % this.player.imagePath.length;

        leftDiv.style.backgroundImage = "url('img/gamma_board/" + sizes[this.i_size] + "_" + gammas[this.i_gamma] + ".png')";
        leftDiv.style.backgroundSize = "contain";
        leftDiv.style.width = "49.67%";

        rightDiv.style.backgroundImage = "url('img/gamma_board/" + sizes[this.i_size] + "_" + gammas[this.i_gamma] + "_val.png')";
        rightDiv.style.backgroundSize = "contain";
        rightDiv.style.width = "49.67%";
    }
}(leftDiv);
animate(game);


let btnTest = frame.querySelector('.btn_test');
let btnStop = frame.querySelector('.btn_stop');

btnTest.addEventListener("click", function () {
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";

    sliderGrid.disabled = true;
    sliderGamma.disabled = true;

    game.run().then(() => {
        btnTest.style.display = "inline-block";
        btnStop.style.display = "none";

        sliderGrid.disabled = false;
        sliderGamma.disabled = false;
    });
});
btnStop.addEventListener("click", function() {
    btnTest.style.display = "inline-block";
    btnStop.style.display = "none";

    sliderGrid.disabled = false;
    sliderGamma.disabled = false;

    game.interrupt = true;
});


sliderGrid.addEventListener('input', function() {
    game.setParams(sliderGrid.value, game.i_gamma);
});

sliderGamma.addEventListener('input', function() {
    game.setParams(game.i_size, sliderGamma.value);
});
