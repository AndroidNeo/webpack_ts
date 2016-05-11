/**
 * Created by Artur on 02.05.16.
 */

import {Cell} from './cell';
import {Tile} from './tile';
import {TilesBlock} from './tilesblock';
import {MoveDirection} from './movedirection';
import {CGPoint, CGVector} from '../objc/objc_types';
import {Levels} from "./levels";

export class Model {

    static kModelCellLength:      number = 1.0;
    static kModelMaxMove:         number = 0.15;
    static eps:                   number = Model.kModelCellLength * 0.000001;
    static kModelDeltaTileOnCell: number = Model.kModelCellLength / 5.0;

    gameField:        Cell[][];
    detectBreakField: boolean[][];
    tiles:            Tile[];

    sizeN: number;
    sizeM: number;

    width:  number;
    height: number;

    isTouchTileBegan: boolean;

    tilesBlocks: TilesBlock[];

    moveDirection = new MoveDirection();

    constructor(levelNumber: number) {

        this.detectBreakField = [];
        this.isTouchTileBegan = false;
        this.tilesBlocks = [];
        this.tiles = [];
        this.gameField = [];

        this.sizeN = 0;
        this.sizeM = 0;

        this.width = 0;
        this.height = 0;

        let level = Levels.getLevelByNumber(levelNumber);

        console.log(level);

        this.sizeN = level.length;
        this.sizeM = level[0].length;

        this.initGameField();

        for (let i = 0; i < this.sizeN; i++) {
            for (let j = 0; j < this.sizeM; j++) {

                let cellContent = level[i][j];
                let cellContentObject = this.getCellContentObject(cellContent);

                if (cellContentObject.w) {
                    this.gameField[i][j].type = Cell.kCellWall;
                } else if (cellContentObject.c > 0) {
                    this.gameField[i][j].makePlayCellWithNumber(cellContentObject.c);
                }

                if (cellContentObject.t > 0) {
                    this.tiles.push(new Tile(cellContentObject.t, Model.getPositionOnGameFieldByIndexIJ(i,j)));
                }

            }
        }

        for (let tile of this.tiles) {
            Model.setIndexesForTileByCenter(tile);
        }

        this.setPropertyOnValidCellForTiles(this.tiles);

    }

    getCellContentObject(cellContent) {

        let result = {
            'f': false,
            'w': false,
            'c': 0,
            't': 0
        };

        let idx_c = cellContent.indexOf('c');
        let idx_t = cellContent.indexOf('t');

        if (cellContent === 'w') {
            result.w = true;
        } else {

            if (cellContent.indexOf('f') >= 0) {
                result.f = true;
            } else if (idx_c >= 0) {
                let c_str = cellContent.substr(idx_c + 1, 1);
                let c_str_next = cellContent.substr(idx_c + 2, 1);
                result.c = parseInt(c_str) + (this.isNumeric(c_str_next) ? parseInt(c_str_next) : 0);
            }

            if (idx_t >= 0) {
                let t_str = cellContent.substr(idx_t + 1, 1);
                let t_str_next = cellContent.substr(idx_t + 2, 1);
                result.t = parseInt(t_str) + (this.isNumeric(t_str_next) ? parseInt(t_str_next) : 0);
            }

        }

        return result;

    }

    isNumeric(n:string) {
        return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
    }


    static getPositionOnGameFieldByIndexIJ(i: number, j: number) {
        return CGPoint.Make((j + 0.5) * Model.kModelCellLength, (i + 0.5) * Model.kModelCellLength);
    }

    static getIndexIForPoint(point: CGPoint) {
        return Math.floor(point.y / Model.kModelCellLength);
    }

    static getIndexJForPoint(point: CGPoint) {
        return Math.floor(point.x / Model.kModelCellLength);
    }

    static setIndexesForTileByCenter(tile: Tile) {
        tile.i = Model.getIndexIForPoint(tile.center);
        tile.j = Model.getIndexJForPoint(tile.center);
    }

    initGameField() {

        this.width  = this.sizeM * Model.kModelCellLength;
        this.height = this.sizeN * Model.kModelCellLength;

        this.gameField = [];

        for (let i = 0; i < this.sizeN; i++) {
            let row: Cell[] = [];
            for(let j = 0; j < this.sizeM; j++) {
                let center = Model.getPositionOnGameFieldByIndexIJ(i, j);
                let cell = new Cell(center, i, j, Cell.kCellFree);
                row.push(cell);
            }
            this.gameField.push(row);
        }

    }

