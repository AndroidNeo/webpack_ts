/**
 * Created by Artur on 03.05.16.
 */

// class GameView: UIView {
//
//
//     var model:Model
//     var tileViews:[TileView] = []
//     var originViewPoint:CGPoint = CGPointMake(0, 0);
//     var kModelToView:CGFloat = 0;
//     var cellViewLength:CGFloat = 0;
//
//     var moveDirectionDefine = false;
//     var moveDirection = CGVectorMake(0, 0);
//
//     init(gameModel: Model) {
//
//         self.model = gameModel
//         super.init(frame: CGRectMake(0,0,0,0))
//
//     }
//
//     required init?(coder aDecoder: NSCoder) {
//         fatalError("init(coder:) has not been implemented")
//     }
//
//
//     func createView() {
//
//         self.backgroundColor = UIColor.grayColor();
//
//         let size = self.bounds.size;
//
//         let sizeN:Int = self.model.getSizeN();
//         let sizeM:Int = self.model.getSizeM();
//
//         self.cellViewLength = size.width / CGFloat(sizeM);
//         let yShift:CGFloat = (size.height - self.cellViewLength * CGFloat(sizeN)) / 2;
//         self.originViewPoint = CGPointMake(0, yShift);
//
//         self.kModelToView = self.cellViewLength / Model.kModelCellLength;
//
//         var gameField = self.model.getGameField();
//
//         for i in 0 ..< sizeN {
//             for j in 0 ..< sizeM {
//
//                 let cell:Cell = gameField[i][j]
//
//                 let cellView:UIView = UIView.init(frame: CGRectMake(self.originViewPoint.x + CGFloat(j)*self.cellViewLength, self.originViewPoint.y + CGFloat(i)*self.cellViewLength, self.cellViewLength, self.cellViewLength))
//
//                 var color = UIColor.whiteColor()
//                 if (cell.type == Cell.kCellWall) {
//                     color = UIColor.brownColor();
//                 } else if (cell.type == Cell.kCellFree) {
//                     color = UIColor.whiteColor();
//                 } else if (cell.type == Cell.kCellPlay) {
//                     color = UIColor.whiteColor();//[UIColor yellowColor];
//                 }
//                 cellView.backgroundColor = color
//
//                 cellView.layer.borderWidth = 0.5;
//                 cellView.layer.borderColor = UIColor.blackColor().CGColor
//
//                 if (cell.type == Cell.kCellPlay) {
//                     let label:UILabel = UILabel.init(frame: CGRectMake(0, 0, self.cellViewLength, self.cellViewLength))
//                     label.text = String(cell.number)
//                     label.textAlignment = .Center
//                     label.font = UIFont.boldSystemFontOfSize(15.0 * self.cellViewLength / 40.0);
//                     label.textColor = UIColor.grayColor();
//                     cellView.addSubview(label);
//                 }
//
//                 self.addSubview(cellView)
//
//             }
//         }
//
//         self.tileViews = []
//
//         for tile in self.model.getTiles() {
//             let tileView:TileView = TileView.init(tile: tile)
//             tileView.frame = CGRectMake(0, 0, self.cellViewLength, self.cellViewLength)
//             tileView.backgroundColor = UIColor.redColor();
//             tileView.addNumberLabel()
//             self.tileViews.append(tileView)
//             self.addSubview(tileView)
//         }
//
//     }
//
//     func updateTiles() {
//         for tileView in self.tileViews {
//             let tileCenter = tileView.tile!.center;
//             tileView.center = CGPointMake(self.originViewPoint.x + self.kModelToView * tileCenter.x, self.originViewPoint.y + self.kModelToView * tileCenter.y);
//             tileView.label!.textColor = tileView.tile!.onValidCell ? UIColor.yellowColor(): UIColor.blackColor();
//         }
//
//         self.setNeedsDisplay();
//     }
//
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
//
//
// }
