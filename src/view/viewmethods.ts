/**
 * Created by Artur on 04.05.16.
 */

import * as $ from 'jquery';

export class ViewMethods {
    
    static clearScreen() {
        ViewMethods.getMainScreen().empty();
    }
    
    static getMainScreen() {
        return $('#main_screen');
    }
}