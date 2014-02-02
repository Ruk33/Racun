var fs = require('fs');

/**
 * 
 * @param {Racun} racunInstance
 * @param {String} destinationPath
 */
var pageGenerator = function(racunInstance, destinationPath) {
	var packages = racunInstance.getPackages();
	var classes;
	var methods;
	var properties;
	var functions;
	var globals;
	
	fs.mkdirSync(destinationPath + '/documentation');
	fs.writeFileSync(destinationPath + '/documentation/packages.json', JSON.stringify(packages));
	
	for ( var p in packages ) {
		fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name);
		fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name + '/class');
		fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name + '/function');
		fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name + '/global');
		
		classes = racunInstance.getClassesFromPackage(packages[p].name);
		
		for ( var c in classes ) {
			fs.writeFileSync(destinationPath + '/documentation/' + packages[p].name + '/class/' + classes[c].name + '.json', JSON.stringify(classes[c]));
			
			fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name + '/class/' + classes[c].name);
			fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name + '/class/' + classes[c].name + '/method');
			fs.mkdirSync(destinationPath + '/documentation/' + packages[p].name + '/class/' + classes[c].name + '/property');
			
			methods = classes[c].methods;
			properties = classes[c].properties;
			
			for ( var m in methods ) {
				fs.writeFileSync(destinationPath + '/documentation/' + packages[p].name + '/class/' + classes[c].name + '/method/' + methods[m].name + '.json', JSON.stringify(methods[m]));
			}
			
			for ( var pr in properties ) {
				fs.writeFileSync(destinationPath + '/documentation/' + packages[p].name + '/class/' + classes[c].name + '/property/' + properties[pr].name + '.json', JSON.stringify(properties[pr]));
			}
		}
		
		functions = racunInstance.getFunctionsFromPackage(packages[p].name);
		
		for ( var f in functions ) {
			fs.writeFileSync(destinationPath + '/documentation/' + packages[p].name + '/function/' + functions[f].name + '.json', JSON.stringify(functions[f]));
		}
		
		globals = racunInstance.getGlobalsFromPackage(packages[p].name);
		
		for ( var g in globals ) {
			fs.writeFileSync(destinationPath + '/documentation/' + packages[p].name + '/global/' + globals[g].name + '.json', JSON.stringify(globals[g]));
		}
	}
};

module.exports = pageGenerator;