(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["wax"] = factory();
	else
		root["wax"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module) => {

function wax(Mustache, Formatters = {}) {
    Mustache.Formatters = Formatters;

    /*
     *	This will parse a parameter from a filter:
     *  
     *      {{ vaue | filter : param1 : param2 : param3 }}
     */
    function parseParam(param, lookup) {
        var isString, isInteger, isFloat;
        isString  = /^[\'\"](.*)[\'\"]$/g;
        isInteger = /^[+-]?\d+$/g;
        isFloat   = /^[+-]?\d*\.\d+$/g;
        if (isString.test(param)) {
            return param.replace(isString, '$1');
        }
        if (isInteger.test(param)) {
            return parseInt(param, 10);
        }
        if (isFloat.test(param)) {
            return parseFloat(param);
        }
        return lookup(param);
    };

    /*
     *	This function will resolve one filter# in the mustache expression:
     *  
     *      {{ value | filter1 | filter2 | ... | filterN }}
     */
    function applyFilter(expr, fltr, lookup) {
        var filterExp, paramsExp, match, filter, params = [expr];
        filterExp = /^\s*([^\:]+)/g;
        paramsExp = /\:\s*([\'][^\']*[\']|[\"][^\"]*[\"]|[^\:]+)\s*/g;
        match = filterExp.exec( fltr);
        filter = match[1].trim();
        while ((match = paramsExp.exec(fltr))) {
            params.push(parseParam(match[1].trim(), lookup));
        }

        if (Mustache.Formatters.hasOwnProperty(filter)) {
            fltr = Mustache.Formatters[filter];
            return fltr.apply(fltr, params);
        }
        return expr;
    };

    /*
    * Keep a copy of the original lookup function of Mustache
    */
    const lookup = Mustache.Context.prototype.lookup;

    /*
    * Overwrite the Context::lookup method to add filter capabilities
    */
    Mustache.Context.prototype.lookup = function parseExpression(name) {
        const formatters = name.split("|");
        let expression = formatters.shift().trim();
        // call original lookup method
        expression = lookup.call(this, expression);
        // Apply the formatters
        for (let i = 0, l = formatters.length; i < l; ++i) {
            expression = applyFilter(expression, formatters[i], this.lookup.bind(this));
        }
        return expression;
    };

    return Mustache;
}

// Check if mustache was included globally
try {
    if (Mustache) {
        Mustache = wax(Mustache);
    }
} catch (err) { }

module.exports = wax;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=mustache-wax.js.map