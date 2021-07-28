
const expect = require('chai').expect;
const Mustache = require('mustache');
const Wax = require('../dist/mustache-wax.min.js');

describe(`Wax for Mustache ${Mustache.version}`, () => {
    Wax(Mustache, {
        "uppercase": (str) => {
            return str.toUpperCase();
        },
        "lowercase": (str) => {
            return str.toLowerCase();
        },
        "lpad": (str, num, sep) => {
            sep = sep || " ";
            str = "" + str;
            let filler = "";
            while ((filler.length + str.length) < num) { filler += sep };
            return (filler + str).slice(-num);
        },
        "date": (dt) => {
            const lpad = Mustache.Formatters.lpad, 
                day   = lpad(dt.getDate(), 2, "0"),
                month = lpad(dt.getMonth()+1, 2, "0");
            return  day + "/" + month + "/" + dt.getFullYear();
        },
        "add": (one, two) => {
            return one + two;
        },
        "wrap": (str, begin, end) => {
            return (begin + str + end);
        },
        "countArgs": (...args) => {
            return args.length;
        },
        "sumArgs": (...args) => {
            const l = args.length;
            let i = 0, sum = 0;
            for (; i < l; ++i) {
                sum += args[i];
            }
            return sum;
        }
    });

    describe("Normal expression without formatter", () => {
        it('Should keep backwards compatibility', () => { 
            const data = {name:"john"};
            
            const result = Mustache.render("{{name}}", data);
            expect(result).to.equal(data.name);

            const result2 = Mustache.render("{{&name}}", data);
            expect(result2).to.equal(data.name);
        })
    });

    describe("Expression with just one formatter", () => {
        const fmt  =  Mustache.Formatters;
        const data = {
            name:"john", 
            dob: new Date(1981,2,24)
        };

        it('Should call the formatter with the expression value as parameter', () => { 
            const result1 = Mustache.render("{{ name | uppercase }}", data);
            expect(result1).to.equal(fmt.uppercase(data.name));

            const result2 = Mustache.render("{{{ dob | date }}}", data);
            expect(result2).to.equal(fmt.date(data.dob));

            const result3 = Mustache.render("{{ name | countArgs }}", data);
            expect(result3).to.equal('' + fmt.countArgs(''));	
        })
    });

    describe( "Expressions with parameters", () => {
        const fmt  =  Mustache.Formatters;
        const data = { name: "john", age:20 };
        
        it('Should call formatter with one additional integer parameter', () => {
            const result1 = Mustache.render("{{ name | lpad:30 }}", data);
            expect(result1).to.equal(fmt.lpad(data.name, 30));
        })

        it('Should call formatter with one additional decimal parameter', () => {
            const result1 = Mustache.render("{{ age | add:0.5 }}", data);
            expect(result1).to.equal('' + fmt.add(data.age, 0.5));
        })
    
        it('Should call the formatter with one additional string parameter', () => {
            const result2 = Mustache.render("{{ name | add:' doe' }}", data);
            expect(result2).to.equal(fmt.add(data.name, ' doe'));
        })
    
        it('should call the formatter with multiple additional string parameters', () => {
            const result3 = Mustache.render("{{ name | wrap : '^' : '$' }}", data);
            expect(result3).to.equal(fmt.wrap(data.name, '^', '$'));
        })
    
        it('should call the formatter with multiple additional integer parameters', () => {
            const result4 = Mustache.render("{{ name | sumArgs: 1: 2: 3: 4: 5 }}", data);
            expect(result4).to.equal('' + fmt.sumArgs(data.name, 1, 2, 3, 4, 5));
        })
    
        it('should call the formatter with multiple additional decimal parameters', () => {
            const result5 = Mustache.render("{{ age | sumArgs: 0.1: 0.2: 0.3: 0.4: 0.5: 0.6: 0.7: 0.8: 0.9: 1.0 }}", data);
            expect(result5).to.equal('' + fmt.sumArgs(data.age, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0));
        })
    });
    
    describe( "Chained Formatters", () => {
        const fmt = Mustache.Formatters;
        const data = {name:"John Doe", age:30};
    
        it('Should call formatters in order', () => {
            const result1 = Mustache.render("{{ name | lowercase | uppercase }}", data);
            expect(result1).to.equal(fmt.uppercase(fmt.lowercase(data.name)));
        })

        it('Should support parameters for the formatters', () => {
            const result2 = Mustache.render("{{ name | lpad:10:'*' | lpad:20:'#' }}", data);
            expect(result2).to.equal(fmt.lpad(fmt.lpad(data.name, 10, '*'), 20, '#'));
        })
    
        it('Should support many formatters with parameters', () => {
            const result3 = Mustache.render("{{ age | add:10 | add:5 | add: 3 | add: -7 | add:-11 }}", data);
            expect(result3).to.equal('' + data.age);
        })
    });
    
    
    describe( "Parameter types", () => {
        const data = {zero:0, pi:3.14159, name:"john", last:"doe"};

        it('Should allow integer parameters', () => {
            const result1 = Mustache.render("{{ zero | add: 1 }}", data);
            expect(result1).to.equal('1');

            const result2 = Mustache.render("{{ zero | add: +1 }}", data);
            expect(result2).to.equal('1');

            const result3 = Mustache.render("{{ zero | add: -1 }}", data);
            expect(result3).to.equal('-1');
        })
        
        it('Should allow decimal parameters', () => {
            const result4 = Mustache.render("{{ zero | add: 1.25 }}", data);
            expect(result4).to.equal('1.25');
        
            const result5 = Mustache.render("{{ zero | add: +1.25 }}", data);
            expect(result5).to.equal('1.25');
        
            const result6 = Mustache.render("{{ zero | add: -1.25 }}", data);
            expect(result6).to.equal('-1.25');
        })
    
        it('Should allow other expressions as parameters', () => {
            const result7 = Mustache.render("{{ zero | add: pi }}", data);
            expect(result7).to.equal('' + data.pi);

            const result10 = Mustache.render("{{ name | add: last }}", data);
            expect(result10).to.equal("johndoe");	
        })
    
        it('Should allow quoted string parameters', () => {
            const result8 = Mustache.render("{{ name | add: 'atan' }}", data);
            expect(result8).to.equal("johnatan");
        
            const result9 = Mustache.render("{{ name | add: \"atan\" }}", data);
            expect(result9).to.equal("johnatan");

            const result11 = Mustache.render("{{{ name | add: ' \"Big\" ' | add: last }}}", data);
            expect(result11).to.equal("john \"Big\" doe");
        
            const result12 = Mustache.render("{{{ name | add: \" 'Big' \" | add: last }}}", data);
            expect(result12).to.equal("john 'Big' doe");    
        })        
    });    
});