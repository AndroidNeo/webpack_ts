import * as $ from 'jquery';
import {TestComponent} from "./test.component/test.component";

var hui  = new TestComponent();

$(document).ready(function() {
   console.log(hui.test1())
});