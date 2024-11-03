import { Vector2 } from "three";

export default class Orientation extends Vector2 {
    constructor(h = 0, v = 0) {
        super();
        this.x = h;
        this.y = v;
    }

    get h() {
        return this.x;
    }

    set h(value) {
        this.x = value;
    }

    get v() {
        return this.y;
    }

    set v(value) {
        this.y = value;
    }
}