/**
 * Created by Artur on 13.05.16.
 */

import * as $ from 'jquery';
import {Levels} from "./model/levels";

$(document).ready(function() {

    //alert('hello');

    let levels_block = $('#levels_block');

    let levelCount = Levels.getCount();


    for (let n = 1; n <= levelCount; n++) {
        let levelView = "<div class='level'>" + n + "</div>";
        levels_block.append(levelView);

        console.log(levelView);
    }

});

