/**
 * Created by Artur on 02.05.16.
 */

import {Cell} from "./cell";
import {Tile} from "./tile";
import {TilesBlock} from "./tilesblock";
import {MoveDirection} from "./movedirection";
import createCanvasForNode = fabric.createCanvasForNode;

class Model {

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
        this.tilesBlocks = []
        this.tiles = []
        this.gameField = []

        this.sizeN = 0
        this.sizeM = 0

        this.width = 0
        this.height = 0

        if (levelNumber == 1) {

            this.sizeN = 8;
            this.sizeM = 8;

            this.initGameField()

            for(let i = 0; i < this.sizeN; i++) {
                this.gameField[i][0].type = Cell.kCellWall;
                this.gameField[i][this.sizeM - 1].type = Cell.kCellWall
            }

            for(let j = 0; j < this.sizeM; j++) {
                this.gameField[0][j].type = Cell.kCellWall;
                this.gameField[this.sizeN - 1][j].type = Cell.kCellWall;
            }

            this.gameField[3][3].makePlayCellWithNumber(1)
            this.gameField[3][4].makePlayCellWithNumber(2)
            this.gameField[4][3].makePlayCellWithNumber(3)
            this.gameField[4][4].makePlayCellWithNumber(4)

            this.tiles.push(Tile.init(3, Model.getPositionOnGameFieldByIndexIJ(3,3)))
            this.tiles.push(Tile.init(1, Model.getPositionOnGameFieldByIndexIJ(3,4)))
            this.tiles.push(Tile.init(2, Model.getPositionOnGameFieldByIndexIJ(4,3)))
            this.tiles.push(Tile.init(4, Model.getPositionOnGameFieldByIndexIJ(4,4)))

            for (let tile in this.tiles) {
                Model.setIndexesForTileByCenter(tile)
            }

        } else if (levelNumber == 2) {

            this.sizeN = 8;
            this.sizeM = 8;

            this.initGameField()

            for(let i = 0; i < this.sizeN; i++) {
                this.gameField[i][0].type = Cell.kCellWall;
                this.gameField[i][this.sizeM - 1].type = Cell.kCellWall
            }

            for(let j = 0; j < this.sizeM; j++) {
                this.gameField[0][j].type = Cell.kCellWall;
                this.gameField[this.sizeN - 1][j].type = Cell.kCellWall;
            }

            this.gameField[3][3].makePlayCellWithNumber(1)
            this.gameField[3][4].makePlayCellWithNumber(2)
            this.gameField[4][3].makePlayCellWithNumber(3)
            this.gameField[4][4].makePlayCellWithNumber(4)
            this.gameField[5][3].makePlayCellWithNumber(5)
            this.gameField[5][4].makePlayCellWithNumber(6)

            this.tiles.append(Tile.init(3, Model.getPositionOnGameFieldByIndexIJ(3,3)))
            this.tiles.append(Tile.init(1, Model.getPositionOnGameFieldByIndexIJ(3,4)))
            this.tiles.append(Tile.init(2, Model.getPositionOnGameFieldByIndexIJ(4,3)))
            this.tiles.append(Tile.init(5, Model.getPositionOnGameFieldByIndexIJ(4,4)))
            this.tiles.append(Tile.init(6, Model.getPositionOnGameFieldByIndexIJ(5,3)))
            this.tiles.append(Tile.init(4, Model.getPositionOnGameFieldByIndexIJ(5,4)))

            for (let tile in this.tiles) {
                Model.setIndexesForTileByCenter(tile)
            }

        }

        setPropertyOnValidCellForTiles(tiles)

    }

func initGameField() {

    this.width  = this.sizeM * Model.kModelCellLength;
    this.height = this.sizeN * Model.kModelCellLength;

    this.gameField = [];

    for (let i = 0; i < this.sizeN; i++) {
        let row:[Cell] = [];
        for(let j = 0; j < this.sizeM; j++) {
            let center = Model.getPositionOnGameFieldByIndexIJ(i, j);
            let cell = new Cell(center, i, j, Cell.kCellFree);
            row.push(cell);
        }
        this.gameField.push(row)
    }

}

