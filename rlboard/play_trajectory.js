import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_6')
console.log(frame)
const board = frame.querySelector('#board');
board.style.cursor = 'pointer';

let policyName = "control";
let game = new Game(board, 0, policyName);
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


function make_action_table(){
    
    arrows = board.querySelectorAll(".arrow");
    
    arrows.forEach((arrow) =>{
        //posiotin
        cell = arrow.parentNode
        position = getCellPosition(cell)
        
        x = position[0]
        y = position[1]

        //direction  this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        directions = ['up','down','left','right']
        for(var i = 1; i <4; i++) {
            if (arrow.contains(directions[i])){
                
            }
        }
    })

}

//player
const playerDom = game.environment.player.dom;
playerDom.style.position = "absolute"

// 다른 공간에서 화살표를 가져왔다고 생각하고 추가.
let tempdiv = document.createElement('img');
tempdiv.src = "../img/rlboard/arrow/up.png"
tempdiv.classList.add(".arrow")
tempdiv.classList.add(".up")
tempdiv.classList.add("draggable")
//////////////////////////////////////////////////

let x = 3
let y = 0

board.querySelectorAll(".cell")[10*y + x].appendChild(tempdiv)
////////////////////////

// drag 중인 객체 구분
const draggables = board.querySelectorAll(".draggable");
draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
        console.log(draggable)
        draggable.classList.add("dragging");
    })
    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    });
});

// drag 중인 객체 이동
let cells = board.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggable = board.querySelector(".dragging");
        if (cell.childElementCount === 0) {
            cell.appendChild(draggable);
        } else if (draggable.classList.contains("player")) {
            // cell.insertBefore(draggable, cell.firstChild);
            cell.appendChild(draggable);
        }
    });
});

let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    btnTest.disabled = true;
    
    let done = false

    while(!done){
        let kd = environment.reset()
    }
    game.run_test(1).then(() => {
        btnTrain.disabled = false;
        btnTest.disabled = false;
    });
});