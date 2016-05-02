/**
 * Created by Artur on 02.05.16.
 */

export class MoveDirection {
    
    left:  boolean;
    right: boolean;
    up:    boolean;
    down:  boolean;
    
    isHorizontal: boolean;

    constructor() {
        
        this.left  = false;
        this.right = false;
        this.up    = false;
        this.down  = false;

        this.isHorizontal = false;
    }
    
}