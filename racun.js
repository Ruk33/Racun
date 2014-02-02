var Racun = require('./src/racun');
var args = process.argv;
var fs = require('fs');
var jsonGenerator = require('./src/jsonGenerator');
var racunInstance = new Racun();

function getDestinationPath(args) {
	var destinationPathIndex = args.indexOf('--destinationPath');
	
	if ( destinationPathIndex !== -1 && args[destinationPathIndex + 1] ) {
		return args[destinationPathIndex + 1];
	}
	
	return false;
}

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
	var folders;
	var files;
	
	if ( fs.lstatSync(path).isFile() ) {
		if ( path.lastIndexOf('.wurst') !== -1 ) {
			sources.push(fs.readFileSync(path, 'utf8'));
		}
	} else if ( fs.lstatSync(path).isDirectory() ) {
		folders = fs.readdirSync(path);
		
		for ( var i in folders ) {
			files = getSourcesFromPath(path + '/' + folders[i]);
			for ( var n in files ) {
				sources.push(files[n]);
			}
		}
		
		//for ( var i in folders ) {
			//sources.push(getSourcesFromPath(path + '/' + folders[i]));
			//sources.push(fs.readFileSync(path + '/' + folders[i], 'utf8'));
		//}
	}
	
	return sources;
}

function main(args) {
	var paths;
	var destinationPath;
	var sources;
	
	console.log('\n');
	console.log('==========================================');
	console.log('Racun - Document generator for wurst files');
	console.log('==========================================');
	
	if ( args.length <= 2 ) {
		console.log("--path path/one[,path/two] Path to the wurst files");
		console.log("--destinationPath path/one Path for the generated documentation");
	} else {
		paths = getPaths(args);
		destinationPath = getDestinationPath(args);
		
		if ( paths.length === 0 ) {
			console.log('Error: You have to provide some path.');
			console.log('Tip: You can include several paths separating them by a , (coma)');
			console.log('Example: --paths path/one,path/two/,path/to/three');
			
			return;
		}
		
		if ( ! destinationPath ) {
			console.log('Error: You must provide a destination path for the generated documentation');
			console.log('Example: --destinationPath c:/doc');
			
			return;
		}
		
		for ( var i in paths ) {
			sources = getSourcesFromPath(paths[i]);

			for ( var n in sources ) {
				racunInstance.generateDocumentationFor(sources[n]);
			}
		}
		
		console.log("Generating JSON files...");
		jsonGenerator(racunInstance, destinationPath);
		
		console.log("Done!");
	}
}

main(args);

module.exports = racunInstance;