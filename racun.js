/*
 * Requirements
 */
var fs = require('fs');
var async = require('async');

var args = process.argv.slice(2);

function trim(s) {
	return s.replace(/^\s+|\s+$/g, '');
}

var racun = {
	conf: {
		paths: [],
		fileExtension: 'wurst'
	},
			
	regexpr: {
		
	},
			
	/*
	 * example:
	 * docs['path/to/file.extension'] = [
	 *		'classes' => [
	 *			'name' => 'name',
	 *			'attributes' => [
	 *				'name' => 'name',
	 *				'description' => 'text above name'
	 *				'tags' => [
	 *					'@type' => 'unit'
	 *				]
	 *			],
	 *			'methods' => [same as attributes]
	 *		]
	 * ]
	 */
	docs: [],
	
	setPaths: function() {
		var paths,
			index;
		
		for ( index in args ) {
			if ( args[index].search('--paths') !== -1 ) {
				paths = args[index].split(' ');
				this.conf.paths = paths[1].split(',');
				
				break;
			}
		}
		
		if ( this.conf.paths.length === 0 ) {
			this.conf.paths[0] = '.';
		}
	},
	
	writeDocumentation: function(source) {
		var packageLine = /package (.*?)(?=\n|\r)/.exec(source);
		var package = packageLine[1];
		var splitedSource = source.replace(/\r/g, '').split(/([\t\s]*(class|function) .*|\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\/)/);
		var actualClass = null;
		var docs = null;
		var property;
		var tags;
		var method;
		
		this.docs[package] = [];
		this.docs[package]['classes'] = [];
		
		for ( var i = 0, max = splitedSource.length; i < max; i++ ) {
			if ( ! splitedSource[i] || ! trim(splitedSource[i].replace(/[\t\n\r]/g, '')) ) {
				continue;
			}
			
			if ( /package .*/.test(splitedSource[i]) ) {
				continue;
			}
			
			// Check if we are in a class
			if ( /class .*/.test(splitedSource[i]) ) {
				actualClass = splitedSource[i].split(' ')[1];
				
				this.docs[package]['classes'][actualClass] = [];
				this.docs[package]['classes'][actualClass]['properties'] = [];
				this.docs[package]['classes'][actualClass]['methods'] = [];
				
				continue;
			}
			
			if ( docs ) {
				console.log(docs);
				console.log(splitedSource[i]);
				if ( /function .*/.test(splitedSource[i]) ) {
					if ( actualClass ) {
						//console.log('method');
					} else {
						//console.log('function');
					}
				} else {
					//console.log('property');
				}
				
				docs = null;
			}
			
			if ( /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.test(splitedSource[i]) ) {
				docs = /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.exec(splitedSource[i]);
			} else {
				if ( actualClass && /function .*/.test(splitedSource[i]) && splitedSource[i].replace('\n', '').charAt(0) != '\t' ) {
					console.log('salimos de class', splitedSource[i]);
					actualClass = null;
				}
			}
		}
	},
	
	start: function() {
		for ( var path in this.conf.paths ) {
			fs.readdir(this.conf.paths[path], function(error, list) {
				if ( error ) {
					console.error('There was an error', error);
				}
				
				list.forEach(function(file) {
					fs.readFile(racun.conf.paths[path] + '/' + file, 'utf8', function(error, source) {
						if ( error ) {
							console.error('There was an error reading the file', error);
						}
						
						racun.writeDocumentation(source);
					});
				});
			});
		}
	},
	
	init: function() {
		console.log('Documenting with Racun');
		
		this.setPaths();
		this.start();
	}
};

/*args.push('--paths example');
args.push('--debug');
racun.init();*/

module.exports = racun;