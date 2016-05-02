/**
 * Created by Artur on 02.05.16.
 */

import {CGPoint} from "../objc/objc_types";

export class Tile {

    i: number = 0;
    j: number = 0;
    iNext: number = 0;
    jNext: number = 0;

    numberValue: number = 0;

    center:         CGPoint = new CGPoint(0,0);
    previousCenter: CGPoint = new CGPoint(0,0);

    onValidCell: boolean = false;

    constructor(numberValue:number, center:CGPoint) {

        this.numberValue    = numberValue;
        this.center         = center;
        this.previousCenter = center;

    }


}
