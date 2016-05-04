/**
 * Created by Artur on 02.05.16.
 */

export class CGPoint {

    x: number = 0;
    y: number = 0;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static Make(x: number, y: number) {
        return new CGPoint(x, y);
    }
}

export class CGVector {

    dx: number = 0;
    dy: number = 0;

    constructor (dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    }

    static Make(x: number, y: number) {
        return new CGVector(x, y);
    }
}

export class CGSize {

    width:  number = 0;
    height: number = 0;

    constructor (width: number, height: number) {
        this.width  = width;
        this.height = height;
    }

    static Make(width: number, height: number) {
        return new CGSize(width, height);
    }

}