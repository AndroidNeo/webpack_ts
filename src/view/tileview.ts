import {Tile} from '../model/tile';
import {GameView} from './gameview';
/**
 * Created by Artur on 03.05.16.
 */

export class TileView {

    tile: Tile;
    data: string;
    
    constructor(tile: Tile, gameView: GameView) {
        
        this.tile = tile;
        
        this.data = `<div class="tile"
                    style="
                        width:`  + gameView.cellViewLength + `px;
                        height:` + gameView.cellViewLength + `px;
                        top:`    + gameView.originViewPoint.y + tile.i * gameView.cellViewLength + `px;
                        left:`   + gameView.originViewPoint.x + tile.j * gameView.cellViewLength + `px;
                    "
                    data-onvalidcell="` + (tile.onValidCell ? 1 : 0) + `"
                    data-number="`      + tile.numberValue + `"
                    `;

        this.data = this.data + 'id="tile-' + tile.numberValue + '"';

        this.data = this.data + `>`;

        this.data = this.data + `<span class="number">` + tile.numberValue + `</span>`;

        this.data = this.data + `</div>`;

    }
    
    getId() {
        return '#tile-' + this.tile.numberValue;
    }
    
}



// class TileView: UIView {
//
//     var label:UILabel?
//     var tile:Tile?
//
//         init(tile:Tile) {
//         super.init(frame: CGRectMake(0,0,0,0))
//         self.tile = tile
//         self.layer.borderWidth = 0.5
//         self.layer.borderColor = UIColor.blackColor().CGColor
//     }
//
//     required init?(coder aDecoder: NSCoder) {
//         fatalError("init(coder:) has not been implemented")
//     }
//
//     func addNumberLabel() {
//
//         let label = UILabel.init(frame: CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height))
//         label.text = String(self.tile!.number)
//         label.textAlignment = NSTextAlignment.Center
//         label.font = UIFont.systemFontOfSize(15.0 * self.bounds.size.height / 40.0)
//         label.textColor = UIColor.blackColor()
//         self.addSubview(label)
//         self.label = label
//
//     }
//
//
// }

/*



 */