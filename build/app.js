webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var $ = __webpack_require__(2);
	__webpack_require__(3);
	var model_1 = __webpack_require__(7);
	var objc_types_1 = __webpack_require__(9);
	var tileview_1 = __webpack_require__(14);
	var cellview_1 = __webpack_require__(15);
	var levels_1 = __webpack_require__(13);
	var model;
	var mainScreen;
	var sizeN;
	var sizeM;
	var cellViewLength;
	var halfCellViewLength;
	var originViewPoint;
	var kModelToView;
	var tileViews;
	var previousTouchPoint;
	var currentTouchPoint;
	var moveDirection;
	var moveDirectionDefine;
	$(document).ready(function () {
	    var levelNumber = levels_1.Levels.getCount();
	    model = new model_1.Model(levelNumber);
	    mainScreen = $('#main_screen');
	    var width = mainScreen.width();
	    mainScreen.height(width);
	    sizeN = model.getSizeN();
	    sizeM = model.getSizeM();
	    var size = objc_types_1.CGSize.Make(mainScreen.width(), mainScreen.height());
	    cellViewLength = size.width / sizeM;
	    halfCellViewLength = cellViewLength / 2;
	    var yShift = (size.height - cellViewLength * sizeN) / 2;
	    originViewPoint = objc_types_1.CGPoint.Make(0, yShift);
	    kModelToView = cellViewLength / model_1.Model.kModelCellLength;
	    console.log(cellViewLength, halfCellViewLength, originViewPoint, kModelToView);
	    addCells();
	    addTiles();
	    addEventListeners();
	    updateTiles();
	});
	function addCells() {
	    var params = { 'cellViewLength': cellViewLength,
	        'originViewPoint': originViewPoint };
	    var gameField = model.getGameField();
	    for (var i = 0; i < sizeN; i++) {
	        for (var j = 0; j < sizeM; j++) {
	            var cell = gameField[i][j];
	            var cellView = new cellview_1.CellView(cell, params);
	            mainScreen.append(cellView.data);
	        }
	    }
	}
	function addTiles() {
	    var params = { 'cellViewLength': cellViewLength, 'originViewPoint': originViewPoint };
	    tileViews = {};
	    for (var _i = 0, _a = model.getTiles(); _i < _a.length; _i++) {
	        var tile = _a[_i];
	        var tileView = new tileview_1.TileView(tile, params);
	        tileViews[tileView.getId()] = tileView;
	        mainScreen.append(tileView.data);
	    }
	}
	function addEventListeners() {
	    mainScreen.on('touchstart', function ($event) {
	        $event.preventDefault();
	        var event = $event.originalEvent;
	        var isTileViewID = tileview_1.TileView.checkIsTileViewID(event.target.id);
	        if (isTileViewID) {
	            previousTouchPoint = objc_types_1.CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);
	            moveDirectionDefine = false;
	            moveDirection = objc_types_1.CGVector.Make(0, 0);
	            model.touchTileBegan();
	        }
	    }).on('touchmove', function ($event) {
	        $event.preventDefault();
	        var event = $event.originalEvent;
	        var isTileViewID = tileview_1.TileView.checkIsTileViewID(event.target.id);
	        if (isTileViewID) {
	            var targetID = '#' + event.target.id;
	            var tileView = tileViews[targetID];
	            currentTouchPoint = objc_types_1.CGPoint.Make(event.touches[0].pageX, event.touches[0].pageY);
	            var s = objc_types_1.CGVector.MakeByPoints(previousTouchPoint, currentTouchPoint);
	            if (moveDirectionDefine === false) {
	                if (Math.abs(s.dx) > Math.abs(s.dy)) {
	                    moveDirection = objc_types_1.CGVector.Make(1, 0);
	                }
	                else {
	                    moveDirection = objc_types_1.CGVector.Make(0, 1);
	                }
	                moveDirectionDefine = true;
	            }
	            s.dx = s.dx * moveDirection.dx;
	            s.dy = s.dy * moveDirection.dy;
	            var isMoveValid = (Math.abs(s.dx) > 0 || Math.abs(s.dy) > 0);
	            if (isMoveValid) {
	                var sModel = objc_types_1.CGVector.Make(s.dx / kModelToView, s.dy / kModelToView);
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
	    for (var key in tileViews) {
	        var tileView = tileViews[key];
	        var tileCenter = tileView.tile.center;
	        var center = objc_types_1.CGPoint.Make(originViewPoint.x + kModelToView * tileCenter.x, originViewPoint.y + kModelToView * tileCenter.y);
	        $(tileView.getId()).offset({ left: center.x - halfCellViewLength, top: center.y - halfCellViewLength });
	        var newClass = tileView.tile.onValidCell ? 'number-on-valid-cell' : 'number-out';
	        var oldClass = tileView.tile.onValidCell ? 'number-out' : 'number-on-valid-cell';
	        if (tileView.currentNumberClass !== newClass) {
	            var numberID = tileView.getNumberID();
	            $(numberID).toggleClass(oldClass, false);
	            $(numberID).toggleClass(newClass, true);
	            tileView.currentNumberClass = newClass;
	        }
	    }
	}


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?-url!./../../node_modules/stylus-loader/index.js!./test.styl", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?-url!./../../node_modules/stylus-loader/index.js!./test.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, "body {\n  margin: 0;\n}\nbody .grid {\n  max-width: 600px;\n  position: relative;\n  margin: 0;\n}\nbody .grid .cell {\n  position: absolute;\n  border: 1px solid #000;\n}\nbody .grid .tile {\n  box-sizing: border-box;\n  position: absolute;\n  border: 0.5px solid #f0e68c;\n  background-color: #f00;\n  display: table-cell;\n  border-collapse: collapse;\n}\nbody .grid .number-on-valid-cell {\n  color: #ff0;\n}\nbody .grid .number-out {\n  color: #000;\n}\nbody {\n  background: #fff;\n  font-family: 'Raleway', sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n}\nbody .grid .cell {\n  background: rgba(238,228,218,0.35);\n  border: none;\n  text-align: center;\n  box-shadow: 1px 0 0 0 #c4c0a4, 0 1px 0 0 #c4c0a4, 1px 1px 0 0 #c4c0a4, 1px 0 0 0 #c4c0a4 inset, 0 1px 0 0 #c4c0a4 inset;\n  color: rgba(1,147,154,0.7);\n}\nbody .grid .type-0 {\n  box-shadow: 4px 3px 3px rgba(0,0,0,0.5);\n  border: none;\n  background: #fff;\n  overflow: hidden;\n  background: #eee4da;\n}\nbody .grid .type-0:after {\n  content: '';\n  -webkit-filter: blur(10px);\n  width: 110%;\n  height: 110%;\n  top: 0;\n  left: 0;\n  display: block;\n}\nbody .grid .type-1,\nbody .grid .type-2 {\n  z-index: 1;\n}\nbody .grid .tile {\n  background: none;\n  border: none;\n  text-align: center;\n  z-index: 1;\n}\nbody .grid .tile span {\n  position: relative;\n  z-index: 1;\n  color: #f3f0ed;\n}\nbody .grid .tile:after {\n  content: '';\n  display: block;\n  top: 3px;\n  left: 3px;\n  position: absolute;\n  background: rgba(1,147,154,0.53);\n  border-radius: 0;\n  width: calc(100% - 6px);\n  height: calc(100% - 6px);\n  box-shadow: 4px 3px 3px rgba(0,0,0,0.5);\n}\n", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var cell_1 = __webpack_require__(8);
	var tile_1 = __webpack_require__(10);
	var tilesblock_1 = __webpack_require__(11);
	var movedirection_1 = __webpack_require__(12);
	var objc_types_1 = __webpack_require__(9);
	var levels_1 = __webpack_require__(13);
	var Model = (function () {
	    function Model(levelNumber) {
	        this.moveDirection = new movedirection_1.MoveDirection();
	        this.detectBreakField = [];
	        this.isTouchTileBegan = false;
	        this.tilesBlocks = [];
	        this.tiles = [];
	        this.gameField = [];
	        this.sizeN = 0;
	        this.sizeM = 0;
	        this.width = 0;
	        this.height = 0;
	        var level = levels_1.Levels.getLevelByNumber(levelNumber);
	        console.log(level);
	        this.sizeN = level.length;
	        this.sizeM = level[0].length;
	        this.initGameField();
	        for (var i = 0; i < this.sizeN; i++) {
	            for (var j = 0; j < this.sizeM; j++) {
	                var cellContent = level[i][j];
	                var cellContentObject = this.getCellContentObject(cellContent);
	                if (cellContentObject.w) {
	                    this.gameField[i][j].type = cell_1.Cell.kCellWall;
	                }
	                else if (cellContentObject.c > 0) {
	                    this.gameField[i][j].makePlayCellWithNumber(cellContentObject.c);
	                }
	                if (cellContentObject.t > 0) {
	                    this.tiles.push(new tile_1.Tile(cellContentObject.t, Model.getPositionOnGameFieldByIndexIJ(i, j)));
	                }
	            }
	        }
	        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
	            var tile = _a[_i];
	            Model.setIndexesForTileByCenter(tile);
	        }
	        this.setPropertyOnValidCellForTiles(this.tiles);
	    }
	    Model.prototype.getCellContentObject = function (cellContent) {
	        var result = {
	            'f': false,
	            'w': false,
	            'c': 0,
	            't': 0
	        };
	        var idx_c = cellContent.indexOf('c');
	        var idx_t = cellContent.indexOf('t');
	        if (cellContent === 'w') {
	            result.w = true;
	        }
	        else {
	            if (cellContent.indexOf('f') >= 0) {
	                result.f = true;
	            }
	            else if (idx_c >= 0) {
	                var c_str = cellContent.substr(idx_c + 1, 1);
	                var c_str_next = cellContent.substr(idx_c + 2, 1);
	                result.c = parseInt(c_str) + (this.isNumeric(c_str_next) ? parseInt(c_str_next) : 0);
	            }
	            if (idx_t >= 0) {
	                var t_str = cellContent.substr(idx_t + 1, 1);
	                var t_str_next = cellContent.substr(idx_t + 2, 1);
	                result.t = parseInt(t_str) + (this.isNumeric(t_str_next) ? parseInt(t_str_next) : 0);
	            }
	        }
	        return result;
	    };
	    Model.prototype.isNumeric = function (n) {
	        return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
	    };
	    Model.getPositionOnGameFieldByIndexIJ = function (i, j) {
	        return objc_types_1.CGPoint.Make((j + 0.5) * Model.kModelCellLength, (i + 0.5) * Model.kModelCellLength);
	    };
	    Model.getIndexIForPoint = function (point) {
	        return Math.floor(point.y / Model.kModelCellLength);
	    };
	    Model.getIndexJForPoint = function (point) {
	        return Math.floor(point.x / Model.kModelCellLength);
	    };
	    Model.setIndexesForTileByCenter = function (tile) {
	        tile.i = Model.getIndexIForPoint(tile.center);
	        tile.j = Model.getIndexJForPoint(tile.center);
	    };
	    Model.prototype.initGameField = function () {
	        this.width = this.sizeM * Model.kModelCellLength;
	        this.height = this.sizeN * Model.kModelCellLength;
	        this.gameField = [];
	        for (var i = 0; i < this.sizeN; i++) {
	            var row = [];
	            for (var j = 0; j < this.sizeM; j++) {
	                var center = Model.getPositionOnGameFieldByIndexIJ(i, j);
	                var cell = new cell_1.Cell(center, i, j, cell_1.Cell.kCellFree);
	                row.push(cell);
	            }
	            this.gameField.push(row);
	        }
	    };
	    Model.prototype.setPropertyOnValidCellForTilesBlock = function (tilesBlock) {
	        this.setPropertyOnValidCellForTiles(tilesBlock.getTiles());
	    };
	    Model.prototype.setPropertyOnValidCellForTiles = function (tilesArray) {
	        for (var _i = 0, tilesArray_1 = tilesArray; _i < tilesArray_1.length; _i++) {
	            var tile = tilesArray_1[_i];
	            var cell = this.gameField[tile.i][tile.j];
	            tile.onValidCell = (cell.type === cell_1.Cell.kCellPlay && cell.numberValue === tile.numberValue);
	        }
	    };
	    Model.prototype.getSizeN = function () {
	        return this.sizeN;
	    };
	    Model.prototype.getSizeM = function () {
	        return this.sizeM;
	    };
	    Model.prototype.isValidIndexIJ = function (i, j) {
	        return (i >= 0 && j >= 0 && i < this.sizeN && j < this.sizeM);
	    };
	    Model.prototype.getGameField = function () {
	        return this.gameField;
	    };
	    Model.prototype.getTileByIndexIJ = function (i, j) {
	        var result;
	        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
	            var tile = _a[_i];
	            if (tile.i === i && tile.j === j) {
	                result = tile;
	                break;
	            }
	        }
	        return result;
	    };
	    Model.prototype.getTiles = function () {
	        return this.tiles;
	    };
	    Model.prototype.touchTileBegan = function () {
	        this.isTouchTileBegan = true;
	    };
	    Model.prototype.didMoveTile = function (movedTile, sVector) {
	        var s = sVector;
	        this.makeCorrectMoveVector(s);
	        this.calculateMoveDirection(s);
	        var isFirstMoveTheTile = this.isTouchTileBegan;
	        if (isFirstMoveTheTile) {
	            this.groupTilesInBlocksByTile(movedTile);
	            this.isTouchTileBegan = false;
	        }
	        var touchedTilesBlock = this.getTouchedTilesBlock();
	        touchedTilesBlock.moveByVector(s);
	        var currentTilesBlock = touchedTilesBlock;
	        var needMove = true;
	        while (needMove) {
	            needMove = false;
	            for (var _i = 0, _a = this.tilesBlocks; _i < _a.length; _i++) {
	                var tilesBlock = _a[_i];
	                needMove = this.movedTilesBlockIntersectWithTilesBlock(currentTilesBlock, tilesBlock);
	                if (needMove) {
	                    this.setFineTilesPositionFor(tilesBlock, currentTilesBlock);
	                    this.addTilesBlock(tilesBlock, currentTilesBlock);
	                    break;
	                }
	            }
	        }
	        this.setIndexesForTilesInBlockByCenter(currentTilesBlock);
	        var isMoveTilesBlockValidValue = this.isMoveTilesBlockValid(currentTilesBlock);
	        if (isMoveTilesBlockValidValue) {
	            this.setNewTilesCenterForTilesBlock(currentTilesBlock);
	            this.setPropertyOnValidCellForTilesBlock(currentTilesBlock);
	        }
	        else {
	            this.setTilesCenterBackForTilesBlock(currentTilesBlock);
	            this.setIndexesForTilesInBlockByCenter(currentTilesBlock);
	        }
	    };
	    Model.prototype.setFineTilesPositionFor = function (tilesBlock, currentTilesBlock) {
	        if (this.moveDirection.right) {
	            var movedTile = currentTilesBlock.getLastTile();
	            var k = 0;
	            for (var _i = 0, _a = tilesBlock.getTiles(); _i < _a.length; _i++) {
	                var tile = _a[_i];
	                k += 1;
	                tile.center = objc_types_1.CGPoint.Make(movedTile.center.x + Model.kModelCellLength * k, movedTile.center.y);
	            }
	        }
	        else if (this.moveDirection.down) {
	            var movedTile = currentTilesBlock.getLastTile();
	            var k = 0;
	            for (var _b = 0, _c = tilesBlock.getTiles(); _b < _c.length; _b++) {
	                var tile = _c[_b];
	                k += 1;
	                tile.center = objc_types_1.CGPoint.Make(movedTile.center.x, movedTile.center.y + Model.kModelCellLength * k);
	            }
	        }
	        else if (this.moveDirection.left) {
	            var movedTile = currentTilesBlock.getFirstTile();
	            var k = 0;
	            for (var _d = 0, _e = tilesBlock.getTiles(); _d < _e.length; _d++) {
	                var tile = _e[_d];
	                k += 1;
	                tile.center = objc_types_1.CGPoint.Make(movedTile.center.x - Model.kModelCellLength * k, movedTile.center.y);
	            }
	        }
	        else if (this.moveDirection.up) {
	            var movedTile = currentTilesBlock.getFirstTile();
	            var k = 0;
	            for (var _f = 0, _g = tilesBlock.getTiles(); _f < _g.length; _f++) {
	                var tile = _g[_f];
	                k += 1;
	                tile.center = objc_types_1.CGPoint.Make(movedTile.center.x, movedTile.center.y - Model.kModelCellLength * k);
	            }
	        }
	    };
	    Model.prototype.setNewTilesCenterForTilesBlock = function (tilesBlock) {
	        for (var _i = 0, _a = tilesBlock.getTiles(); _i < _a.length; _i++) {
	            var tile = _a[_i];
	            tile.previousCenter = tile.center;
	        }
	    };
	    Model.prototype.setTilesCenterBackForTilesBlock = function (tilesBlock) {
	        for (var _i = 0, _a = tilesBlock.getTiles(); _i < _a.length; _i++) {
	            var tile = _a[_i];
	            tile.center = tile.previousCenter;
	        }
	    };
	    Model.prototype.makeCorrectMoveVector = function (s) {
	        var maxmove = Model.kModelCellLength * Model.kModelMaxMove;
	        if (Math.abs(s.dx) > maxmove) {
	            s.dx = maxmove * s.dx / Math.abs(s.dx);
	        }
	        if (Math.abs(s.dy) > maxmove) {
	            s.dy = maxmove * s.dy / Math.abs(s.dy);
	        }
	    };
	    Model.prototype.calculateMoveDirection = function (s) {
	        this.moveDirection.resetFields();
	        this.moveDirection.isHorizontal = (Math.abs(s.dx) > Math.abs(s.dy));
	        if (this.moveDirection.isHorizontal) {
	            this.moveDirection.right = (s.dx > 0);
	            this.moveDirection.left = (s.dx < 0);
	        }
	        else {
	            this.moveDirection.down = (s.dy > 0);
	            this.moveDirection.up = (s.dy < 0);
	        }
	    };
	    Model.prototype.groupTilesInBlocksByTile = function (movedTile) {
	        this.tilesBlocks.splice(0, this.tilesBlocks.length);
	        var minIdx = 0;
	        var maxIdx = (this.moveDirection.isHorizontal ? this.sizeM : this.sizeM) - 1;
	        var firstIdx = this.moveDirection.isHorizontal ? movedTile.j : movedTile.i;
	        var secondIdx = this.moveDirection.isHorizontal ? movedTile.i : movedTile.j;
	        var isTiles = false;
	        var tilesBlock;
	        for (var idx = minIdx; idx <= maxIdx; idx++) {
	            var tile = void 0;
	            if (this.moveDirection.isHorizontal) {
	                tile = this.getTileByIndexIJ(secondIdx, idx);
	            }
	            else {
	                tile = this.getTileByIndexIJ(idx, secondIdx);
	            }
	            if (tile) {
	                if (isTiles === false) {
	                    tilesBlock = new tilesblock_1.TilesBlock(this.moveDirection.isHorizontal);
	                    isTiles = true;
	                }
	                tilesBlock.addTile(tile);
	                if ((this.moveDirection.isHorizontal && tile.j === firstIdx && tile.i === secondIdx) || (this.moveDirection.isHorizontal === false && tile.i === firstIdx && tile.j === secondIdx)) {
	                    tilesBlock.setTouched(true);
	                }
	                var isLastIndex = (idx === maxIdx);
	                if (isLastIndex) {
	                    this.tilesBlocks.push(tilesBlock);
	                }
	            }
	            else if (isTiles) {
	                isTiles = false;
	                this.tilesBlocks.push(tilesBlock);
	            }
	        }
	    };
	    Model.prototype.setTilesOnGameField = function () {
	        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
	            var tile = _a[_i];
	            tile.center = Model.getPositionOnGameFieldByIndexIJ(tile.i, tile.j);
	        }
	    };
	    Model.prototype.getTouchedTilesBlock = function () {
	        var result;
	        for (var _i = 0, _a = this.tilesBlocks; _i < _a.length; _i++) {
	            var tilesBlock = _a[_i];
	            if (tilesBlock.getTouched()) {
	                result = tilesBlock;
	                break;
	            }
	        }
	        return result;
	    };
	    Model.prototype.setIndexesForTilesInBlockByCenter = function (tilesBlock) {
	        for (var _i = 0, _a = tilesBlock.getTiles(); _i < _a.length; _i++) {
	            var tile = _a[_i];
	            var indexes = tilesBlock.getFineIndexesForTile(tile);
	            tile.i = indexes.i;
	            tile.j = indexes.j;
	        }
	    };
	    Model.prototype.movedTilesBlockIntersectWithTilesBlock = function (tb1, tb2) {
	        var result = false;
	        var isDifferentBlocks = (tb1 !== tb2);
	        if (isDifferentBlocks) {
	            if (this.moveDirection.right) {
	                var tile1_right = tb1.getLastTile();
	                var tile2_left = tb2.getFirstTile();
	                result = tile1_right.center.x + Model.eps < tile2_left.center.x && tile2_left.center.x - tile1_right.center.x < Model.kModelCellLength - Model.eps;
	            }
	            else if (this.moveDirection.down) {
	                var tile1_bottom = tb1.getLastTile();
	                var tile2_top = tb2.getFirstTile();
	                result = tile1_bottom.center.y + Model.eps < tile2_top.center.y && tile2_top.center.y - tile1_bottom.center.y < Model.kModelCellLength - Model.eps;
	            }
	            else if (this.moveDirection.left) {
	                var tile1_left = tb1.getFirstTile();
	                var tile2_right = tb2.getLastTile();
	                result = tile2_right.center.x + Model.eps < tile1_left.center.x && tile1_left.center.x - tile2_right.center.x < Model.kModelCellLength - Model.eps;
	            }
	            else if (this.moveDirection.up) {
	                var tile1_top = tb1.getFirstTile();
	                var tile2_bottom = tb2.getLastTile();
	                result = tile2_bottom.center.y + Model.eps < tile1_top.center.y && tile1_top.center.y - tile2_bottom.center.y < Model.kModelCellLength - Model.eps;
	            }
	        }
	        return result;
	    };
	    Model.prototype.addTilesBlock = function (tb1, tb2) {
	        var addingTiles = tb1.getTiles();
	        for (var _i = 0, addingTiles_1 = addingTiles; _i < addingTiles_1.length; _i++) {
	            var tile = addingTiles_1[_i];
	            tb2.addTile(tile);
	        }
	        var idx = this.tilesBlocks.indexOf(tb1);
	        this.tilesBlocks.splice(idx, 1);
	    };
	    Model.prototype.isMoveTilesBlockValid = function (tilesBlock) {
	        var result = true;
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
	    };
	    Model.prototype.needAnalizeValidMove = function (tilesBlock) {
	        var result = true;
	        var i = -1;
	        var j = -1;
	        if (this.moveDirection.right) {
	            var tile = tilesBlock.getLastTile();
	            var frontPoint = objc_types_1.CGPoint.Make(tile.center.x + Model.kModelCellLength / 2, tile.center.y);
	            i = Model.getIndexIForPoint(frontPoint);
	            j = Model.getIndexJForPoint(frontPoint);
	            if (this.isValidIndexIJ(i, j)) {
	                var cell = this.gameField[i][j];
	                var delta = frontPoint.x - (cell.center.x - Model.kModelCellLength / 2);
	                result = (delta > Model.kModelDeltaTileOnCell);
	            }
	        }
	        else if (this.moveDirection.down) {
	            var tile = tilesBlock.getLastTile();
	            var frontPoint = objc_types_1.CGPoint.Make(tile.center.x, tile.center.y + Model.kModelCellLength / 2);
	            i = Model.getIndexIForPoint(frontPoint);
	            j = Model.getIndexJForPoint(frontPoint);
	            if (this.isValidIndexIJ(i, j)) {
	                var cell = this.gameField[i][j];
	                var delta = frontPoint.y - (cell.center.y - Model.kModelCellLength / 2);
	                result = (delta > Model.kModelDeltaTileOnCell);
	            }
	        }
	        else if (this.moveDirection.left) {
	            var tile = tilesBlock.getFirstTile();
	            var frontPoint = objc_types_1.CGPoint.Make(tile.center.x - Model.kModelCellLength / 2, tile.center.y);
	            i = Model.getIndexIForPoint(frontPoint);
	            j = Model.getIndexJForPoint(frontPoint);
	            if (this.isValidIndexIJ(i, j)) {
	                var cell = this.gameField[i][j];
	                var delta = (cell.center.x + Model.kModelCellLength / 2) - frontPoint.x;
	                result = (delta > Model.kModelDeltaTileOnCell);
	            }
	        }
	        else if (this.moveDirection.up) {
	            var tile = tilesBlock.getFirstTile();
	            var frontPoint = objc_types_1.CGPoint.Make(tile.center.x, tile.center.y - Model.kModelCellLength / 2);
	            i = Model.getIndexIForPoint(frontPoint);
	            j = Model.getIndexJForPoint(frontPoint);
	            if (this.isValidIndexIJ(i, j)) {
	                var cell = this.gameField[i][j];
	                var delta = (cell.center.y + Model.kModelCellLength / 2) - frontPoint.y;
	                result = (delta > Model.kModelDeltaTileOnCell);
	            }
	        }
	        return result;
	    };
	    Model.prototype.detectIntersectUnfreeCellWithTilesBlock = function (tilesBlock) {
	        var result = true;
	        var frontPoint;
	        var tile;
	        if (this.moveDirection.right) {
	            tile = tilesBlock.getLastTile();
	            frontPoint = objc_types_1.CGPoint.Make(tile.center.x + Model.kModelCellLength / 2, tile.center.y);
	        }
	        else if (this.moveDirection.down) {
	            tile = tilesBlock.getLastTile();
	            frontPoint = objc_types_1.CGPoint.Make(tile.center.x, tile.center.y + Model.kModelCellLength / 2);
	        }
	        else if (this.moveDirection.left) {
	            tile = tilesBlock.getFirstTile();
	            frontPoint = objc_types_1.CGPoint.Make(tile.center.x - Model.kModelCellLength / 2, tile.center.y);
	        }
	        else if (this.moveDirection.up) {
	            tile = tilesBlock.getFirstTile();
	            frontPoint = objc_types_1.CGPoint.Make(tile.center.x, tile.center.y - Model.kModelCellLength / 2);
	        }
	        var i = Model.getIndexIForPoint(frontPoint);
	        var j = Model.getIndexJForPoint(frontPoint);
	        if (this.isValidIndexIJ(i, j)) {
	            var cell = this.gameField[i][j];
	            if (cell.type !== cell_1.Cell.kCellWall) {
	                result = false;
	            }
	        }
	        return result;
	    };
	    Model.prototype.detectBreakTilesByMovedTilesBlock = function (tilesBlock) {
	        var result = false;
	        this.detectBreakField = [];
	        for (var i = 0; i < this.sizeN; i++) {
	            var row = [];
	            for (var j = 0; j < this.sizeM; j++) {
	                row.push(false);
	            }
	            this.detectBreakField.push(row);
	        }
	        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
	            var tile_2 = _a[_i];
	            tile_2.iNext = tile_2.i;
	            tile_2.jNext = tile_2.j;
	        }
	        var firstTile = tilesBlock.getFirstTile();
	        var indexes = tilesBlock.getFineIndexesForTile(firstTile);
	        var iCurrent = indexes.i;
	        var jCurrent = indexes.j;
	        var cell = this.gameField[iCurrent][jCurrent];
	        var dI = 0;
	        var dJ = 0;
	        if (Math.abs(firstTile.center.x - cell.center.x) > Model.eps) {
	            if (this.moveDirection.right && firstTile.center.x > cell.center.x && this.isValidIndexIJ(iCurrent, jCurrent + 1)) {
	                dJ += 1;
	            }
	            else if (this.moveDirection.left && firstTile.center.x < cell.center.x && this.isValidIndexIJ(iCurrent, jCurrent - 1)) {
	                dJ -= 1;
	            }
	        }
	        if (Math.abs(firstTile.center.y - cell.center.y) > Model.eps) {
	            if (this.moveDirection.down && firstTile.center.y > cell.center.y && this.isValidIndexIJ(iCurrent + 1, jCurrent)) {
	                dI += 1;
	            }
	            else if (this.moveDirection.up && firstTile.center.y < cell.center.y && this.isValidIndexIJ(iCurrent - 1, jCurrent)) {
	                dI -= 1;
	            }
	        }
	        for (var _b = 0, _c = tilesBlock.getTiles(); _b < _c.length; _b++) {
	            var tile_3 = _c[_b];
	            tile_3.iNext = tile_3.iNext + dI;
	            tile_3.jNext = tile_3.jNext + dJ;
	        }
	        for (var _d = 0, _e = this.tiles; _d < _e.length; _d++) {
	            var tile_4 = _e[_d];
	            this.detectBreakField[tile_4.iNext][tile_4.jNext] = true;
	        }
	        var tile = this.tiles[0];
	        this.resetCellForIndexIJ(tile.iNext, tile.jNext);
	        for (var i = 0; i < this.sizeN; i++) {
	            for (var j = 0; j < this.sizeM; j++) {
	                if (this.detectBreakField[i][j] === true) {
	                    result = true;
	                    break;
	                }
	            }
	        }
	        return result;
	    };
	    Model.prototype.resetCellForIndexIJ = function (i, j) {
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
	    };
	    Model.kModelCellLength = 1.0;
	    Model.kModelMaxMove = 0.15;
	    Model.eps = Model.kModelCellLength * 0.000001;
	    Model.kModelDeltaTileOnCell = Model.kModelCellLength / 5.0;
	    return Model;
	}());
	exports.Model = Model;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var objc_types_1 = __webpack_require__(9);
	var Cell = (function () {
	    function Cell(center, i, j, cellType) {
	        this.center = new objc_types_1.CGPoint(0, 0);
	        this.i = 0;
	        this.j = 0;
	        this.type = 0;
	        this.numberValue = 0;
	        this.center = center;
	        this.i = i;
	        this.j = j;
	        this.type = cellType;
	        this.numberValue = 0;
	    }
	    Cell.prototype.makePlayCellWithNumber = function (numberValue) {
	        this.numberValue = numberValue;
	        this.type = Cell.kCellPlay;
	    };
	    Cell.kCellWall = 0;
	    Cell.kCellFree = 1;
	    Cell.kCellPlay = 2;
	    return Cell;
	}());
	exports.Cell = Cell;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var CGPoint = (function () {
	    function CGPoint(x, y) {
	        this.x = 0;
	        this.y = 0;
	        this.x = x;
	        this.y = y;
	    }
	    CGPoint.Make = function (x, y) {
	        return new CGPoint(x, y);
	    };
	    return CGPoint;
	}());
	exports.CGPoint = CGPoint;
	var CGVector = (function () {
	    function CGVector(dx, dy) {
	        this.dx = 0;
	        this.dy = 0;
	        this.dx = dx;
	        this.dy = dy;
	    }
	    CGVector.Make = function (dx, dy) {
	        return new CGVector(dx, dy);
	    };
	    CGVector.MakeByPoints = function (a1, a2) {
	        return new CGVector(a2.x - a1.x, a2.y - a1.y);
	    };
	    return CGVector;
	}());
	exports.CGVector = CGVector;
	var CGSize = (function () {
	    function CGSize(width, height) {
	        this.width = 0;
	        this.height = 0;
	        this.width = width;
	        this.height = height;
	    }
	    CGSize.Make = function (width, height) {
	        return new CGSize(width, height);
	    };
	    return CGSize;
	}());
	exports.CGSize = CGSize;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var objc_types_1 = __webpack_require__(9);
	var Tile = (function () {
	    function Tile(numberValue, center) {
	        this.i = 0;
	        this.j = 0;
	        this.iNext = 0;
	        this.jNext = 0;
	        this.numberValue = 0;
	        this.center = new objc_types_1.CGPoint(0, 0);
	        this.previousCenter = new objc_types_1.CGPoint(0, 0);
	        this.onValidCell = false;
	        this.numberValue = numberValue;
	        this.center = center;
	        this.previousCenter = center;
	    }
	    return Tile;
	}());
	exports.Tile = Tile;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var objc_types_1 = __webpack_require__(9);
	var model_1 = __webpack_require__(7);
	var TilesBlock = (function () {
	    function TilesBlock(isHorizontal) {
	        this.isHorizontal = isHorizontal;
	        this.tilesInBlock = [];
	        this.isTouched = false;
	    }
	    TilesBlock.prototype.addTile = function (tile) {
	        this.tilesInBlock.push(tile);
	        this.sortTiles();
	    };
	    TilesBlock.prototype.sortTiles = function () {
	        var $this = this;
	        var tilesToSort = [];
	        for (var _i = 0, _a = this.tilesInBlock; _i < _a.length; _i++) {
	            var tile = _a[_i];
	            tilesToSort.push(tile);
	        }
	        var params = { 'isHorizontal': this.isHorizontal };
	        var sortedTiles = tilesToSort.sort(this.createSorter(params));
	        this.reset();
	        for (var _b = 0, sortedTiles_1 = sortedTiles; _b < sortedTiles_1.length; _b++) {
	            var tile = sortedTiles_1[_b];
	            this.tilesInBlock.push(tile);
	        }
	    };
	    TilesBlock.prototype.createSorter = function (params) {
	        return function (tile1, tile2) {
	            var result = -1;
	            var tile1_greater_than_tile2 = ((params.isHorizontal && tile1.center.x > tile2.center.x)
	                || (params.isHorizontal === false && tile1.center.y > tile2.center.y));
	            if (tile1_greater_than_tile2) {
	                result = 1;
	            }
	            return result;
	        };
	    };
	    TilesBlock.prototype.reset = function () {
	        this.tilesInBlock.splice(0, this.tilesInBlock.length);
	    };
	    TilesBlock.prototype.setTouched = function (isTouchedValue) {
	        this.isTouched = isTouchedValue;
	    };
	    TilesBlock.prototype.getTouched = function () {
	        return this.isTouched;
	    };
	    TilesBlock.prototype.moveByVector = function (s) {
	        for (var _i = 0, _a = this.tilesInBlock; _i < _a.length; _i++) {
	            var tile = _a[_i];
	            tile.center = objc_types_1.CGPoint.Make(tile.center.x + s.dx, tile.center.y + s.dy);
	        }
	    };
	    TilesBlock.prototype.getTiles = function () {
	        return this.tilesInBlock;
	    };
	    TilesBlock.prototype.getFirstTile = function () {
	        return this.tilesInBlock[0];
	    };
	    TilesBlock.prototype.getLastTile = function () {
	        var n = this.tilesInBlock.length;
	        return this.tilesInBlock[n - 1];
	    };
	    TilesBlock.prototype.getFineIndexesForTile = function (tile) {
	        var first = this.getFirstTile();
	        var i = model_1.Model.getIndexIForPoint(first.center);
	        var j = model_1.Model.getIndexJForPoint(first.center);
	        var idx = this.tilesInBlock.indexOf(tile);
	        if (this.isHorizontal) {
	            j = j + idx;
	        }
	        else {
	            i = i + idx;
	        }
	        var result = { 'i': i, 'j': j };
	        return result;
	    };
	    return TilesBlock;
	}());
	exports.TilesBlock = TilesBlock;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	var MoveDirection = (function () {
	    function MoveDirection() {
	        this.resetFields();
	    }
	    MoveDirection.prototype.resetFields = function () {
	        this.left = false;
	        this.right = false;
	        this.up = false;
	        this.down = false;
	        this.isHorizontal = false;
	    };
	    return MoveDirection;
	}());
	exports.MoveDirection = MoveDirection;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	var Levels = (function () {
	    function Levels() {
	    }
	    Levels.getLevelByNumber = function (levelNumber) {
	        var result = [];
	        var level = Levels.getRawLevelByNumber(levelNumber);
	        var rows = [];
	        var p1 = -1;
	        while (true) {
	            var p2 = level.indexOf(';', p1 + 1);
	            if (p2 > 0) {
	                var row = level.substr(p1 + 1, p2 - p1 - 1);
	                rows.push(row);
	                p1 = p2;
	            }
	            else {
	                break;
	            }
	        }
	        for (var i = 0; i < rows.length; i++) {
	            var rowDetail = [];
	            var row = rows[i];
	            row = row + ',';
	            var p1_1 = -1;
	            while (true) {
	                var p2 = row.indexOf(',', p1_1 + 1);
	                if (p2 > 0) {
	                    var cellContent = row.substr(p1_1 + 1, p2 - p1_1 - 1);
	                    rowDetail.push(cellContent);
	                    p1_1 = p2;
	                }
	                else {
	                    break;
	                }
	            }
	            result.push(rowDetail);
	        }
	        return result;
	    };
	    Levels.getRawLevelByNumber = function (levelNumber) {
	        var levels = Levels.getRawLevels();
	        return levels[levelNumber - 1];
	    };
	    Levels.getRawLevels = function () {
	        var result = [
	            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1.t3,c2.t1,f,f,w;w,f,f,c3.t2,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1,c2,f,f,w;w,f,f,c3,f.t4,f.t3,f,w;w,f,f,c4,f.t2,f.t1,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1.t3,c2.t1,f,f,w;w,f,f,c3.t2,c4.t4,f,f,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,w,w,f,f,w,w,w;w,w,f,c1,f.t4,f,w,w;w,f,f,c2,f.t2,f,f,w;w,f,f,c3.t1,c4.t5,f,f,w;w,w,f,f.t3,c5,f,w,w;w,w,w,f,f,w,w,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,c1,c2,c3,c4,f,w;w,w,w,c5,c6,w,w,w;w,w,w,f.t1,f.t5,w,w,w;w,f,f.t3,f.t4,f.t6,f.t2,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,w,w,w,w,w,w,w;w,w,f,f,f,f,f,w;w,w,f,w,c1.t5,w,f,w;w,w,f,c2.t2,c3.t1,c4.t4,f,w;w,w,f,w,c5.t3,w,f,w;w,w,f,f,f,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,w,f,f,f,f,w,w;w,f,w,f,w,w,f,w;w,f,c1.t5,c2.t2,c3.t6,w,f,w;w,f,w,c4.t1,c5.t4,c6.t3,f,w;w,f,w,w,f,w,f,w;w,w,f,f,f,f,w,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,c1.t5,f,f,w;w,f,f,f,c2.t6,c3.t4,f,w;w,w,w,w,c4.t2,w,w,w;w,f,f,c5.t1,c6.t7,f,f,w;w,f,f,f,c7.t3,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,w,f,f,f,f,w,w;w,f,w,c1.t3,c2.t1,w,f,w;w,f,w,c3.t2,c4.t5,w,f,w;w,f,w,c5.t6,c6.t4,w,f,w;w,w,f,f,f,f,w,w;w,w,f,f,f,f,w,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,w,w,f,w;w,f,c1.t6,c2.t1,c3.t5,w,f,w;w,f,w,c4.t3,c5.t2,f,f,w;w,f,w,w,c6.t4,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f,w,f,w,f,f,w;w,f,w,c1.t4,w,f,f,w;w,f,c2.t5,c3.t6,c4.t3,f,f,w;w,f,f,c5.t2,w,f,f,w;w,f,w,c6.t1,w,f,f,w;w,f,w,f,w,f,f,w;w,w,w,w,w,w,w,w;',
	            'w,w,w,w,w,w,w,w;w,f.t2,f.t1,f.t6,w,f,f,w;w,f.t5,f.t3,w,f,f,f,w;w,f.t4,f,f,f,f,w,w;w,w,f,f,f,f,c1,w;w,f,f,f,w,c2,c3,w;w,f,f,w,c4,c5,c6,w;w,w,w,w,w,w,w,w;'
	        ];
	        return result;
	    };
	    Levels.getCount = function () {
	        return Levels.getRawLevels().length;
	    };
	    return Levels;
	}());
	exports.Levels = Levels;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	var TileView = (function () {
	    function TileView(tile, params) {
	        this.tile = tile;
	        this.data = "<div class=\"tile\"\n                    style=\"\n                        width:" + params.cellViewLength + "px;\n                        height:" + params.cellViewLength + "px;\n                        top:" + params.originViewPoint.y + tile.i * params.cellViewLength + "px;\n                        left:" + params.originViewPoint.x + tile.j * params.cellViewLength + "px;\n                    \"\n                    data-onvalidcell=\"" + (tile.onValidCell ? 1 : 0) + "\"\n                    data-number=\"" + tile.numberValue + "\"\n                    ";
	        this.data = this.data + 'id="tile-' + tile.numberValue + '"';
	        this.data = this.data + ">";
	        var numberID = '"' + 'number-' + tile.numberValue + '"';
	        this.data = this.data + "<span id=" + numberID + (" style=\"line-height: " + params.cellViewLength + "px\">") + tile.numberValue + "</span>";
	        this.data = this.data + "</div>";
	    }
	    TileView.prototype.getId = function () {
	        return '#tile-' + this.tile.numberValue;
	    };
	    TileView.prototype.getNumberID = function () {
	        return '#number-' + this.tile.numberValue;
	    };
	    TileView.checkIsTileViewID = function (testID) {
	        return (testID.substr(0, 5) === 'tile-');
	    };
	    return TileView;
	}());
	exports.TileView = TileView;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var cell_1 = __webpack_require__(8);
	var CellView = (function () {
	    function CellView(cell, params) {
	        this.cell = cell;
	        this.data = "<div class=\"cell type-" + cell.type + "\"\n                    style=\"\n                        width:" + params.cellViewLength + "px;\n                        height:" + params.cellViewLength + "px;\n                        top:" + params.originViewPoint.y + cell.i * params.cellViewLength + "px;\n                        left:" + params.originViewPoint.x + cell.j * params.cellViewLength + "px;\n                        line-height:" + params.cellViewLength + "px;\n                    \"\n                    data-type=\"" + cell.type + "\"\n                    data-number=\"" + cell.numberValue + "\"\n                    ";
	        this.data = this.data + ">";
	        if (cell.type === cell_1.Cell.kCellPlay) {
	            this.data = this.data + "<span class=\"number\">" + cell.numberValue + "</span>";
	        }
	        this.data = this.data + "</div>";
	    }
	    return CellView;
	}());
	exports.CellView = CellView;


/***/ }
]);
//# sourceMappingURL=app.js.map