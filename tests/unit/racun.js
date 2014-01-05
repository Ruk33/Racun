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
		var classes = racun.getClassesFromPackage('Example');

		for ( var i in classes ) {
			console.log('properties', classes[i]['properties']);
		}

		test.done();
	}
};