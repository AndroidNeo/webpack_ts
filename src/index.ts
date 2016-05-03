import * as $ from 'jquery';
import {TestComponent} from './test.component/test.component';
require('./styl/test.styl')
import {Model} from './model/model';
import {Tile} from './model/tile';
import {CGPoint} from './objc/objc_types';


let model = new Model(1);
let tile = new Tile(1, new CGPoint(3,5));

var test = new TestComponent();

$(document).ready(function() {
    console.log(test.test1());
    console.log(model);
    console.log(tile);
    console.log('hello, world');
    let grid = $('.grid');
    let gridWidth = grid.width();
   // let gridHeight = grid.height();

   // console.log(gridHeight);
    let k = gridWidth/model.width;
    $('.grid').height(gridWidth);
   // let cellHeight = gridHeight/model.height;

    //document.createElement('<div class="cell"></div>');
    model.gameField.forEach(function(row, i){
        row.forEach(function(cell, j){
            console.log(cell, i, j);


            var cellDiv = `<div class="cell type-`+cell.type+`" 
                            style="
                                width:`+k+`px;
                                height:`+k+`px;
                                top:`+cell.i*k+`px;
                                left:`+cell.j*k+`px;
                            "                            
                            data-type="`+cell.type+`" 
                            data-number="`+cell.numberValue+`"                             
                            `
            if(cell.numberValue>0)
                cellDiv = cellDiv + 'id="cell-'+cell.numberValue+'"';
            cellDiv = cellDiv + `>`;

            if(cell.numberValue>0)
                cellDiv = cellDiv +`<span class="number">`+cell.numberValue+`</span>`;



            cellDiv = cellDiv+`</div>`;

            grid.append(cellDiv);
        })
    })

    $('.cell').on('touchmove', function($event){
        console.log('touch move', $event);
    }).on('touchstart', function($event){
        console.log('touch start', $event);
    }).on('touchend', function($event){
        console.log('touch end', $event);
    })


    //demo cell position set
    cellSetPosition(1, 50,44);

});


function cellSetPosition(cellId, posX, posY){
    $('#cell-'+cellId).offset({left: posX, top: posY});
}
