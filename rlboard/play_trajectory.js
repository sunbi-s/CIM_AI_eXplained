import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_6')
const boardDom = frame.querySelector('.board');
boardDom.style.cursor = 'pointer';

let policyName = "control";
let game = new Game(boardDom, 0, policyName);
animate(game);

let state = game.environment.reset();
let reward = 0;
let done = false;

let action_table = Array.from(Array(10), () => Array(10).fill(-1))


function getCellPosition(div, _cell) {
    for (let y=0; y<div.childElementCount; ++y) {
        let row = div.childNodes[y];
        for (let x=0; x<row.childElementCount; ++x) {
            let cell = row.childNodes[x];
            if (cell === _cell) {
                return new Position(y, x);
            }
        }
    }
}

function setDraggable(node) {
    node.classList.add("draggable");
    node.addEventListener("dragstart", () => {
        node.classList.add("dragging");
    })
    node.addEventListener("dragend", () => {
        node.classList.remove("dragging");
    });
}

function make_action_table(){
    
    let arrows = board.querySelectorAll(".arrow");
    
    arrows.forEach((arrow) => {
        //posiotin
        let cell = arrow.parentNode;
        let position = getCellPosition(cell);
        
        x = position[0];
        y = position[1];

        //direction  this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let directions = ['up','down','left','right']
        for(let i = 1; i < 4; ++i) {
            if (arrow.contains(directions[i])){
                
            }
        }
    })

}


// 다른 공간에서 화살표를 가져왔다고 생각하고 추가.
let tempdiv = document.createElement('img');
tempdiv.src = "../img/rlboard/arrow/up.png";
tempdiv.classList.add(".arrow");
tempdiv.classList.add(".up");
setDraggable(tempdiv);

let y = 0;
let x = 3;

boardDom.querySelectorAll(".cell")[10*y + x].appendChild(tempdiv)


// drag 중인 객체 이동
const cells = boardDom.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
        e.preventDefault();
        let draggable = boardDom.querySelector(".dragging");
        if (draggable == null) {
            return;
        }

        if (cell.childElementCount === 0) {
            cell.appendChild(draggable);
        }
    });
});


// Add btn event
let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;

    state = game.environment.reset();
    while (!done) {
        done = game.environment.step(0);
        done = true;
    }
    game.run_test(1).then(() => {
        btnTest.disabled = false;
    });
});
