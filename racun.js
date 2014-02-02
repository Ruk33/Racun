var Racun = require('./src/racun');
var args = process.argv;
var fs = require('fs');
var pageGenerator = require('./src/pageGenerator');
var racunInstance = new Racun();

function getPaths(args) {
	var paths = [];
	var pathIndex = args.indexOf('--paths');
	
	if ( pathIndex !== -1 && args[pathIndex + 1] ) {
		paths = args[pathIndex + 1].split(',');
	}
	
	return paths;
}

function getSourcesFromPath(path) {
	var sources = [];
	var files;
	
	if ( fs.lstatSync(path).isFile() ) {
		sources.push(fs.readFileSync(path, 'utf8'));
	} else if ( fs.lstatSync(path).isDirectory() ) {
		files = fs.readdirSync(path);
		
		for ( var i in files ) {
			sources.push(fs.readFileSync(path + '/' + files[i], 'utf8'));
		}
	}
	
	return sources;
}

function main(args) {
	var paths;
	var sources;
	
	console.log('\n');
	console.log('==========================================');
	console.log('Racun - Document generator for wurst files');
	console.log('==========================================');
	
	if ( args.length <= 2 ) {
		console.log("Help: to-do, sorry <.<");
	} else {
		paths = getPaths(args);
		
		if ( paths.length === 0 ) {
			console.log('Error: You have to provide some path.');
			console.log('Tip: You can include several paths separating them by a , (coma)');
			console.log('Example: path/one,path/two/,path/to/three');
		} else {
			for ( var i in paths ) {
				sources = getSourcesFromPath(paths[i]);
				
				for ( var n in sources ) {
					racunInstance.generateDocumentationFor(sources[n]);
				}
			}
			
			if ( fs.readdirSync('c:/doc').length > 0 ) {
				console.log('Error: You must specify an empty directory to the generated pages');
			} else {
				pageGenerator(racunInstance, 'templates/default', 'c:/doc');
			}
		}
	}
}

main(args);

module.exports = racunInstance;