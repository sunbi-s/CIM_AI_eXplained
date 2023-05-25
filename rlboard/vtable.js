

export class VTable {
    constructor(div) {
        this.div = div;
        this.boardShape = [6, 6];
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
                for (let x=0; x<this.boardShape[0]; ++x) {
                    let cell = document.createElement('div');
                    cell.innerText = this.data[y][x].toFixed(2);
                    cell.classList.add("cell", "value");
                    cell.style.backgroundImage = "url('img/rlboard/background/background_" + (y * this.boardShape[0] + x + 1).toString() + ".jpg')";
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