// static func getPositionOnGameFieldByIndexIJ(i:Int, _ j:Int) -> CGPoint {
//     return CGPointMake((CGFloat(j) + 0.5) * Model.kModelCellLength, (CGFloat(i) + 0.5) * Model.kModelCellLength);
// }
//
// static func getIndexIForPoint(point:CGPoint) -> Int {
//     return Int(point.y / kModelCellLength)
// }
//
// static func getIndexJForPoint(point:CGPoint) -> Int {
//     return Int(point.x / kModelCellLength);
// }
//
// static func setIndexesForTileByCenter(tile:Tile) {
//     tile.i = Model.getIndexIForPoint(tile.center)
//     tile.j = Model.getIndexJForPoint(tile.center)
// }
//
// func setPropertyOnValidCellForTilesBlock(tilesBlock:TilesBlock) {
//
//     setPropertyOnValidCellForTiles(tilesBlock.getTiles())
//
// }
//
// func setPropertyOnValidCellForTiles(tilesArray:[Tile]) {
//     for tile in tilesArray {
//         let cell = gameField[tile.i][tile.j]
//         tile.onValidCell = (cell.type == Cell.kCellPlay && cell.numberValue == tile.numberValue)
//     }
// }
//
// func getSizeN() -> Int {
//     return sizeN
// }
//
// func getSizeM() -> Int {
//     return sizeM
// }
//
// func isValidIndexIJ(i:Int, _ j:Int) -> Bool {
//     return (i >= 0 && j >= 0 && i < sizeN && j < sizeM)
// }
//
// func getGameField() -> [[Cell]] {
//     return gameField
// }
//
// func getTileByIndexIJ(i:Int, _ j:Int) -> Tile? {
//     var result:Tile?
// for tile in tiles {
//     if (tile.i == i && tile.j == j) {
//         result = tile;
//         break;
//     }
// }
// return result
// }
//
// func getTiles() -> [Tile] {
//     return tiles
// }
//
// func touchTileBegan() {
//     isTouchTileBegan = true
// }
//
// func didMoveTile(movedTile:Tile, byVector sVector:CGVector) {
//
//     var s = sVector
//     makeCorrectMoveVector(&s)
//     calculateMoveDirection(s)
//
//     let isFirstMoveTheTile = isTouchTileBegan;
//     if (isFirstMoveTheTile) {
//         groupTilesInBlocksByTile(movedTile)
//         isTouchTileBegan = false
//     }
//
//     let touchedTilesBlock = getTouchedTilesBlock()
//     touchedTilesBlock.moveByVector(s)
//
//     let currentTilesBlock = touchedTilesBlock;
//
//     var needMove = true;
//
//     while (needMove) {
//
//         needMove = false
//
//         for tilesBlock in tilesBlocks {
//
//             needMove = movedTilesBlock(currentTilesBlock, intersectWithTilesBlock: tilesBlock)
//
//             if (needMove) {
//
//                 setFineTilesPositionFor(tilesBlock, BeforeAddTo:currentTilesBlock)
//
//                 addTilesBlock(tilesBlock, toTilesBlock:currentTilesBlock)
//                 break
//
//             }
//
//         }
//
//     }
//
//     setIndexesForTilesInBlockByCenter(currentTilesBlock)
//
//     let isMoveTilesBlockValidValue = isMoveTilesBlockValid(currentTilesBlock)
//
//     if (isMoveTilesBlockValidValue) {
//         setNewTilesCenterForTilesBlock(currentTilesBlock)
//         setPropertyOnValidCellForTilesBlock(currentTilesBlock)
//     } else {
//         setTilesCenterBackForTilesBlock(currentTilesBlock)
//         setIndexesForTilesInBlockByCenter(currentTilesBlock)
//     }
//
// }
//
// func setFineTilesPositionFor(tilesBlock:TilesBlock, BeforeAddTo currentTilesBlock:TilesBlock) {
//
//     if (moveDirection.right) {
//
//         let movedTile = currentTilesBlock.getLastTile()
//         var k:Int = 0;
//         for tile in tilesBlock.getTiles() {
//             k += 1
//             tile.center = CGPointMake(movedTile.center.x + Model.kModelCellLength * CGFloat(k), movedTile.center.y);
//         }
//
//     } else if (moveDirection.down) {
//
//         let movedTile = currentTilesBlock.getLastTile()
//         var k:Int = 0
//         for tile in tilesBlock.getTiles() {
//             k += 1
//             tile.center = CGPointMake(movedTile.center.x, movedTile.center.y + Model.kModelCellLength * CGFloat(k));
//         }
//
//     } else if (moveDirection.left) {
//
//         let movedTile = currentTilesBlock.getFirstTile()
//         var k:Int = 0
//         for tile in tilesBlock.getTiles() {
//             k += 1
//             tile.center = CGPointMake(movedTile.center.x - Model.kModelCellLength * CGFloat(k), movedTile.center.y);
//         }
//
//     } else if (moveDirection.up) {
//
//         let movedTile = currentTilesBlock.getFirstTile()
//         var k:Int = 0
//         for tile in tilesBlock.getTiles() {
//             k += 1
//             tile.center = CGPointMake(movedTile.center.x, movedTile.center.y - Model.kModelCellLength * CGFloat(k));
//         }
//
//     }
//
// }
//
// func setNewTilesCenterForTilesBlock(tilesBlock: TilesBlock) {
//
//     for tile in tilesBlock.getTiles() {
//         tile.previousCenter = tile.center;
//     }
//
// }
//
// func setTilesCenterBackForTilesBlock(tilesBlock: TilesBlock) {
//
//     for tile in tilesBlock.getTiles() {
//         tile.center = tile.previousCenter;
//     }
//
// }
//
// func makeCorrectMoveVector(inout s:CGVector) {
//
//     let maxmove = Model.kModelCellLength * Model.kModelMaxMove;
//     if (abs(s.dx) > maxmove) {
//         s.dx = maxmove * s.dx / abs(s.dx);
//     }
//     if (abs(s.dy) > maxmove) {
//         s.dy = maxmove * s.dy / abs(s.dy);
//     }
//
// }
//
// func calculateMoveDirection(s:CGVector) {
//
//     moveDirection.down = false
//     moveDirection.left = false
//     moveDirection.right = false
//     moveDirection.up = false
//     moveDirection.isHorizontal = false
//
//     moveDirection.isHorizontal = (abs(s.dx) > abs(s.dy));
//
//     if (moveDirection.isHorizontal) {
//         moveDirection.right = (s.dx > 0);
//         moveDirection.left  = (s.dx < 0);
//     } else {
//         moveDirection.down = (s.dy > 0);
//         moveDirection.up   = (s.dy < 0);
//     }
//
// }
//
// func groupTilesInBlocksByTile(movedTile:Tile) {
//
//     tilesBlocks.removeAll()
//
//     let minIdx:Int    = 0;
//     let maxIdx:Int    = (moveDirection.isHorizontal ? sizeM : sizeM) - 1;
//     let firstIdx:Int  = moveDirection.isHorizontal ? movedTile.j : movedTile.i;
//     let secondIdx:Int = moveDirection.isHorizontal ? movedTile.i : movedTile.j;
//
//     var isTiles = false
//     var tilesBlock:TilesBlock? = nil;
//
//     for idx in minIdx ... maxIdx {
//
//         var tile:Tile? = nil;
//         if (moveDirection.isHorizontal) {
//             tile = getTileByIndexIJ(secondIdx, idx)
//         } else {
//             tile = getTileByIndexIJ(idx, secondIdx)
//         }
//
//         if (tile != nil) {
//
//             if (isTiles == false) {
//                 tilesBlock = TilesBlock.init(isHorizontal: moveDirection.isHorizontal)
//                 isTiles = true;
//             }
//
//             tilesBlock!.addTile(tile!)
//             if ((moveDirection.isHorizontal && tile!.j == firstIdx && tile!.i == secondIdx) || (moveDirection.isHorizontal == false && tile!.i == firstIdx && tile!.j == secondIdx)) {
//                 tilesBlock!.setTouched(true)
//             }
//
//             let isLastIndex = (idx == maxIdx);
//             if (isLastIndex) {
//                 tilesBlocks.append(tilesBlock!)
//             }
//
//         } else if (isTiles) {
//
//             isTiles = false;
//             tilesBlocks.append(tilesBlock!)
//
//         }
//
//     }
//
// }
//
// func setTilesOnGameField() {
//
//     for tile in tiles {
//         tile.center = Model.getPositionOnGameFieldByIndexIJ(tile.i, tile.j)
//     }
//
// }
//
// func getTouchedTilesBlock() -> TilesBlock {
//     var result:TilesBlock? = nil;
//     for tilesBlock in tilesBlocks {
//         if tilesBlock.getTouched() {
//             result = tilesBlock;
//             break;
//         }
//     }
//     return result!
// }
//
// func setIndexesForTilesInBlockByCenter(tilesBlock:TilesBlock) {
//
//     for tile in tilesBlock.getTiles() {
//
//         let indexes = tilesBlock.getFineIndexesForTile(tile)
//         tile.i = indexes.i
//         tile.j = indexes.j
//
//     }
//
// }
//
// func movedTilesBlock(tb1:TilesBlock, intersectWithTilesBlock tb2:TilesBlock) -> Bool {
//
//     var result:Bool = false
//
//     let isDifferentBlocks = (tb1 !== tb2) // .isEqual()
//
//     if (isDifferentBlocks) {
//
//         if (moveDirection.right) {
//
//             let tile1_right = tb1.getLastTile()
//             let tile2_left  = tb2.getFirstTile()
//
//             result = tile1_right.center.x + Model.eps < tile2_left.center.x && tile2_left.center.x - tile1_right.center.x < Model.kModelCellLength - Model.eps;
//
//         } else if (moveDirection.down) {
//
//             let tile1_bottom = tb1.getLastTile()
//             let tile2_top    = tb2.getFirstTile()
//
//             result = tile1_bottom.center.y + Model.eps < tile2_top.center.y && tile2_top.center.y - tile1_bottom.center.y < Model.kModelCellLength - Model.eps;
//
//         } else if (moveDirection.left) {
//
//             let tile1_left  = tb1.getFirstTile()
//             let tile2_right = tb2.getLastTile()
//
//             result = tile2_right.center.x + Model.eps < tile1_left.center.x && tile1_left.center.x - tile2_right.center.x < Model.kModelCellLength - Model.eps;
//
//         } else if (moveDirection.up) {
//
//             let tile1_top    = tb1.getFirstTile()
//             let tile2_bottom = tb2.getLastTile()
//
//             result = tile2_bottom.center.y + Model.eps < tile1_top.center.y && tile1_top.center.y - tile2_bottom.center.y < Model.kModelCellLength - Model.eps;
//
//         }
//
//     }
//
//     return result;
//
// }
//
// func addTilesBlock(tb1:TilesBlock, toTilesBlock tb2:TilesBlock) {
//
//     let addingTiles = tb1.getTiles()
//
//     for tile in addingTiles {
//         tb2.addTile(tile)
//     }
//
//     let idx:Int! = tilesBlocks.indexOf({$0 === tb1})
// //        var idx = 0
// //        for tb in tilesBlocks {
// //            if tb === tb1 {
// //                break
// //            }
// //            idx += 1
// //        }
//
//     tilesBlocks.removeAtIndex(idx)
//
// }
//
// func isMoveTilesBlockValid(tilesBlock:TilesBlock) -> Bool {
//
//     var result = true;
//
//     if needAnalizeValidMove(tilesBlock) {
//
//         if (result) {
//             if detectIntersectUnfreeCellWithTilesBlock(tilesBlock) {
//                 result = false
//             }
//         }
//
//         if (result) {
//             if detectBreakTilesByMovedTilesBlock(tilesBlock) {
//                 result = false
//             }
//         }
//
//     }
//
//     return result
//
// }
//
// func needAnalizeValidMove(tilesBlock:TilesBlock) -> Bool {
//
//     var result = true;
//
//     var i:Int = -1;
//     var j:Int = -1;
//
//     if (moveDirection.right) {
//
//         let tile = tilesBlock.getLastTile();
//         let frontPoint = CGPointMake(tile.center.x + Model.kModelCellLength / 2, tile.center.y);
//
//         i = Model.getIndexIForPoint(frontPoint)
//         j = Model.getIndexJForPoint(frontPoint)
//
//         if isValidIndexIJ(i, j) {
//
//             let cell = gameField[i][j]
//
//             let delta = frontPoint.x - (cell.center.x - Model.kModelCellLength / 2);
//             result = (delta > Model.kModelDeltaTileOnCell);
//
//         }
//
//
//     } else if (moveDirection.down) {
//
//         let tile = tilesBlock.getLastTile()
//         let frontPoint = CGPointMake(tile.center.x, tile.center.y + Model.kModelCellLength / 2);
//
//         i = Model.getIndexIForPoint(frontPoint)
//         j = Model.getIndexJForPoint(frontPoint)
//
//         if isValidIndexIJ(i,j) {
//
//             let cell = gameField[i][j];
//
//             let delta = frontPoint.y - (cell.center.y - Model.kModelCellLength / 2);
//             result = (delta > Model.kModelDeltaTileOnCell);
//
//         }
//
//     } else if (moveDirection.left) {
//
//         let tile = tilesBlock.getFirstTile()
//         let frontPoint = CGPointMake(tile.center.x - Model.kModelCellLength / 2, tile.center.y);
//
//         i = Model.getIndexIForPoint(frontPoint)
//         j = Model.getIndexJForPoint(frontPoint)
//
//         if isValidIndexIJ(i,j) {
//
//             let cell = gameField[i][j];
//
//             let delta = (cell.center.x + Model.kModelCellLength / 2) - frontPoint.x;
//             result = (delta > Model.kModelDeltaTileOnCell);
//
//         }
//
//     } else if (moveDirection.up) {
//
//         let tile = tilesBlock.getFirstTile()
//         let frontPoint = CGPointMake(tile.center.x, tile.center.y - Model.kModelCellLength / 2);
//
//         i = Model.getIndexIForPoint(frontPoint)
//         j = Model.getIndexJForPoint(frontPoint)
//
//         if isValidIndexIJ(i,j) {
//
//             let cell = gameField[i][j];
//
//             let delta = (cell.center.y + Model.kModelCellLength / 2) - frontPoint.y;
//             result = (delta > Model.kModelDeltaTileOnCell);
//
//         }
//
//     }
//
//     return result;
//
// }
//
// func detectIntersectUnfreeCellWithTilesBlock(tilesBlock:TilesBlock) -> Bool {
//
//     var result = true;
//
//     var frontPoint:CGPoint?;
//     var tile:Tile;
//
//     if (moveDirection.right) {
//
//         tile = tilesBlock.getLastTile()
//         frontPoint = CGPointMake(tile.center.x + Model.kModelCellLength / 2, tile.center.y);
//
//     } else if (moveDirection.down) {
//
//         tile = tilesBlock.getLastTile()
//         frontPoint = CGPointMake(tile.center.x, tile.center.y + Model.kModelCellLength / 2);
//
//     } else if (moveDirection.left) {
//
//         tile = tilesBlock.getFirstTile()
//         frontPoint = CGPointMake(tile.center.x - Model.kModelCellLength / 2, tile.center.y);
//
//     } else if (moveDirection.up) {
//
//         tile = tilesBlock.getFirstTile()
//         frontPoint = CGPointMake(tile.center.x, tile.center.y - Model.kModelCellLength / 2);
//
//     }
//
//
//     let i = Model.getIndexIForPoint(frontPoint!)
//     let j = Model.getIndexJForPoint(frontPoint!)
//
//     if isValidIndexIJ(i,j) {
//
//         let cell = gameField[i][j];
//         //if (cell != nil && cell.type != Cell.kCellWall) {
//         if (cell.type != Cell.kCellWall) {
//             result = false;
//         }
//
//     }
//
//     return result;
//
// }
//
// func detectBreakTilesByMovedTilesBlock(tilesBlock:TilesBlock) -> Bool {
//
//     var result = false;
//
//     detectBreakField = []
//
//     for _ in 0 ..< sizeN {
//         var row = [Bool]()
//         for _ in 0 ..< sizeM {
//             row.append(false)
//         }
//         detectBreakField.append(row)
//     }
//
//     for tile in tiles {
//         tile.iNext = tile.i;
//         tile.jNext = tile.j;
//     }
//
//     let firstTile = tilesBlock.getFirstTile()
//
//     let indexes = tilesBlock.getFineIndexesForTile(firstTile)
//     let iCurrent = indexes.i
//     let jCurrent = indexes.j
//
//     let cell = gameField[iCurrent][jCurrent]
//
//     var dI:Int = 0;
//     var dJ:Int = 0;
//
//     if (abs(firstTile.center.x - cell.center.x) > Model.eps) {
//         if (moveDirection.right && firstTile.center.x > cell.center.x && isValidIndexIJ(iCurrent,jCurrent + 1)) {
//             dJ += 1
//         } else if (moveDirection.left && firstTile.center.x < cell.center.x && isValidIndexIJ(iCurrent, jCurrent - 1)){
//             dJ -= 1
//         }
//     }
//
//     if (abs(firstTile.center.y - cell.center.y) > Model.eps) {
//         if (moveDirection.down && firstTile.center.y > cell.center.y && isValidIndexIJ(iCurrent + 1,jCurrent)) {
//             dI += 1
//         } else if (moveDirection.up && firstTile.center.y < cell.center.y && isValidIndexIJ(iCurrent - 1,jCurrent)) {
//             dI -= 1
//         }
//     }
//
//     for tile in tilesBlock.getTiles() {
//
//         tile.iNext = tile.iNext + dI;
//         tile.jNext = tile.jNext + dJ;
//
//     }
//
//     for tile in tiles {
//         detectBreakField[tile.iNext][tile.jNext] = true
//     }
//
//     let tile = tiles.first
//     resetCellForIndexIJ(tile!.iNext, tile!.jNext)
//
//     for i in 0 ..< sizeN {
//         for j in 0 ..< sizeM {
//             if detectBreakField[i][j] == true {
//                 result = true
//                 break
//             }
//         }
//     }
//
//     return result
//
// }
//
// func resetCellForIndexIJ(i:Int, _ j:Int) {
//
//     if (detectBreakField[i][j] == true) {
//
//         detectBreakField[i][j] = false
//
//         if isValidIndexIJ(i - 1, j) {
//             resetCellForIndexIJ(i - 1, j)
//         }
//
//         if isValidIndexIJ(i + 1, j) {
//             resetCellForIndexIJ(i + 1, j)
//         }
//
//         if isValidIndexIJ(i, j - 1) {
//             resetCellForIndexIJ(i, j - 1)
//         }
//
//         if isValidIndexIJ(i, j + 1) {
//             resetCellForIndexIJ(i, j + 1)
//         }
//
//     }

}




}
