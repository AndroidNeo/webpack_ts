import * as $ from 'jquery';import * as $ from 'jquery';
import {Model} from '../model/model';
import {ViewMethods} from './viewmethods';
import {CGSize, CGPoint, CGVector} from '../objc/objc_types';
import {TileView} from './tileview';
import {CellView} from './cellview';

/**
 * Created by Artur on 04.05.16.
 */

export class GameView {

    model: Model;

    mainScreen: JQuery;

    sizeN: number;
    sizeM: number;

    cellViewLength:  number;
    originViewPoint: CGPoint;
    kModelToView:    number;
    
    tileViews: TileView[];

    previousTouchPoint: CGPoint;
    currentTouchPoint:  CGPoint;

    moveDirection:       CGVector;
    moveDirectionDefine: boolean;

    constructor(levelNumber: number) {
        this.model = new Model(levelNumber);
    }
    
    createView() {

        ViewMethods.clearScreen();
        ViewMethods.setScreenSize();

        this.mainScreen = ViewMethods.getMainScreen();

        this.sizeN = this.model.getSizeN();
        this.sizeM = this.model.getSizeM();

        let size = CGSize.Make(this.mainScreen.width(), this.mainScreen.height());

        console.log(this.mainScreen);
        console.log(size);

        this.cellViewLength = size.width / this.sizeM;
        let yShift = (size.height - this.cellViewLength * this.sizeN) / 2;
        this.originViewPoint = CGPoint.Make(0, yShift);

        this.kModelToView = this.cellViewLength / Model.kModelCellLength;

        this.addCells();
        this.addTiles();
        this.addEventListeners();

    }

    addCells() {

        let gameField = this.model.getGameField();

        for (let i = 0; i < this.sizeN; i++) {
            for (let j = 0; j < this.sizeM; j++) {

                let cell     = gameField[i][j];
                let cellView = new CellView(cell, this);
                this.mainScreen.append(cellView.data);

            }
        }

    }

    addTiles() {

        this.tileViews = [];

        for (let tile of this.model.getTiles()) {

            let tileView = new TileView(tile, this);
            this.tileViews.push(tileView);
            this.mainScreen.append(tileView.data);

        }

    }

    addEventListeners() {

        for (let tileView of this.tileViews) {


            $(tileView.getId()).on('touchstart', function ($event) {

                console.log('start!!!');

                let event: any          =  $event.originalEvent;
                this.previousTouchPoint = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);

                this.moveDirectionDefine = false;
                this.moveDirection       = CGVector.Make(0, 0);

                this.model.touchTileBegan();

            });

            console.log('create on start', $(tileView.getId()));

        }

        for (let tileView of this.tileViews) {

            $(tileView.getId()).on('touchmove', function ($event) {

                let event: any         =  $event.originalEvent;
                this.currentTouchPoint = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);

                var s = CGVector.MakeByPoints(this.previousTouchPoint, this.currentTouchPoint);

                if (this.moveDirectionDefine === false) {

                    if (Math.abs(s.dx) > Math.abs(s.dy)) {
                        this.moveDirection = CGVector.Make(1, 0);
                    } else {
                        this.moveDirection = CGVector.Make(0, 1);
                    }

                    this.moveDirectionDefine = true;
                }

                s.dx = s.dx * this.moveDirection.dx;
                s.dy = s.dy * this.moveDirection.dy;

                let isMoveValid = (Math.abs(s.dx) > 0 || Math.abs(s.dy) > 0);
                if (isMoveValid) {

                    let sModel = CGVector.Make(s.dx / this.kModelToView, s.dy / this.kModelToView);
                    this.model.didMoveTile(tileView.tile, sModel);
                    this.updateTiles();

                }

                this.previousTouchPoint = this.currentTouchPoint;

            });

        }

        for (let tileView of this.tileViews) {

            $(tileView.getId()).on('touchend', function ($event) {

                this.model.setTilesOnGameField();
                this.updateTiles();
            
            });

        }

    }

    updateTiles() {
        for (let tileView of this.tileViews) {
            let tileCenter = tileView.tile.center;
            let center = CGPoint.Make(this.originViewPoint.x + this.kModelToView * tileCenter.x,
                                      this.originViewPoint.y + this.kModelToView * tileCenter.y);
            $('#tile-'+tileView.tile.numberValue).offset({left: center.x, top: center.y});
        }
    }

//     override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
//
//         self.moveDirectionDefine = false;
//         self.moveDirection = CGVectorMake(0, 0);
//
//         if let touch = touches.first {
//             if (touch.view != nil && (touch.view?.isKindOfClass(TileView))!) {
//                 self.model.touchTileBegan()
//             }
//         }
//
//         super.touchesBegan(touches, withEvent: event);
//
//     }
//
//     override func touchesMoved(touches: Set<UITouch>, withEvent event: UIEvent?) {
//
//         if let touch = touches.first {
//             if (touch.view != nil && touch.view!.isKindOfClass(TileView)) {
//                 let a2 = touch.locationInView(self)
//                 let a1 = touch.previousLocationInView(self)
//                 var s = CGVectorMake(a2.x - a1.x, a2.y - a1.y);
//
//                 if (self.moveDirectionDefine == false) {
//
//                     if (abs(s.dx) > abs(s.dy)) {
//                         self.moveDirection = CGVectorMake(1, 0);
//                     } else {
//                         self.moveDirection = CGVectorMake(0, 1);
//                     }
//
//                     self.moveDirectionDefine = true;
//                 }
//
//                 s.dx = s.dx * self.moveDirection.dx;
//                 s.dy = s.dy * self.moveDirection.dy;
//
//                 let isMoveValid = (abs(s.dx) > 0 || abs(s.dy) > 0)
//                 if isMoveValid {
//
//                     let sModel = CGVectorMake(s.dx / self.kModelToView, s.dy / self.kModelToView);
//                     let tileView = (touch.view as? TileView);
//                     self.model.didMoveTile(tileView!.tile!, byVector: sModel);
//                     self.updateTiles()
//
//                 }
//
//             }
//         }
//
//         super.touchesMoved(touches, withEvent:event);
//     }
//
//     override func touchesEnded(touches: Set<UITouch>, withEvent event: UIEvent?) {
//
//         self.model.setTilesOnGameField()
//         self.updateTiles()
//
//         super.touchesEnded(touches, withEvent: event)
//
//     }




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
