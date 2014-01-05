var racun = require('../../racun');
var async = require('async');
var args = process.argv;

args.push('--paths example');
args.push('--debug');

module.exports = {
	setUp: function (callback) {
        racun.init(args);
		callback();
    },
	
	detectingClasses: function(test) {
		var docs = [];
		
		docs['classes'] = racun.getClassesFromPackage('Example');
		docs['functions'] = racun.getFunctionsFromPackage('Example');
		docs['globals'] = racun.getGlobalsFromPackage('Example');
		
		console.log('\nClasses');
		
		for ( var i in docs['classes'] ) {
			if ( docs['classes'][i] instanceof Array ) {
				for ( var n in docs['classes'][i] ) {
					console.log(n, docs['classes'][i][n]);
					console.log('\n');
				}
			} else {
				console.log(i, docs['classes'][i]);
				console.log('\n');
			}
		}
		
		console.log('\nFunctions');
		
		for ( var i in docs['functions'] ) {
			console.log(i, docs['functions'][i]);
			console.log('\n');
		}
		
		console.log('\nGlobals');
		
		for ( var i in docs['globals'] ) {
			console.log(i, docs['globals'][i]);
			console.log('\n');
		}

		test.done();
	}
};