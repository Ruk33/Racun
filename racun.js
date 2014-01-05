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
	
	getPackages: function() {
		return this.docs;
	},
	
	getPackage: function(package) {
		return this.docs[package];
	},
	
	getClassesFromPackage: function(package) {
		return this.docs[package]['classes'];
	},
			
	getFunctionsFromPackage: function(package) {
		return this.docs[package]['functions'];
	},
			
	getGlobalsFromPackage: function(package) {
		return this.docs[package]['globals'];
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
		var splitedSource = source.replace(/\r/g, '').split(/((public )?class .*|[\t\s]*(public )?(abstract )?function .*|\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\/|(?!\t).+)/);
		var actualClass = null;
		var docs = null;
		var name;
		var description;
		var tmpTags;
		var tags;
		var visibility;
		var isConstant;
		var isStatic;
		var isArray;
		
		this.docs[package] = [];
		this.docs[package]['globals'] = [];
		this.docs[package]['classes'] = [];
		this.docs[package]['functions'] = [];
		
		for ( var i = 0, max = splitedSource.length; i < max; i++ ) {
			if ( ! splitedSource[i] || ! trim(splitedSource[i].replace(/[\t\n\r]/g, '')) ) {
				continue;
			}
			
			if ( /package .*/.test(splitedSource[i]) ) {
				continue;
			}
			
			if ( /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.test(splitedSource[i]) ) {
				docs = /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.exec(splitedSource[i]);
				continue;
			} else {
				if ( actualClass && /function .*/.test(splitedSource[i]) && splitedSource[i].replace('\n', '').charAt(0) != '\t' ) {
					actualClass = null;
				}
			}
			
			// Check if we are in a class
			if ( ! actualClass && /class .*/.test(splitedSource[i]) ) {
				actualClass = /(?:abstract )?(?:class )(\w+)/.exec(splitedSource[i])[1];
				
				this.docs[package]['classes'][actualClass] = [];
				this.docs[package]['classes'][actualClass]['name'] = actualClass;
				this.docs[package]['classes'][actualClass]['abstract'] = /abstract/.test(splitedSource[i]);
				this.docs[package]['classes'][actualClass]['private'] = ! /public/.test(splitedSource[i]);
				this.docs[package]['classes'][actualClass]['properties'] = [];
				this.docs[package]['classes'][actualClass]['methods'] = [];
				
				continue;
			}
			
			if ( docs ) {
				tags = [];
				tmpTags = docs.toString().match(/@\w+ .*/g);
				description = trim(docs.toString().replace(/@(.*?) (.*)/g, '').replace(/\* /g, '').replace('/**', '').replace('*/', '').replace(/[\n\t]/g, ''));
				visibility = /(private|protected)?/.exec(splitedSource[i]);
				isConstant = isConstant = /constant/.test(splitedSource[i]);
				isStatic = /static/.test(splitedSource[i]);
				isArray = /array/.test(splitedSource[i]);
				
				if ( visibility && visibility[1] ) {
					visibility = visibility[1];
				} else {
					visibility = 'public';
				}
				
				for ( var tag in tmpTags ) {
					tmpTags[tag] = tmpTags[tag].split(' ');
					tags[tmpTags[tag][0]] = tmpTags[tag][1];
				}
				
				// Check for global variables
				if ( ! actualClass && ! /(\t|function|class)/.test(splitedSource[i]) && docs ) {
					name = /(?:public )?(?:constant )?\b.+\b \b(\w+)\b/.exec(splitedSource[i].replace(/[\t\n]/g, ''))[1];
					
					this.docs[package]['globals'][name] = [];
					this.docs[package]['globals'][name]['description'] = description;
					this.docs[package]['globals'][name]['tags'] = tags;
					this.docs[package]['globals'][name]['visibility'] = visibility;
					this.docs[package]['globals'][name]['constant'] = isConstant;
					this.docs[package]['globals'][name]['array'] = isArray;
					
					if ( /(?: *= *)(.*)/.test(splitedSource[i]) ) {
						this.docs[package]['globals'][name]['default'] = /(?: *= *)(.*)/.exec(splitedSource[i])[1];
					}
				} else {
					if ( /(?:abstract )?function .*/.test(splitedSource[i]) ) {
						name = /(?:abstract )?function (.*?)\(/.exec(splitedSource[i])[1];
						
						if ( actualClass ) {
							this.docs[package]['classes'][actualClass]['methods'][name] = [];
							this.docs[package]['classes'][actualClass]['methods'][name]['description'] = description;
							this.docs[package]['classes'][actualClass]['methods'][name]['tags'] = tags;
							this.docs[package]['classes'][actualClass]['methods'][name]['visibility'] = visibility;
							this.docs[package]['classes'][actualClass]['methods'][name]['static'] = isStatic;
							this.docs[package]['classes'][actualClass]['methods'][name]['abstract'] = /abstract/.test(splitedSource[i]);
						} else {
							this.docs[package]['functions'][name] = [];
							this.docs[package]['functions'][name]['description'] = description;
							this.docs[package]['functions'][name]['tags'] = tags;
							this.docs[package]['functions'][name]['visibility'] = visibility;
						}
					} else {
						name = /(?:public )?(?:constant )?\b.+\b \b(\w+)\b/.exec(splitedSource[i].replace(/[\t\n]/g, ''))[1];

						this.docs[package]['classes'][actualClass]['properties'][name] = [];
						this.docs[package]['classes'][actualClass]['properties'][name]['description'] = description;
						this.docs[package]['classes'][actualClass]['properties'][name]['tags'] = tags;
						this.docs[package]['classes'][actualClass]['properties'][name]['visibility'] = visibility;
						this.docs[package]['classes'][actualClass]['properties'][name]['static'] = isStatic;
						this.docs[package]['classes'][actualClass]['properties'][name]['constant'] = isConstant && isStatic;
						this.docs[package]['classes'][actualClass]['properties'][name]['array'] = isArray;
						
						if ( /(?: *= *)(.*)/.test(splitedSource[i]) ) {
							this.docs[package]['classes'][actualClass]['properties'][name]['default'] = /(?: *= *)(.*)/.exec(splitedSource[i])[1];
						}
					}
				}
				
				name = null;
				description = null;
				tmpTags = null;
				tags = null;
				docs = null;
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