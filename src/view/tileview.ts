/**
 * Created by Artur on 03.05.16.
 */

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
