exports.testSomething = function(test){
    test.equals(1, 1, "this should be one");
    test.ok(true, "this assertion should pass");
    test.done();
};

var racun = require('../../racun');

exports.detectingClasses = function(test) {
	console.log(racun.init);
	test.done();
};