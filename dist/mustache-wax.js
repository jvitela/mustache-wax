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
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function wax(Mustache, Formatters = {}) {\n    Mustache.Formatters = Formatters;\n\n    /*\n     *\tThis will parse a parameter from a filter:\n     *  \n     *      {{ vaue | filter : param1 : param2 : param3 }}\n     */\n    function parseParam(param, lookup) {\n        var isString, isInteger, isFloat;\n        isString  = /^[\\'\\\"](.*)[\\'\\\"]$/g;\n        isInteger = /^[+-]?\\d+$/g;\n        isFloat   = /^[+-]?\\d*\\.\\d+$/g;\n        if (isString.test(param)) {\n            return param.replace(isString, '$1');\n        }\n        if (isInteger.test(param)) {\n            return parseInt(param, 10);\n        }\n        if (isFloat.test(param)) {\n            return parseFloat(param);\n        }\n        return lookup(param);\n    };\n\n    /*\n     *\tThis function will resolve one filter# in the mustache expression:\n     *  \n     *      {{ value | filter1 | filter2 | ... | filterN }}\n     */\n    function applyFilter(expr, fltr, lookup) {\n        var filterExp, paramsExp, match, filter, params = [expr];\n        filterExp = /^\\s*([^\\:]+)/g;\n        paramsExp = /\\:\\s*([\\'][^\\']*[\\']|[\\\"][^\\\"]*[\\\"]|[^\\:]+)\\s*/g;\n        match = filterExp.exec( fltr);\n        filter = match[1].trim();\n        while ((match = paramsExp.exec(fltr))) {\n            params.push(parseParam(match[1].trim(), lookup));\n        }\n\n        if (Mustache.Formatters.hasOwnProperty(filter)) {\n            fltr = Mustache.Formatters[filter];\n            return fltr.apply(fltr, params);\n        }\n        return expr;\n    };\n\n    /*\n    * Keep a copy of the original lookup function of Mustache\n    */\n    const lookup = Mustache.Context.prototype.lookup;\n\n    /*\n    * Overwrite the Context::lookup method to add filter capabilities\n    */\n    Mustache.Context.prototype.lookup = function parseExpression(name) {\n        const formatters = name.split(\"|\");\n        let expression = formatters.shift().trim();\n        // call original lookup method\n        expression = lookup.call(this, expression);\n        // Apply the formatters\n        for (let i = 0, l = formatters.length; i < l; ++i) {\n            expression = applyFilter(expression, formatters[i], this.lookup.bind(this));\n        }\n        return expression;\n    };\n\n    return Mustache;\n}\n\n// Check if mustache was included globally\ntry {\n    if (Mustache) {\n        Mustache = wax(Mustache);\n    }\n} catch (err) { }\n\nmodule.exports = wax;\n\n//# sourceURL=webpack://wax/./src/index.js?");

/***/ })

/******/ });
});