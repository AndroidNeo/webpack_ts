import {Cell} from '../model/cell';
import {GameView} from './gameview';
/**
 * Created by Artur on 05.05.16.
 */


export class CellView {

    cell: Cell;
    data: string;

    constructor(cell: Cell, params: any) {
        
        this.cell = cell;

        

        this.data = `<div class="cell type-` + cell.type + `"
                    style="
                        width:`  + params.cellViewLength + `px;
                        height:` + params.cellViewLength + `px;
                        top:`    + params.originViewPoint.y + cell.i * params.cellViewLength + `px;
                        left:`   + params.originViewPoint.x + cell.j * params.cellViewLength + `px;
                    "
                    data-type="`   + cell.type + `"
                    data-number="` + cell.numberValue + `"
                    `;

        // if (cell.type === Cell.kCellPlay) {
        //     this.data = this.data + 'id="cell-' + cell.numberValue + '"';
        // }

        this.data = this.data + `>`;

        if (cell.type === Cell.kCellPlay) {
            this.data = this.data + `<span class="number">` + cell.numberValue + `</span>`;
        }

        this.data = this.data + `</div>`;
            
            
        
    }


}