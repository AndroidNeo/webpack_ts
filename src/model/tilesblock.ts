/**
 * Created by Artur on 02.05.16.
 */

import {CGPoint, CGVector} from "../objc/objc_types";
import {Tile} from "./tile";
import {Model} from "./model";


export class TilesBlock {

    isTouched:    boolean
    isHorizontal: boolean

    tilesInBlock: Tile[]

    constructor(isHorizontal: boolean) {
        this.isHorizontal = isHorizontal
        this.tilesInBlock = [];
        this.isTouched = false
    }

    addTile(tile: Tile) {
        this.tilesInBlock.push(tile)
        this.sortTiles();
    }

    sortTiles() {

        let tilesToSort = [Tile]();
        for(let tile of this.tilesInBlock) {
            tilesToSort.push(tile);
        }

        let sortedTiles:[Tile] = tilesToSort.sort(this.sortMethodForTiles);

        this.reset();

        for(let tile of sortedTiles) {
            this.tilesInBlock.push(tile);
        }

    }

        sortMethodForTiles(tile1:Tile, tile2:Tile) {
            return !((this.isHorizontal && tile1.center.x > tile2.center.x) || (this.isHorizontal == false && tile1.center.y > tile2.center.y))
    }

    reset() {
        this.tilesInBlock.splice(0, this.tilesInBlock.length);
    }

    setTouched(isTouchedValue: boolean) {
        this.isTouched = isTouchedValue
    }

    getTouched() {
        return this.isTouched
    }

    moveByVector(s: CGVector) {
        for (let tile:Tile in this.tilesInBlock) {
            tile.center = CGPoint.Make(tile.center.x + s.dx, tile.center.y + s.dy);
        }
    }

    getTiles() {
        return this.tilesInBlock;
    }

    getFirstTile() {
        return this.tilesInBlock[0];
    }

    getLastTile() {
        let n = this.tilesInBlock.length
        return this.tilesInBlock[n - 1]
    }

    getFineIndexesForTile(tile: Tile) {

        let first = this.getFirstTile();

        let i = Model.getIndexIForPoint(first.center);
        let j = Model.getIndexJForPoint(first.center);

        let idx = this.tilesInBlock.indexOf(tile);

        if (this.isHorizontal) {
            j = j + idx;
        } else {
            i = i + idx;
        }

        let result = {"i": i, "j": j}

        return result

}


}