    setPropertyOnValidCellForTilesBlock(tilesBlock:TilesBlock) {

        this.setPropertyOnValidCellForTiles(tilesBlock.getTiles());

    }

    setPropertyOnValidCellForTiles(tilesArray: Tile[]) {
        for(let tile of tilesArray) {
            let cell = this.gameField[tile.i][tile.j];
            tile.onValidCell = (cell.type === Cell.kCellPlay && cell.numberValue === tile.numberValue);
        }
    }

    getSizeN() {
        return this.sizeN;
    }

    getSizeM() {
        return this.sizeM;
    }

    isValidIndexIJ(i:number, j:number) {
        return (i >= 0 && j >= 0 && i < this.sizeN && j < this.sizeM);
    }

    getGameField() {
        return this.gameField;
    }

    getTileByIndexIJ(i: number, j:number) {
        let result:Tile;
        for(let tile of this.tiles) {
            if (tile.i === i && tile.j === j) {
                result = tile;
                break;
            }
        }
        return result;
    }

    getTiles() {
        return this.tiles;
    }

    touchTileBegan() {
        this.isTouchTileBegan = true;
    }

    didMoveTile(movedTile:Tile, sVector:CGVector) {

        let s = sVector;
        this.makeCorrectMoveVector(s);
        this.calculateMoveDirection(s);

        let isFirstMoveTheTile = this.isTouchTileBegan;
        if (isFirstMoveTheTile) {
            this.groupTilesInBlocksByTile(movedTile);
            this.isTouchTileBegan = false;
        }

        let touchedTilesBlock = this.getTouchedTilesBlock();
        //console.log(touchedTilesBlock);
        touchedTilesBlock.moveByVector(s);

        let currentTilesBlock = touchedTilesBlock;

        let needMove = true;

        while (needMove) {

            needMove = false;

            for (let tilesBlock of this.tilesBlocks) {

                needMove = this.movedTilesBlockIntersectWithTilesBlock(currentTilesBlock, tilesBlock);

                if (needMove) {

                    this.setFineTilesPositionFor(tilesBlock, currentTilesBlock);

                    this.addTilesBlock(tilesBlock, currentTilesBlock);
                    break;

                }

            }

        }

        this.setIndexesForTilesInBlockByCenter(currentTilesBlock);

        let isMoveTilesBlockValidValue = this.isMoveTilesBlockValid(currentTilesBlock);

        if (isMoveTilesBlockValidValue) {
            this.setNewTilesCenterForTilesBlock(currentTilesBlock);
            this.setPropertyOnValidCellForTilesBlock(currentTilesBlock);
        } else {
            this.setTilesCenterBackForTilesBlock(currentTilesBlock);
            this.setIndexesForTilesInBlockByCenter(currentTilesBlock);
        }

    }

    setFineTilesPositionFor(tilesBlock:TilesBlock, currentTilesBlock:TilesBlock) {

        if (this.moveDirection.right) {

            let movedTile = currentTilesBlock.getLastTile();
            let k:number = 0;
            for (let tile of tilesBlock.getTiles()) {
                k += 1;
                tile.center = CGPoint.Make(movedTile.center.x + Model.kModelCellLength * k, movedTile.center.y);
            }

        } else if (this.moveDirection.down) {

            let movedTile = currentTilesBlock.getLastTile();
            let k:number = 0;
            for (let tile of tilesBlock.getTiles()) {
                k += 1;
                tile.center = CGPoint.Make(movedTile.center.x, movedTile.center.y + Model.kModelCellLength * k);
            }

        } else if (this.moveDirection.left) {

            let movedTile = currentTilesBlock.getFirstTile();
            let k:number = 0;
            for (let tile of tilesBlock.getTiles()) {
                k += 1;
                tile.center = CGPoint.Make(movedTile.center.x - Model.kModelCellLength * k, movedTile.center.y);
            }

        } else if (this.moveDirection.up) {

            let movedTile = currentTilesBlock.getFirstTile();
            let k:number = 0;
            for (let tile of tilesBlock.getTiles()) {
                k += 1;
                tile.center = CGPoint.Make(movedTile.center.x, movedTile.center.y - Model.kModelCellLength * k);
            }

        }

    }

