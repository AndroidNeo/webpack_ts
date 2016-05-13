import * as $ from 'jquery';
require('./styl/test.styl')
import {Model} from './model/model';
import {CGPoint, CGVector, CGSize} from './objc/objc_types';
import {TileView} from './view/tileview';
import {CellView} from './view/cellview';

let model: Model;

let mainScreen: JQuery;

let sizeN: number;
let sizeM: number;

let cellViewLength:  number;
let halfCellViewLength:  number;
let originViewPoint: CGPoint;
let kModelToView:    number;

let tileViews: Object;

let previousTouchPoint: CGPoint;
let currentTouchPoint:  CGPoint;

let moveDirection:       CGVector;
let moveDirectionDefine: boolean;

$(document).ready(function() {

    let levelNumber = 1;
    model = new Model(levelNumber);

    mainScreen = $('#main_screen');
    let width = mainScreen.width();
    //console.log(mainScreen.height());
    mainScreen.height(width);

    sizeN = model.getSizeN();
    sizeM = model.getSizeM();

    let size = CGSize.Make(mainScreen.width(), mainScreen.height());

    cellViewLength = size.width / sizeM;
    halfCellViewLength = cellViewLength / 2;
    let yShift = (size.height - cellViewLength * sizeN) / 2;
    originViewPoint = CGPoint.Make(0, yShift);

    kModelToView = cellViewLength / Model.kModelCellLength;


    console.log(cellViewLength,halfCellViewLength,originViewPoint,kModelToView);


    addCells();
    addTiles();
    addEventListeners();
    updateTiles();

});

function addCells() {

    let params = {'cellViewLength':cellViewLength,
        'originViewPoint': originViewPoint};

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

    tileViews = {};

    for (let tile of model.getTiles()) {

        let tileView = new TileView(tile, params);
        //tileViews.push(tileView)
        tileViews[tileView.getId()] = tileView;
        mainScreen.append(tileView.data);

    }

}

function addEventListeners() {

    mainScreen.on('touchstart', function ($event) {

        $event.preventDefault();

        let event: any =  $event.originalEvent;

        let isTileViewID = TileView.checkIsTileViewID(event.target.id);
        if (isTileViewID) {

            previousTouchPoint = CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);

            moveDirectionDefine = false;
            moveDirection       = CGVector.Make(0, 0);

            model.touchTileBegan();

        }

    }).on('touchmove', function ($event) {

        $event.preventDefault();

        let event:any = $event.originalEvent;

        let isTileViewID = TileView.checkIsTileViewID(event.target.id);
        if (isTileViewID) {

            let targetID = '#' + event.target.id;

            let tileView = tileViews[targetID];

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

        }

    }).on('touchend', function ($event) {

        $event.preventDefault();

        model.setTilesOnGameField();
        updateTiles();

    });


}

function updateTiles() {

    for (let key in tileViews) {

        let tileView = tileViews[key];
        let tileCenter = tileView.tile.center;
        let center = CGPoint.Make(originViewPoint.x + kModelToView * tileCenter.x,
            originViewPoint.y + kModelToView * tileCenter.y);
        $(tileView.getId()).offset({left: center.x - halfCellViewLength, top: center.y - halfCellViewLength});

        let newClass = tileView.tile.onValidCell ? 'number-on-valid-cell' : 'number-out';
        let oldClass = tileView.tile.onValidCell ? 'number-out' : 'number-on-valid-cell';
        if (tileView.currentNumberClass !== newClass) {
            let numberID = tileView.getNumberID();
            $(numberID).toggleClass(oldClass, false);
            $(numberID).toggleClass(newClass, true);
            tileView.currentNumberClass = newClass;
        }

    }

}
