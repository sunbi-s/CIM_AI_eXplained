import { Position, Game, animate } from "./rlboard.js";

const frame = document.querySelector('#play_6')
const boardDom = frame.querySelector('.board');
boardDom.style.cursor = 'pointer';

let policyName = "user";
let game = new Game(boardDom, 0, policyName);
animate(game);
let env = game.environment
let agent = game.agent
let state = game.environment.reset();
let reward = 0;
let done = false;

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
    let action_table =  Array.from(Array(10), () => Array(10).fill(-1));
    let arrows = boardDom.getElementsByClassName(".arrow"); // 이거 array 아님
    Array.from(arrows).forEach((arrow) => {
     
        console.log(arrow.classList)
        //posiotin
        let cell = arrow.parentNode;
        let position = getCellPosition(boardDom, cell);
        
        let [x, y] = position.get()

        //direction  this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let directions = ['.up','.down','.left','.right']

        for(var i = 0; i < 4; ++i) {
            if (arrow.classList.contains(directions[i])){
                action_table[x][y] = i
            }
        }
    })

    agent.action_table = action_table
}


///
make_action_table();

// drag 중인 객체 이동
const cells = boardDom.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
        e.preventDefault();
        let draggable = frame.querySelector(".dragging");
        if (draggable == null) {
            return;
        }
        // 여기 바꿔야됨
        let drop = true
        // Array.from(cell.children).forEach((child) => {
        //     if(child.classList.contains('place')){
        //         drop = false
        //     }
        // })
        if (drop) {
            console.log(draggable);
            if (draggable.parentNode.classList.contains("cell")) {
                // move node
                cell.appendChild(draggable);
            } else
            if (draggable.parentNode.classList.contains("place_creator")) {
                // create node
                let copied_draggable = draggable.cloneNode(true);
                cell.appendChild(copied_draggable);
                setDraggable(copied_draggable);
                copied_draggable.classList.remove("dragging");

                console.log("create", copied_draggable);
            }
        }

        make_action_table();
    });
});


// Add place_creator event
const place_creator = frame.querySelector(".place_creator");

// Add dummy arrow into place_creator
for (const direction of ["up", "down", "left", "right"]) {
    let tempup = document.createElement('img');
    tempup.src = "../img/rlboard/arrow/" + direction + ".png";
    tempup.classList.add("arrow");
    tempup.classList.add(direction);
    setDraggable(tempup);
    tempup.index = 0;
    place_creator.appendChild(tempup);
}


// Add btn event
let btnTest = frame.querySelector('.btn_test');

btnTest.addEventListener("click", function() {
    console.log("run")
    game.run_user(1)
    console.log("end")
});