    setNewTilesCenterForTilesBlock(tilesBlock: TilesBlock) {

        for(let tile of tilesBlock.getTiles()) {
            tile.previousCenter = tile.center;
        }

    }

    setTilesCenterBackForTilesBlock(tilesBlock: TilesBlock) {

        for(let tile of tilesBlock.getTiles()) {
            tile.center = tile.previousCenter;
        }

    }

    makeCorrectMoveVector(s:CGVector) {

        let maxmove = Model.kModelCellLength * Model.kModelMaxMove;
        if (Math.abs(s.dx) > maxmove) {
            s.dx = maxmove * s.dx / Math.abs(s.dx);
        }
        if (Math.abs(s.dy) > maxmove) {
            s.dy = maxmove * s.dy / Math.abs(s.dy);
        }

    }

    calculateMoveDirection(s:CGVector) {

        this.moveDirection.resetFields();

        this.moveDirection.isHorizontal = (Math.abs(s.dx) > Math.abs(s.dy));

        if (this.moveDirection.isHorizontal) {
            this.moveDirection.right = (s.dx > 0);
            this.moveDirection.left  = (s.dx < 0);
        } else {
            this.moveDirection.down = (s.dy > 0);
            this.moveDirection.up   = (s.dy < 0);
        }

    }

    groupTilesInBlocksByTile(movedTile:Tile) {

        this.tilesBlocks.splice(0, this.tilesBlocks.length);

        let minIdx:number    = 0;
        let maxIdx:number    = (this.moveDirection.isHorizontal ? this.sizeM : this.sizeM) - 1;
        let firstIdx:number  = this.moveDirection.isHorizontal ? movedTile.j : movedTile.i;
        let secondIdx:number = this.moveDirection.isHorizontal ? movedTile.i : movedTile.j;

        let isTiles = false;
        let tilesBlock:TilesBlock;

        for(let idx = minIdx; idx <= maxIdx; idx++) {

            let tile:Tile;
            if (this.moveDirection.isHorizontal) {
                tile = this.getTileByIndexIJ(secondIdx, idx);
            } else {
                tile = this.getTileByIndexIJ(idx, secondIdx);
            }

            if (tile) {

                if (isTiles === false) {
                    tilesBlock = new TilesBlock(this.moveDirection.isHorizontal);
                    isTiles = true;
                }

                tilesBlock.addTile(tile);
                if ((this.moveDirection.isHorizontal && tile.j === firstIdx && tile.i === secondIdx) || (this.moveDirection.isHorizontal === false && tile.i === firstIdx && tile.j === secondIdx)) {
                    tilesBlock.setTouched(true);
                }

                let isLastIndex = (idx === maxIdx);
                if (isLastIndex) {
                    this.tilesBlocks.push(tilesBlock);
                }

            } else if (isTiles) {

                isTiles = false;
                this.tilesBlocks.push(tilesBlock);

            }

        }

    }

    setTilesOnGameField() {

        for(let tile of this.tiles) {
            tile.center = Model.getPositionOnGameFieldByIndexIJ(tile.i, tile.j);
        }

    }

    getTouchedTilesBlock() {
        let result:TilesBlock;
        for (let tilesBlock of this.tilesBlocks) {
            if (tilesBlock.getTouched()) {
                result = tilesBlock;
                break;
            }
        }
        return result;
    }

    setIndexesForTilesInBlockByCenter(tilesBlock:TilesBlock) {

        for (let tile of tilesBlock.getTiles()) {

            let indexes = tilesBlock.getFineIndexesForTile(tile);
            tile.i = indexes.i;
            tile.j = indexes.j;

        }

    }

