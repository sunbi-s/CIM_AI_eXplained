const MAX_HEIGHT = 6;

export class VTable {
    constructor(div, height, width) {
        this.div = div;
        this.boardShape = [height, width];
        this.data = [];
        for (let y = 0; y < this.boardShape[0]; ++y) {
            let row = [];
            for (let x = 0; x < this.boardShape[1]; ++x) {
                row.push(0);
            }
            this.data.push(row);
        }

        if (this.div) {
            // create dom elements
            this.div.style.height = 50 * this.boardShape[0] + "px";
            this.div.style.width = 50 * this.boardShape[1] + "px";
            for (let y=0; y<this.boardShape[0]; ++y) {
                let row = document.createElement('div');
                row.classList.add("row");
                row.style.width = 50 * this.boardShape[1] + "px";
                this.div.appendChild(row);
                for (let x=0; x<this.boardShape[1]; ++x) {
                    let cell = document.createElement('div');
                    cell.innerText = this.data[y][x].toFixed(2);
                    cell.classList.add("cell", "value");
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
        }

        // return proxy for indexing
        return new Proxy(this, {
            get(target, prop) {
                if (Number(prop) == prop && !(prop in target)) {
                    return target.data[prop];
                }
                return target[prop];
            }
        });
    }

    getCell(position) {
        return this.div.querySelectorAll(".value")[this.boardShape[0] * position.y + position.x];
    }

    flat() {
        return this.data.flat();
    }

    map(lambda) {
        return this.data.map(lambda);
    }
}
