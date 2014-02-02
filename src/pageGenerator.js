var swig = require('swig');
var fs = require('fs');
var ncp = require('ncp');

/**
 * 
 * @param {String} pathName
 * @param {String} destinationPath
 * @param {Object} variables
 */
var generateFile = function(pathName, destinationPath, variables) {
	var template = swig.renderFile(pathName, variables);
	fs.writeFileSync(destinationPath, template);
};

/**
 * 
 * @param {Racun} racunInstance
 * @param {String} templatesFolder
 * @param {String} destinationPath
 */
var pageGenerator = function(racunInstance, templatesFolder, destinationPath) {
	var packages = racunInstance.getPackages();
	var classes;
	var methods;
	var properties;
	var functions;
	var globals;
	
	// thanks for being so magical *3*
	ncp(templatesFolder + '/css', destinationPath + '/css');
	ncp(templatesFolder + '/fonts', destinationPath + '/fonts');
	ncp(templatesFolder + '/img', destinationPath + '/img');
	ncp(templatesFolder + '/js', destinationPath + '/js');
	ncp(templatesFolder + '/layout', destinationPath + '/layout');
	
	fs.mkdirSync(destinationPath + '/package');
	
	generateFile(templatesFolder + '/index.html', destinationPath + '/index.html', { docs: racunInstance });
	generateFile(templatesFolder + '/packages.html', destinationPath + '/packages.html', { docs: racunInstance });
	
	for ( var p in packages ) {
		fs.mkdirSync(destinationPath + '/package/' + packages[p].name);

		fs.mkdirSync(destinationPath + '/package/' + packages[p].name + '/class');
		fs.mkdirSync(destinationPath + '/package/' + packages[p].name + '/function');
		fs.mkdirSync(destinationPath + '/package/' + packages[p].name + '/global');

		generateFile(
			templatesFolder + '/package/package-name.html', 
			destinationPath + '/package/' + packages[p].name + '.html', 
			{ docs: racunInstance, package: packages[p] }
		);

		classes = racunInstance.getClassesFromPackage(packages[p].name);
		functions = racunInstance.getFunctionsFromPackage(packages[p].name);
		globals = racunInstance.getGlobalsFromPackage(packages[p].name);

		generateFile(
			templatesFolder + '/package/package-name/classes.html', 
			destinationPath + '/package/' + packages[p].name + '/classes.html', 
			{
				docs: racunInstance,
				package: packages[p],
				classes: classes
			}
		);

		generateFile(
			templatesFolder + '/package/package-name/functions.html', 
			destinationPath + '/package/' + packages[p].name + '/functions.html', 
			{ 
				docs: racunInstance,
				package: packages[p],
				functions: functions
			}
		);

		generateFile(
			templatesFolder + '/package/package-name/globals.html', 
			destinationPath + '/package/' + packages[p].name + '/globals.html', 
			{ 
				docs: racunInstance,
				package: packages[p],
				globals: globals 
			}
		);

		for ( var c in classes ) {
			fs.mkdirSync(destinationPath + '/package/' + packages[p].name + '/class/' + classes[c].name);
			fs.mkdirSync(destinationPath + '/package/' + packages[p].name + '/class/' + classes[c].name + '/method');
			fs.mkdirSync(destinationPath + '/package/' + packages[p].name + '/class/' + classes[c].name + '/property');

			methods = classes[c].methods;
			properties = classes[c].properties;

			for ( var m in methods ) {
				generateFile(
					templatesFolder + '/package/package-name/class/method/method-name.html', 
					destinationPath + '/package/' + packages[p].name + '/class/' + classes[c].name + '/method/' + methods[m].name + '.html', 
					{ 
						docs: racunInstance, 
						package: packages[p],
						class: classes[c],
						method: methods[m] 
					}
				);
			}

			for ( var pr in properties ) {
				generateFile(
					templatesFolder + '/package/package-name/class/property/property-name.html', 
					destinationPath + '/package/' + packages[p].name + '/class/' + classes[c].name + '/property/' + properties[pr].name + '.html', 
					{
						docs: racunInstance,
						package: packages[p],
						class: classes[c],
						property: properties[pr]
					}
				);
			}
		}
		
		for ( var f in functions ) {
			generateFile(
				templatesFolder + '/package/package-name/function/function-name.html', 
				destinationPath + '/package/' + packages[p].name + '/function/' + functions[f].name + '.html', 
				{
					docs: racunInstance,
					package: packages[p],
					function: functions[f]
				}
			);
		}

		for ( var g in globals ) {
			generateFile(
				templatesFolder + '/package/package-name/global/global-name.html', 
				destinationPath + '/package/' + packages[p].name + '/global/' + globals[g].name + '.html', 
				{
					docs: racunInstance, 
					package: packages[p],
					global: globals[pr]
				}
			);
		}
	}
}

module.exports = pageGenerator;