    movedTilesBlockIntersectWithTilesBlock(tb1: TilesBlock, tb2: TilesBlock) {

        let result:boolean = false;

        let isDifferentBlocks = (tb1 !== tb2); // .isEqual()

        if (isDifferentBlocks) {

            if (this.moveDirection.right) {

                let tile1_right = tb1.getLastTile();
                let tile2_left  = tb2.getFirstTile();

                result = tile1_right.center.x + Model.eps < tile2_left.center.x && tile2_left.center.x - tile1_right.center.x < Model.kModelCellLength - Model.eps;

            } else if (this.moveDirection.down) {

                let tile1_bottom = tb1.getLastTile();
                let tile2_top    = tb2.getFirstTile();

                result = tile1_bottom.center.y + Model.eps < tile2_top.center.y && tile2_top.center.y - tile1_bottom.center.y < Model.kModelCellLength - Model.eps;

            } else if (this.moveDirection.left) {

                let tile1_left  = tb1.getFirstTile();
                let tile2_right = tb2.getLastTile();

                result = tile2_right.center.x + Model.eps < tile1_left.center.x && tile1_left.center.x - tile2_right.center.x < Model.kModelCellLength - Model.eps;

            } else if (this.moveDirection.up) {

                let tile1_top    = tb1.getFirstTile();
                let tile2_bottom = tb2.getLastTile();

                result = tile2_bottom.center.y + Model.eps < tile1_top.center.y && tile1_top.center.y - tile2_bottom.center.y < Model.kModelCellLength - Model.eps;

            }

        }

        return result;

    }

    addTilesBlock(tb1:TilesBlock, tb2:TilesBlock) {

        let addingTiles = tb1.getTiles();

        for(let tile of addingTiles) {
            tb2.addTile(tile);
        }

        let idx = this.tilesBlocks.indexOf(tb1);

        this.tilesBlocks.splice(idx, 1);

    }

    isMoveTilesBlockValid(tilesBlock: TilesBlock) {

        let result = true;

        if (this.needAnalizeValidMove(tilesBlock)) {

            if (result) {
                if (this.detectIntersectUnfreeCellWithTilesBlock(tilesBlock)) {
                    result = false;
                }
            }

            if (result) {
                if (this.detectBreakTilesByMovedTilesBlock(tilesBlock)) {
                    result = false;
                }
            }

        }

        return result;

    }

    needAnalizeValidMove(tilesBlock: TilesBlock) {

        let result = true;

        let i:number = -1;
        let j:number = -1;

        if (this.moveDirection.right) {

            let tile = tilesBlock.getLastTile();
            let frontPoint = CGPoint.Make(tile.center.x + Model.kModelCellLength / 2, tile.center.y);

            i = Model.getIndexIForPoint(frontPoint);
            j = Model.getIndexJForPoint(frontPoint);

            if (this.isValidIndexIJ(i, j)) {

                let cell = this.gameField[i][j];

                let delta = frontPoint.x - (cell.center.x - Model.kModelCellLength / 2);
                result = (delta > Model.kModelDeltaTileOnCell);

            }


        } else if (this.moveDirection.down) {

            let tile = tilesBlock.getLastTile();
            let frontPoint = CGPoint.Make(tile.center.x, tile.center.y + Model.kModelCellLength / 2);

            i = Model.getIndexIForPoint(frontPoint);
            j = Model.getIndexJForPoint(frontPoint);

            if (this.isValidIndexIJ(i,j)) {

                let cell = this.gameField[i][j];

                let delta = frontPoint.y - (cell.center.y - Model.kModelCellLength / 2);
                result = (delta > Model.kModelDeltaTileOnCell);

            }

        } else if (this.moveDirection.left) {

            let tile = tilesBlock.getFirstTile();
            let frontPoint = CGPoint.Make(tile.center.x - Model.kModelCellLength / 2, tile.center.y);

            i = Model.getIndexIForPoint(frontPoint);
            j = Model.getIndexJForPoint(frontPoint);

            if (this.isValidIndexIJ(i,j)) {

                let cell = this.gameField[i][j];

                let delta = (cell.center.x + Model.kModelCellLength / 2) - frontPoint.x;
                result = (delta > Model.kModelDeltaTileOnCell);

            }

        } else if (this.moveDirection.up) {

            let tile = tilesBlock.getFirstTile();
            let frontPoint = CGPoint.Make(tile.center.x, tile.center.y - Model.kModelCellLength / 2);

            i = Model.getIndexIForPoint(frontPoint);
            j = Model.getIndexJForPoint(frontPoint);

            if (this.isValidIndexIJ(i,j)) {

                let cell = this.gameField[i][j];

                let delta = (cell.center.y + Model.kModelCellLength / 2) - frontPoint.y;
                result = (delta > Model.kModelDeltaTileOnCell);

            }

        }

        return result;

    }

