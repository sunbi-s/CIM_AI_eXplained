export function rgb(r, g, b) {

    return  "rgb(" + r +"," + g + "," + b +")" 
}

export function rgba(r, g, b, alpha) {

    return  "rgb(" + r +"," + g + "," + b +","+alpha +")" 
}

export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}


export class Position {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    get() {
        return [this.y, this.x];
    }
}
