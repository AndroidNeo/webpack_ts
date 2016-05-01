webpackJsonp([0,2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var test_component_1 = __webpack_require__(2);
	var test = new test_component_1.TestComponent();
	$(document).ready(function () {
	    console.log(test.test());
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var TestComponent = (function () {
	    function TestComponent() {
	    }
	    TestComponent.prototype.test = function () {
	        return "\n            it's working\n        ";
	    };
	    return TestComponent;
	}());
	exports.TestComponent = TestComponent;


/***/ }
]);
//# sourceMappingURL=app.js.map