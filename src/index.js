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