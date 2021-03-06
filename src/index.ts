import * as $ from 'jquery';
import {TestComponent} from './test.component/test.component';
require('./styl/test.styl')
import {Model} from './model/model';
import {Tile} from './model/tile';
import {CGPoint, CGVector, CGSize} from './objc/objc_types';
import {GameView} from './view/gameview';
import {TileView} from './view/tileview';
import {CellView} from './view/cellview';

let model: Model;

let mainScreen: JQuery;

let sizeN: number;
let sizeM: number;

let cellViewLength:  number;
let originViewPoint: CGPoint;
let kModelToView:    number;

let tileViews: TileView[];

let previousTouchPoint: CGPoint;
let currentTouchPoint:  CGPoint;

let moveDirection:       CGVector;
let moveDirectionDefine: boolean;

$(document).ready(function() {

    let levelNumber = 1;
    model = new Model(levelNumber);

    mainScreen = $('#main_screen');
    let width = mainScreen.width();
    mainScreen.height(width);

    sizeN = model.getSizeN();
    sizeM = model.getSizeM();

    let size = CGSize.Make(mainScreen.width(), mainScreen.height());

    cellViewLength = size.width / sizeM;
    let yShift = (size.height - cellViewLength * sizeN) / 2;
    originViewPoint = CGPoint.Make(0, yShift);

    kModelToView = cellViewLength / Model.kModelCellLength;

    addCells();
    addTiles();
    addEventListeners();

})



function addCells() {

    let params = {'cellViewLength':cellViewLength, 'originViewPoint': originViewPoint};

    let gameField = model.getGameField();

    for (let i = 0; i < sizeN; i++) {
        for (let j = 0; j < sizeM; j++) {

            let cell     = gameField[i][j];
            let cellView = new CellView(cell, params);
            mainScreen.append(cellView.data);

        }
    }

}

function addTiles() {

    let params = {'cellViewLength':cellViewLength, 'originViewPoint': originViewPoint};

    tileViews = [];

    for (let tile of model.getTiles()) {

        let tileView = new TileView(tile, params);
        tileViews.push(tileView);
        mainScreen.append(tileView.data);

    }

}

function addEventListeners() {

    for (let tileView of tileViews) {


        $(tileView.getId()).on('touchstart', function ($event) {

            let event: any          =  $event.originalEvent;
            previousTouchPoint = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);

            moveDirectionDefine = false;
            moveDirection       = CGVector.Make(0, 0);

            model.touchTileBegan();

        });

    }

    for (let tileView of tileViews) {

        $(tileView.getId()).on('touchmove', function ($event) {

            let event: any         =  $event.originalEvent;
            currentTouchPoint = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);

            var s = CGVector.MakeByPoints(previousTouchPoint, currentTouchPoint);

            if (moveDirectionDefine === false) {

                if (Math.abs(s.dx) > Math.abs(s.dy)) {
                    moveDirection = CGVector.Make(1, 0);
                } else {
                    moveDirection = CGVector.Make(0, 1);
                }

                moveDirectionDefine = true;
            }

            s.dx = s.dx * moveDirection.dx;
            s.dy = s.dy * moveDirection.dy;

            let isMoveValid = (Math.abs(s.dx) > 0 || Math.abs(s.dy) > 0);
            if (isMoveValid) {

                let sModel = CGVector.Make(s.dx / kModelToView, s.dy / kModelToView);
                model.didMoveTile(tileView.tile, sModel);
                updateTiles();

            }

            previousTouchPoint = currentTouchPoint;

        });

    }

    for (let tileView of tileViews) {

        $(tileView.getId()).on('touchend', function ($event) {

            model.setTilesOnGameField();
            updateTiles();

        });

    }

}

function updateTiles() {
    for (let tileView of tileViews) {
        let tileCenter = tileView.tile.center;
        let center = CGPoint.Make(originViewPoint.x + kModelToView * tileCenter.x,
            originViewPoint.y + kModelToView * tileCenter.y);
        $(tileView.getId()).offset({left: center.x, top: center.y});
    }
}







