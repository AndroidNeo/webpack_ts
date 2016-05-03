import * as $ from 'jquery';
import {TestComponent} from './test.component/test.component';

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
});
