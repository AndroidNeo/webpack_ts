/**
 * Created by Artur on 02.05.16.
 */

import {CGPoint} from "../objc/objc_types";

export class Cell {

    static kCellWall: number = 0;
    static kCellFree: number = 1;
    static kCellPlay: number = 2;

    center: CGPoint = new CGPoint(0,0);

    i: number = 0;
    j: number = 0;

    type:        number = 0;
    numberValue: number = 0;

    constructor(center: CGPoint, i: number, j: number, cellType: number) {

        this.center = center;
        this.i = i;
        this.j = j;
        this.type = cellType;
        this.numberValue = 0;

    }

    makePlayCellWithNumber(numberValue: number) {
        this.numberValue = numberValue
        this.type        = Cell.kCellPlay
    }

}
