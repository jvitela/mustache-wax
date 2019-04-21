if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

Mustache.Formatters = {
	"uppercase": function (str) {
		return str.toUpperCase();
	},
	"lowercase": function (str) {
		return str.toLowerCase();
	},
	"lpad": function (str, num, sep) {
		sep = sep || " ";
		str = "" + str;
		var filler = "";
		while ((filler.length + str.length) < num) { filler += sep };
		return (filler + str).slice(-num);
	},
	"date": function (dt) {
		var lpad  = Mustache.Formatters.lpad, 
			day   = lpad(dt.getDate(), 2, "0"),
			month = lpad(dt.getMonth()+1, 2, "0");
		return  day + "/" + month + "/" + dt.getFullYear();
	},
	"add": function (one, two) {
		return one + two;
	},
	"wrap": function(str, begin, end) {
		return (begin + str + end);
	},
	"countArgs": function() {
		return arguments.length;
	}
};

QUnit.test( "Normal expression without formatter", function( assert ) {
	var data = { name: "john" };
	debugger;
	var resp = Mustache.render("{{&name}}", data);
	assert.equal( resp, data.name, "Passed!");
});

QUnit.test( "Expression with just one formatter", function( assert ) {
	var fmt  =  Mustache.Formatters;
	var data = {
		name:"john", 
		dob: new Date(1981,2,24)
	};
	var resp = Mustache.render("{{{ name | uppercase }}}", data);
	assert.equal( resp, fmt.uppercase(data.name), "uppercase Passed!");

	resp = Mustache.render("{{{ dob | date }}}", data);
	assert.equal( resp, fmt.date(data.dob), "date Passed!");

	resp = Mustache.render("{{{ name | countArgs }}}", data);
	assert.equal( resp, fmt.countArgs(data.name), "countArgs Passed!");	
});

QUnit.test( "Expressions with parameters", function( assert ) {
	var fmt  =  Mustache.Formatters;
	var data = {name:"john"};
	var resp = Mustache.render("{{{ name | lpad:30 }}}", data);
	assert.equal( resp, fmt.lpad(data.name, 30), "lpad with one parameter Passed!");

	resp = Mustache.render("{{{ name | lpad:30:'#' }}}", data);
	assert.equal( resp, fmt.lpad(data.name, 30, '#'), "lpad with two parameters Passed!");

	resp = Mustache.render("{{{ name | wrap : '^' : '$' }}}", data);
	assert.equal( resp, fmt.wrap(data.name, '^', '$'), "wrap Passed!");

	resp = Mustache.render("{{{ name | countArgs: 1: 2: 3: 4: 5 }}}", data);
	assert.equal( resp, fmt.countArgs(data.name, 1,2,3,4,5), "countArgs with 5 arguments Passed!");

	resp = Mustache.render("{{{ name | countArgs: 1: 2: 3: 4: 5: 6: 7: 8: 9: 10 }}}", data);
	assert.equal( resp, fmt.countArgs(data.name, 1,2,3,4,5,6,7,8,9,10), "countArgs with 10 arguments Passed!");
});

QUnit.test( "Chained Expressions", function( assert ) {
	var resp, data, fmt;
	fmt	=  Mustache.Formatters;
	data = {name:"John Doe", age:30};

	resp = Mustache.render("{{{ name | lowercase | uppercase }}}", data);
	assert.equal( resp, fmt.uppercase( fmt.lowercase(data.name)), "two chained formatters Passed!");

	resp = Mustache.render("{{{ name | lpad:10:'*' | lpad:20:'#' }}}", data);
	assert.equal( resp, fmt.lpad( fmt.lpad(data.name, 10, '*'), 20, '#'), "two chained formatters with arguments Passed!");

	resp = Mustache.render("{{{ age | add:10 | add:5 | add: 3 | add: -7 | add:-11 }}}", data);
	assert.equal( resp, data.age, "five chained formatters with arguments Passed!");
});


QUnit.test( "Parameter types", function( assert ) {
	var resp, data, fmt;
	fmt	=  Mustache.Formatters;
	data = {zero:0, pi:3.14159, name:"john", last:"doe"};

	resp = Mustache.render("{{{ zero | add: 1 }}}", data);
	assert.equal( resp, 1, "Integer, no sign Passed");

	resp = Mustache.render("{{{ zero | add: +1 }}}", data);
	assert.equal( resp, 1, "Integer, positive Passed");

	resp = Mustache.render("{{{ zero | add: -1 }}}", data);
	assert.equal( resp, -1, "Integer, negative Passed");

	resp = Mustache.render("{{{ zero | add: 1.25 }}}", data);
	assert.equal( resp, 1.25, "Real, no sign Passed");

	resp = Mustache.render("{{{ zero | add: +1.25 }}}", data);
	assert.equal( resp, 1.25, "Real, positive Passed");

	resp = Mustache.render("{{{ zero | add: -1.25 }}}", data);
	assert.equal( resp, -1.25, "Real, negative Passed");

	resp = Mustache.render("{{{ zero | add: pi }}}", data);
	assert.equal( resp, data.pi, "Real as expression Passed");

	resp = Mustache.render("{{{ name | add: 'atan' }}}", data);
	assert.equal( resp, "johnatan", "String single quote Passed");

	resp = Mustache.render("{{{ name | add: \"atan\" }}}", data);
	assert.equal( resp, "johnatan", "String double quote Passed");

	resp = Mustache.render("{{{ name | add: last }}}", data);
	assert.equal( resp, "johndoe", "String as expression Passed");	

	resp = Mustache.render("{{{ name | add: ' \"Big\" ' | add: last }}}", data);
	assert.equal( resp, "john \"Big\" doe", "String single quoted containing double quotes Passed");

	resp = Mustache.render("{{{ name | add: \" 'Big' \" | add: last }}}", data);
	assert.equal( resp, "john 'Big' doe", "String double quoted containing single quotes Passed");
});
