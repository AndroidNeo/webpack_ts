import {Tile} from '../model/tile';
/**
 * Created by Artur on 03.05.16.
 */

export class TileView {

    tile: Tile;
    data: string;
    currentNumberClass: string;
    
    constructor(tile: Tile, params: any) {
        
        this.tile = tile;
        
        this.data = `<div class="tile"
                    style="
                        width:`  + params.cellViewLength + `px;
                        height:` + params.cellViewLength + `px;
                        top:`    + params.originViewPoint.y + tile.i * params.cellViewLength + `px;
                        left:`   + params.originViewPoint.x + tile.j * params.cellViewLength + `px;
                    "
                    data-onvalidcell="` + (tile.onValidCell ? 1 : 0) + `"
                    data-number="`      + tile.numberValue + `"
                    `;

        this.data = this.data + 'id="tile-' + tile.numberValue + '"';

        this.data = this.data + `>`;

        let numberID = '"' + 'number-' + tile.numberValue + '"';

        this.data = this.data + `<span id=` + numberID + ` style="line-height: ${params.cellViewLength}px">` + tile.numberValue + `</span>`;

        this.data = this.data + `</div>`;

        //`
        //<div class="tile"
        //    style="width: "${params.cellViewLength}" + px
        //    >
        //</div>
        //`
    }
    
    getId() {
        return '#tile-' + this.tile.numberValue;
    }
    
    getNumberID() {
        return '#number-'+this.tile.numberValue;
    }

    static checkIsTileViewID(testID: string) {
        return (testID.substr(0,5) === 'tile-');
    }
}
