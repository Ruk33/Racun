/*
 * Requirements
 */
var fs = require('fs');
var async = require('async');

function trim(s) {
	return s.replace(/^\s+|\s+$/g, '');
}

var racun = {
	conf: {
		paths: [],
		fileExtension: 'wurst'
	},
			
	args: [],
			
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
	
	getPackage: function(package) {
		return this.docs[package];
	},
	
	getClassesFromPackage: function(package) {
		return this.docs[package]['classes'];
	},
			
	getFunctionsFromPackage: function(package) {
		return this.docs[package]['functions'];
	},
	
	setPaths: function() {
		var paths,
			index;
		
		for ( index in this.args ) {
			if ( this.args[index].search('--paths') !== -1 ) {
				paths = this.args[index].split(' ');
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
		var name;
		var description;
		var tmpTags;
		var tags;
		
		this.docs[package] = [];
		this.docs[package]['classes'] = [];
		this.docs[package]['functions'] = [];
		
		for ( var i = 0, max = splitedSource.length; i < max; i++ ) {
			if ( ! splitedSource[i] || ! trim(splitedSource[i].replace(/[\t\n\r]/g, '')) ) {
				continue;
			}
			
			if ( /package .*/.test(splitedSource[i]) ) {
				continue;
			}
			
			// Check if we are in a class
			if ( ! actualClass && /class .*/.test(splitedSource[i]) ) {
				actualClass = splitedSource[i].split(' ')[1];
				
				this.docs[package]['classes'][actualClass] = [];
				this.docs[package]['classes'][actualClass]['properties'] = [];
				this.docs[package]['classes'][actualClass]['methods'] = [];
				
				continue;
			}
			
			if ( docs ) {
				tags = [];
				tmpTags = docs.toString().match(/@\w+ .*/g);
				description = trim(docs.toString().replace(/@(.*?) (.*)/g, '').replace(/\* /g, '').replace('/**', '').replace('*/', '').replace(/[\n\t]/g, ''));
				
				for ( var tag in tmpTags ) {
					tmpTags[tag] = tmpTags[tag].split(' ');
					tags[tmpTags[tag][0]] = tmpTags[tag][1];
				}
				
				if ( /function .*/.test(splitedSource[i]) ) {
					name = /function (.*?)\(\)/.exec(splitedSource[i])[1];
					
					if ( actualClass ) {
						this.docs[package]['classes'][actualClass]['methods'][name] = [];
						this.docs[package]['classes'][actualClass]['methods'][name]['description'] = description;
						this.docs[package]['classes'][actualClass]['methods'][name]['tags'] = tags;
					} else {
						this.docs[package]['functions'][name] = [];
						this.docs[package]['functions'][name]['description'] = description;
						this.docs[package]['functions'][name]['tags'] = tags;
					}
				} else {
					name = /(?:public )?\b\w+\b \b(\w+)\b/.exec(splitedSource[i].replace(/[\t\n]/g, ''))[1];
					
					this.docs[package]['classes'][actualClass]['properties'][name] = [];
					this.docs[package]['classes'][actualClass]['properties'][name]['description'] = description;
					this.docs[package]['classes'][actualClass]['properties'][name]['tags'] = tags;
				}
				
				name = null;
				description = null;
				tmpTags = null
				tags = null;
				docs = null;
			}
			
			if ( /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.test(splitedSource[i]) ) {
				docs = /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.exec(splitedSource[i]);
			} else {
				if ( actualClass && /function .*/.test(splitedSource[i]) && splitedSource[i].replace('\n', '').charAt(0) != '\t' ) {
					actualClass = null;
				}
			}
		}
		
		console.log('Package ' + package + ' documented!');
	},
	
	start: function() {
		var files;

		for ( var i in this.conf.paths ) {
			files = fs.readdirSync(this.conf.paths[i]);
			
			for ( var x in files ) {
				racun.writeDocumentation(fs.readFileSync(this.conf.paths[i] + '/' + files[x], 'utf8'));
			}
		}
	},
	
	init: function(args) {
		console.log('Documenting with Racun');
		
		this.args = args;
		this.setPaths();
		this.start();
	}
};

module.exports = racun;