    detectIntersectUnfreeCellWithTilesBlock(tilesBlock: TilesBlock) {

        let result = true;

        let frontPoint:CGPoint;
        let tile:Tile;

        if (this.moveDirection.right) {

            tile = tilesBlock.getLastTile();
            frontPoint = CGPoint.Make(tile.center.x + Model.kModelCellLength / 2, tile.center.y);

        } else if (this.moveDirection.down) {

            tile = tilesBlock.getLastTile();
            frontPoint = CGPoint.Make(tile.center.x, tile.center.y + Model.kModelCellLength / 2);

        } else if (this.moveDirection.left) {

            tile = tilesBlock.getFirstTile();
            frontPoint = CGPoint.Make(tile.center.x - Model.kModelCellLength / 2, tile.center.y);

        } else if (this.moveDirection.up) {

            tile = tilesBlock.getFirstTile();
            frontPoint = CGPoint.Make(tile.center.x, tile.center.y - Model.kModelCellLength / 2);

        }

        let i = Model.getIndexIForPoint(frontPoint);
        let j = Model.getIndexJForPoint(frontPoint);

        if (this.isValidIndexIJ(i,j)) {

            let cell = this.gameField[i][j];
            //if (cell != nil && cell.type != Cell.kCellWall) {
            if (cell.type !== Cell.kCellWall) {
                result = false;
            }

        }

        return result;

    }

    detectBreakTilesByMovedTilesBlock(tilesBlock: TilesBlock) {

        let result = false;

        this.detectBreakField = [];

        for(let i = 0; i < this.sizeN; i++) {
            let row:boolean[] = [];
            for(let j = 0; j < this.sizeM; j++) {
                row.push(false);
            }
            this.detectBreakField.push(row);
        }

        for(let tile of this.tiles) {
            tile.iNext = tile.i;
            tile.jNext = tile.j;
        }

        let firstTile = tilesBlock.getFirstTile();

        let indexes = tilesBlock.getFineIndexesForTile(firstTile);
        let iCurrent = indexes.i;
        let jCurrent = indexes.j;

        let cell = this.gameField[iCurrent][jCurrent];

        let dI:number = 0;
        let dJ:number = 0;

        if (Math.abs(firstTile.center.x - cell.center.x) > Model.eps) {
            if (this.moveDirection.right && firstTile.center.x > cell.center.x && this.isValidIndexIJ(iCurrent,jCurrent + 1)) {
                dJ += 1;
            } else if (this.moveDirection.left && firstTile.center.x < cell.center.x && this.isValidIndexIJ(iCurrent, jCurrent - 1)){
                dJ -= 1;
            }
        }

        if (Math.abs(firstTile.center.y - cell.center.y) > Model.eps) {
            if (this.moveDirection.down && firstTile.center.y > cell.center.y && this.isValidIndexIJ(iCurrent + 1,jCurrent)) {
                dI += 1;
            } else if (this.moveDirection.up && firstTile.center.y < cell.center.y && this.isValidIndexIJ(iCurrent - 1,jCurrent)) {
                dI -= 1;
            }
        }

        for (let tile of tilesBlock.getTiles()) {

            tile.iNext = tile.iNext + dI;
            tile.jNext = tile.jNext + dJ;

        }

        for (let tile of this.tiles) {
            this.detectBreakField[tile.iNext][tile.jNext] = true;
        }

        let tile = this.tiles[0];
        this.resetCellForIndexIJ(tile.iNext, tile.jNext);

        for (let i = 0; i < this.sizeN; i++) {
            for (let j = 0; j < this.sizeM; j++) {
                if (this.detectBreakField[i][j] === true) {
                    result = true;
                    break;
                }
            }
        }

        return result;

    }

    resetCellForIndexIJ(i:number, j:number) {

        if (this.detectBreakField[i][j] === true) {

            this.detectBreakField[i][j] = false;

            if (this.isValidIndexIJ(i - 1, j)) {
                this.resetCellForIndexIJ(i - 1, j);
            }

            if (this.isValidIndexIJ(i + 1, j)) {
                this.resetCellForIndexIJ(i + 1, j);
            }

            if (this.isValidIndexIJ(i, j - 1)) {
                this.resetCellForIndexIJ(i, j - 1);
            }

            if (this.isValidIndexIJ(i, j + 1)) {
                this.resetCellForIndexIJ(i, j + 1);
            }

        }

    }

}
