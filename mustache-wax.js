(function(root, wax) {
	// Set up Backbone appropriately for the environment. Start with AMD.
	if (typeof define === 'function' && define.amd) {
		define(['mustache'], function(mustache) {
			wax(mustache);
		});

	// Next for Node.js or CommonJS. jQuery may not be needed as a module.
	} else if (typeof exports !== 'undefined') {
		var mustache = require('mustache');
		wax(mustache);

	// Finally, as a browser global.
	} else {
		wax(root.Mustache);
	}
}(this, function Wax(Mustache) {
	Mustache.Formatters = {};

	/*
	 *	This will parse a parameter from a filter:
	 *  
	 *      {{ vaue | filter : param1 : param2 : param3 }}
	 */
	Mustache.Context.prototype.parseParam = function parseParam(param) {
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
		return this._lookup(param);
	};

	/*
	 *	This function will resolve one filter# in the mustache expression:
	 *  
	 *      {{ value | filter1 | filter2 | ... | filterN }}
	 */
	Mustache.Context.prototype.applyFilter = function applyFilter(expr, fltr) {
		var filterExp, paramsExp, match, filter, params = [expr];
		filterExp = /^\s*([^\:]+)/g;
		paramsExp = /\:\s*([\'][^\']*[\']|[\"][^\"]*[\"]|[^\:]+)\s*/g;
		match = filterExp.exec( fltr);
		filter = match[1].trim();
		while ((match = paramsExp.exec(fltr))) {
			params.push(this.parseParam(match[1].trim()));
		}
		//console.log( filter);
		//console.log( params);
		if (Mustache.Formatters.hasOwnProperty(filter)) {
			fltr = Mustache.Formatters[filter];
			return fltr.apply(fltr, params);
		}
		return expr;
	};

	/*
	 * Keep a copy of the original lookup function of Mustache
	 */
	Mustache.Context.prototype._lookup = Mustache.Context.prototype.lookup;

	/*
	 * Overwrite the Context::lookup method to add filter capabilities
	 */
	Mustache.Context.prototype.lookup =  function parseExpression(name) {
		var i, l, expression, formatters;
		formatters    = name.split("|");
		expression = formatters.shift().trim();
		//console.log(expression);
		expression = this._lookup(expression);
		for (i = 0, l = formatters.length; i < l; ++i) {
			expression = this.applyFilter(expression, formatters[i]);
		}
		return expression;
	};
}));