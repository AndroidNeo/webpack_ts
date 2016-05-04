import {Model} from "../model/model";
import {ViewMethods} from "./viewmethods";
import {CGSize, CGPoint} from "../objc/objc_types";
import {Cell} from "../model/cell";

/**
 * Created by Artur on 04.05.16.
 */

export class GameView {

    model: Model;

    cellViewLength:  number;
    originViewPoint: CGPoint;
    kModelToView:    number;
    
    tileViews: TileViews[];

    constructor(levelNumber: number) {
        this.model = new Model(levelNumber);
    }
    
    createView() {

        ViewMethods.clearScreen();

        let mainScreen = ViewMethods.getMainScreen();

        // let screenWidth = mainScreen.width();
        // mainScreen.height(screenWidth);


        let size = CGSize.Make(mainScreen.width(), mainScreen.height());

        let sizeN = this.model.getSizeN();
        let sizeM = this.model.getSizeM();

        this.cellViewLength = size.width / sizeM;
        let yShift = (size.height - this.cellViewLength * sizeN) / 2;
        this.originViewPoint = CGPoint.Make(0, yShift);

        this.kModelToView = this.cellViewLength / Model.kModelCellLength;

        let gameField = self.model.getGameField();

        for (let i = 0; i < sizeN; i++) {
            for (let j = 0; j < sizeM; j++) {

                let cell:Cell = gameField[i][j];

                let cellView = `<div class="cell type-` + cell.type + `"
                                    style="
                                        width:` + this.cellViewLength + `px;
                                        height:` + this.cellViewLength + `px;
                                        top:` + this.originViewPoint.y + i * this.cellViewLength + `px;
                                        left:` + this.originViewPoint.x + j * this.cellViewLength + `px;
                                    "
                                    data-type="` + cell.type + `"
                                    data-number="` + cell.numberValue + `"
                                    `;

                if (cell.type == Cell.kCellPlay) {
                    cellView = cellView + 'id="cell-' + cell.numberValue + '"';
                }

                cellView = cellView + `>`;

                if (cell.type == Cell.kCellPlay) {
                    cellView = cellView + `<span class="number">` + cell.numberValue + `</span>`;
                }

                cellView = cellView + `</div>`;

                mainScreen.append(cellView);

            }
        }

        this.tileViews = [];

        for (let tile of this.model.getTiles()) {
            let tileView:TileView = TileView.init(tile: tile)
            tileView.frame = CGRectMake(0, 0, self.cellViewLength, self.cellViewLength)
            tileView.backgroundColor = UIColor.redColor();
            tileView.addNumberLabel()
            self.tileViews.append(tileView)
            self.addSubview(tileView)
        }

    }
        
        
        
        
        
        

    }


}


// let grid = $('.grid');
//
// let gridWidth = grid.width();
// // let gridHeight = grid.height();
//
// kModelToView = gridWidth/model.width;
// $('.grid').height(gridWidth);
// // let cellHeight = gridHeight/model.height;
//
// //document.createElement('<div class="cell"></div>');
// model.gameField.forEach(function(row, i){
//     row.forEach(function(cell, j){
//         // console.log(cell, i, j);
//
//
//         var cellDiv = `<div class="cell type-`+cell.type+`"
//                             style="
//                                 width:`+kModelToView+`px;
//                                 height:`+kModelToView+`px;
//                                 top:`+cell.i*kModelToView+`px;
//                                 left:`+cell.j*kModelToView+`px;
//                             "
//                             data-type="`+cell.type+`"
//                             data-number="`+cell.numberValue+`"
//                             `
//         if(cell.numberValue>0)
//             cellDiv = cellDiv + 'id="cell-'+cell.numberValue+'"';
//         cellDiv = cellDiv + `>`;
//
//         if(cell.numberValue>0)
//             cellDiv = cellDiv +`<span class="number">`+cell.numberValue+`</span>`;
//
//
//
//         cellDiv = cellDiv+`</div>`;
//
//         grid.append(cellDiv);
//     })
// })
//
// $('.cell').on('touchmove', function($event){
//     // console.log('touch move', $event.originalEvent.touches[0].pageX);
//     //console.log($event);
//     let event: any =  $event.originalEvent;
//     currentCoord = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);
//
//     let a2 = currentCoord;
//     let a1 = previousCoord;
//     var s  = CGVector.Make(a2.x - a1.x, a2.y - a1.y);
//
//     if (moveDirectionDefine === false) {
//
//         if (Math.abs(s.dx) > Math.abs(s.dy)) {
//             moveDirection = CGVector.Make(1, 0);
//         } else {
//             moveDirection = CGVector.Make(0, 1);
//         }
//
//         moveDirectionDefine = true;
//     }
//
//     s.dx = s.dx * moveDirection.dx;
//     s.dy = s.dy * moveDirection.dy;
//
//     let isMoveValid = (Math.abs(s.dx) > 0 || Math.abs(s.dy) > 0)
//     if (isMoveValid) {
//
//         let sModel = CGVector.Make(s.dx / kModelToView, s.dy / kModelToView);
//         //let tileView = (touch.view as? TileView);
//         model.didMoveTile(model.tiles[3], sModel);
//         //console.log(this);
//         //self.updateTiles()
//         cellSetPosition(this.id, kModelToView * model.tiles[3].center.x, kModelToView * model.tiles[3].center.y);
//
//     }
//
//     previousCoord = currentCoord;
//     //console.log(this.id, 'current cel id');
//
// }).on('touchstart', function($event){
//     //console.log('touch start', $event);
//     let event: any =  $event.originalEvent;
//     previousCoord = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);
//
//     moveDirectionDefine = false;
//     moveDirection = CGVector.Make(0, 0);
//
//     // if let touch = touches.first {
//     //     if (touch.view != nil && (touch.view?.isKindOfClass(TileView))!) {
//     model.touchTileBegan()
//     //     }
//     // }
//
//
// }).on('touchend', function($event){
//     //console.log('touch end', $event);
// })
//
//
// //demo cell position set
// cellSetPosition(1, 50,44);
//
// });
//
//
// function cellSetPosition(cellId, posX, posY){
//     $('#'+cellId).offset({left: posX, top: posY});
// }
