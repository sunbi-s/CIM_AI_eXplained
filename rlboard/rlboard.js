import { clamp, Position } from "./utill.js";

const MAX_HEIGHT = 6;

export class Environment{
    constructor(div, config) {
        this.boardShape = config.boardShape;
        this.actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.div = div;
        this.config = config;

        if (div) {
            this._makeBoard();
        }
    }

    _makeBoard() {
        // make board
        this.div.style.height = 50 * this.boardShape[0] + "px";
        this.div.style.width = 50 * this.boardShape[1] + "px";
        for (let y=0; y<this.boardShape[0]; ++y) {
            let row = document.createElement('div');
            row.classList.add("row");
            row.style.width = 50 * this.boardShape[1] + "px";
            this.div.appendChild(row);
            for (let x=0; x<this.boardShape[0]; ++x) {
                let cell = document.createElement('div');
                cell.classList.add("cell");
                if (x === this.boardShape[1] - 1 && y === this.boardShape[0] - 1) {
                    cell.style.backgroundImage = "url('img/rlboard/background/background_" + (MAX_HEIGHT * MAX_HEIGHT).toString() + ".jpg')";
                } else if (x === this.boardShape[1] - 1) {
                    cell.style.backgroundImage = "url('img/rlboard/background/background_" + ((y+1) * MAX_HEIGHT).toString() + ".jpg')";
                } else if (y === this.boardShape[0] - 1) {
                    cell.style.backgroundImage = "url('img/rlboard/background/background_" + ((MAX_HEIGHT-1) * MAX_HEIGHT + x + 1).toString() + ".jpg')";
                } else {
                    cell.style.backgroundImage = "url('img/rlboard/background/background_" + (y * MAX_HEIGHT + x + 1).toString() + ".jpg')";
                }
                row.appendChild(cell);
            }
        }

        // make nodes
        for (let i=0; i<this.config.nodes.length; ++i) {
            let [_position, _reward, _done, _path] = this.config.nodes[i];
            let position = new Position(_position[0], _position[1]);
            this.createPlace(position, i);
        }

        // make player
        let _position = this.config.agentStartPosition;
        let position = new Position(_position[0], _position[1]);
        this._createPlayer(position, this.config.agentImagePath);
    }

    _getCell(position) {
        return this.div.querySelectorAll(".cell")[this.boardShape[0] * position.y + position.x];
    }

    _get_player_position() {
        // find player position
        let cells = this.div.querySelectorAll(".cell");
        let index = Array.from(cells).findIndex((cell) => {
            return cell === this.player.parentNode;
        });
        let y = parseInt(index / this.boardShape[0]);
        let x = index % this.boardShape[0];
        let targetPos = new Position(y, x);
        return targetPos;
    }

    _movePlayer(action) {
        let targetPos = this._get_player_position();

        // update player position
        targetPos.y = targetPos.y + this.actions[action][0]
        targetPos.x = targetPos.x + this.actions[action][1]

        // check action validity
        if (targetPos.y < 0 || targetPos.y > this.boardShape[0] - 1){
            console.log("Error: invalid y action")
            targetPos.y = clamp(targetPos.y, 0, this.boardShape[0] - 1);
        }

        if (targetPos.x < 0 || targetPos.x > this.boardShape[1] - 1){
            console.log("Error: invalid x action")
            targetPos.x = clamp(targetPos.x, 0, this.boardShape[1] - 1);
        }

        // append player into target cell
        let targetCell = this._getCell(targetPos);
        targetCell.insertBefore(this.player, targetCell.firstChild);

        return [targetPos, targetCell];
    }

    reset() {
        let position = new Position(this.config.agentStartPosition[0], this.config.agentStartPosition[1]);
        let player = this.div.querySelector(".player");
        let cell = this._getCell(position);
        cell.insertBefore(player, cell.firstChild);
        return position.get();
    }

    step(action) {
        let reward = this.config.defaultReward;
        let done = false;

        // compute reward
        let CurrentPos = this._get_player_position();
        let currentCell = this._getCell(CurrentPos);
        let curr_place = currentCell.lastChild;
        if (curr_place.classList.contains("place")) {
            reward += curr_place.reward;
        }

        // move player
        let [position, cell] = this._movePlayer(action);
        let next_state = position.get();

        // check state
        let place = cell.lastChild;
        if (place.classList.contains("place")) {
            done = place.done;
        }

        return [next_state, reward, done]
    }

    moveNode(node, targetPos) {
        let targetCell = this._getCell(targetPos);
        targetCell.appendChild(node);
    }

    createPlace(targetPos, index) {
        let [_position, _reward, _done, _path] = this.config.nodes[index];

        // create dom element
        let place = document.createElement('img');
        place.draggable = false;
        place.classList.add("place");
        place.reward = _reward;
        place.done = _done;
        place.imagePath = _path;
        place.setAttribute("placeIndex", index);

        // append node into target position
        let cell = this._getCell(targetPos);
        cell.appendChild(place);
        return place;
    }

    _createPlayer(targetPos, imagePath) {
        let player = document.createElement('img');
        player.draggable = false;
        player.classList.add("player");
        player.imagePath = imagePath;
        player.imageIndex = 0;
        let cell = this._getCell(targetPos);
        cell.appendChild(player);
        this.player = player;
    }

    render() {
        // render nodes
        let places = this.div.querySelectorAll(".place");
        places.forEach((place) => {
            place.src = place.imagePath;
        });

        // render player
        let player = this.div.querySelector(".player");
        player.src = player.imagePath[player.imageIndex % player.imagePath.length];
        player.imageIndex = (player.imageIndex + 1) % player.imagePath.length;
    }
}