///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// рабочий вариант

// let model = new Model(1);
// let kModelToView:number = 0;
// let tile = new Tile(1, new CGPoint(3,5));
//
// let previousCoord:       CGPoint;
// let currentCoord:        CGPoint;
// let moveDirectionDefine: boolean;
// let moveDirection:       CGVector;
//
// $(document).ready(function() {
//
//
//     // console.log(model);
//     // console.log(tile);
//     // console.log('hello, world');
//
//     let grid = $('.grid');
//
//     let gridWidth = grid.width();
//    // let gridHeight = grid.height();
//
//     kModelToView = gridWidth/model.width;
//     $('.grid').height(gridWidth);
//    // let cellHeight = gridHeight/model.height;
//
//     //document.createElement('<div class="cell"></div>');
//     model.gameField.forEach(function(row, i){
//         row.forEach(function(cell, j){
//             // console.log(cell, i, j);
//
//
//             var cellDiv = `<div class="cell type-`+cell.type+`"
//                             style="
//                                 width:`+kModelToView+`px;
//                                 height:`+kModelToView+`px;
//                                 top:`+cell.i*kModelToView+`px;
//                                 left:`+cell.j*kModelToView+`px;
//                             "
//                             data-type="`+cell.type+`"
//                             data-number="`+cell.numberValue+`"
//                             `
//             if(cell.numberValue>0)
//                 cellDiv = cellDiv + 'id="cell-'+cell.numberValue+'"';
//             cellDiv = cellDiv + `>`;
//
//             if(cell.numberValue>0)
//                 cellDiv = cellDiv +`<span class="number">`+cell.numberValue+`</span>`;
//
//
//
//             cellDiv = cellDiv+`</div>`;
//
//             grid.append(cellDiv);
//         })
//     })
//
//     $('.cell').on('touchmove', function($event){
//         // console.log('touch move', $event.originalEvent.touches[0].pageX);
//         console.log($event);
//         let event: any =  $event.originalEvent;
//         currentCoord = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);
//
//         let a2 = currentCoord;
//         let a1 = previousCoord;
//         var s  = CGVector.Make(a2.x - a1.x, a2.y - a1.y);
//
//         if (moveDirectionDefine === false) {
//
//             if (Math.abs(s.dx) > Math.abs(s.dy)) {
//                 moveDirection = CGVector.Make(1, 0);
//             } else {
//                 moveDirection = CGVector.Make(0, 1);
//             }
//
//             moveDirectionDefine = true;
//         }
//
//         s.dx = s.dx * moveDirection.dx;
//         s.dy = s.dy * moveDirection.dy;
//
//         let isMoveValid = (Math.abs(s.dx) > 0 || Math.abs(s.dy) > 0)
//         if (isMoveValid) {
//
//             let sModel = CGVector.Make(s.dx / kModelToView, s.dy / kModelToView);
//             //let tileView = (touch.view as? TileView);
//             model.didMoveTile(model.tiles[3], sModel);
//             //console.log(this);
//             //self.updateTiles()
//             cellSetPosition(this.id, kModelToView * model.tiles[3].center.x, kModelToView * model.tiles[3].center.y);
//
//         }
//
//         previousCoord = currentCoord;
//         //console.log(this.id, 'current cel id');
//
//     }).on('touchstart', function($event){
//         //console.log('touch start', $event);
//         let event: any =  $event.originalEvent;
//         previousCoord = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);
//
//         moveDirectionDefine = false;
//         moveDirection = CGVector.Make(0, 0);
//
//         // if let touch = touches.first {
//         //     if (touch.view != nil && (touch.view?.isKindOfClass(TileView))!) {
//                 model.touchTileBegan()
//         //     }
//         // }
//
//
//     }).on('touchend', function($event){
//         //console.log('touch end', $event);
//     })
//
//
//     //demo cell position set
//     cellSetPosition(1, 50,44);
//
// });
//
//
// function cellSetPosition(cellId, posX, posY){
//     $('#'+cellId).offset({left: posX, top: posY});
// }
