/*
 * Requirements
 */
var fs = require('fs');
//var path = require('path');
var swig = require('swig');

/**
 * @param string s
 * @return string
 */
function trim(s) {
	return s.replace(/^\s+|\s+$/g, '');
}

var racun = {
	conf: {
		/**
		 * Paths of files/folders
		 * to generate documentation
		 * pages
		 * 
		 * @type Array
		 */
		paths: [],
				
		/**
		 * Which style to use?
		 * 
		 * @type string
		 * @default 'default'
		 */
		style: 'default',
				
		/**
		 * Path where the html files
		 * will be generated
		 * 
		 * @type string
		 */
		generateIn: 'c:/doc',
				
		/**
		 * Extension of files
		 * 
		 * @type string
		 * @default 'wurst'
		 */
		fileExtension: 'wurst'
	},
	
	// Arguments being passed in command
	args: [],
	
	// to do
	regexpr: {
		
	},
	
	// Documentation pulled from files
	docs: {},
	
	/**
	 * @return Array
	 */
	getPackages: function() {
		return this.docs;
	},
	
	/**
	 * @return Array
	 */
	getPackage: function(package) {
		return this.docs[package];
	},
	
	/**
	 * @return Array
	 */
	getClassesFromPackage: function(package) {
		return this.docs[package]['classes'];
	},
	
	/**
	 * @return Array
	 */
	getFunctionsFromPackage: function(package) {
		return this.docs[package]['functions'];
	},
	
	/**
	 * @return Array
	 */
	getGlobalsFromPackage: function(package) {
		return this.docs[package]['globals'];
	},
	
	/**
	 * Set paths to folders/files
	 * 
	 * @return boolean
	 */
	setPaths: function() {
		var pathIndex = this.args.indexOf('--paths');
		
		if ( pathIndex != -1 && this.args[pathIndex + 1] ) {
			this.conf.paths = this.args[pathIndex + 1].split(',');
		} else {
			console.log('Error: You have to provide some path.');
			console.log('Tip: You can include several paths separating them by a , (coma)');
			console.log('Example: path/one,path/two/path/to/three');
			
			return false;
		}
		
		return true;
	},
			
	generatePages: function() {
		var packages = this.getPackages();
		var classes;
		var functions;
		var methods;
		var properties;
		var globals;
		var templateFolder = 'templates/' + this.conf.style;
		var template;
		
		if ( fs.existsSync(this.conf.generateIn + '/package') ) {
			console.log('Error: The directory where the documentation pages will be generated already exists. Try deleting it.');
			return false;
		}
		
		fs.mkdirSync(this.conf.generateIn + '/package');
		
		template = swig.renderFile(templateFolder + '/index.html', { 
			docs: this.docs
		});
		
		fs.writeFileSync(this.conf.generateIn + '/index.html', template);
		
		template = swig.renderFile(templateFolder + '/packages.html', {
			packages: packages, 
			docs: this.docs
		});
		
		fs.writeFileSync(this.conf.generateIn + '/packages.html', template);
		
		for ( var p in packages ) {
			template = swig.renderFile(templateFolder + '/package/package-name.html', {
				package: packages[p], 
				docs: this.docs
			});
			
			fs.mkdirSync(this.conf.generateIn + '/package/' + p);
			fs.writeFileSync(this.conf.generateIn + '/package/' + p + '.html', template);
			
			fs.mkdirSync(this.conf.generateIn + '/package/' + p + '/class');
			fs.mkdirSync(this.conf.generateIn + '/package/' + p + '/function');
			fs.mkdirSync(this.conf.generateIn + '/package/' + p + '/global');
			
			classes = this.getClassesFromPackage(p);			
			globals = this.getGlobalsFromPackage(p);
			functions = this.getFunctionsFromPackage(p);
			
			template = swig.renderFile(templateFolder + '/package/package-name/classes.html', {
				classes: classes, 
				docs: this.docs
			});

			fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/classes.html', template);
			
			template = swig.renderFile(templateFolder + '/package/package-name/globals.html', {
				globals: globals, 
				docs: this.docs
			});

			fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/globals.html', template);
			
			template = swig.renderFile(templateFolder + '/package/package-name/functions.html', {
				functions: functions, 
				docs: this.docs
			});

			fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/functions.html', template);
			
			for ( var c in classes ) {
				if ( c == 'length' ) {
					continue;
				}
				
				fs.mkdirSync(this.conf.generateIn + '/package/' + p + '/class/' + c);
				fs.mkdirSync(this.conf.generateIn + '/package/' + p + '/class/' + c + '/method');
				fs.mkdirSync(this.conf.generateIn + '/package/' + p + '/class/' + c + '/property');
				
				methods = classes[c]['methods'];
				properties = classes[c]['properties'];
				
				for ( var m in methods ) {
					if ( m == 'length' ) {
						continue;
					}
					
					template = swig.renderFile(templateFolder + '/package/package-name/class/method/method-name.html', {
						method: methods[m],
						docs: this.docs
					});
					
					fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/class/' + c + '/method/' + m + '.html', template);
				}
				
				for ( var pr in properties ) {
					if ( pr == 'length' ) {
						continue;
					}
					
					template = swig.renderFile(templateFolder + '/package/package-name/class/property/property-name.html', {
						property: properties[pr],
						docs: this.docs
					});
					
					fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/class/' + c + '/property/' + pr + '.html', template);
				}
			}
			
			for ( var g in globals ) {
				if ( g == 'length' ) {
					continue;
				}
				
				template = swig.renderFile(templateFolder + '/package/package-name/global/global-name.html', {
					global: globals[g], 
					docs: this.docs
				});
				
				fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/global/' + g + '.html', template);
			}
			
			for ( var f in functions ) {
				if ( f == 'length' ) {
					continue;
				}
				
				template = swig.renderFile(templateFolder + '/package/package-name/function/function-name.html', {
					'function': functions[f], 
					docs: this.docs
				});
				
				fs.writeFileSync(this.conf.generateIn + '/package/' + p + '/function/' + f + '.html', template);
			}
		}
	},
	
	/**
	 * @param source
	 */
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
		
		this.docs[package] = {};
		this.docs[package]['code'] = source;
		this.docs[package]['globals'] = { length: 0 };
		this.docs[package]['classes'] = { length: 0 };
		this.docs[package]['functions'] = { length: 0 };
		
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
				
				this.docs[package]['classes'][actualClass] = {};
				this.docs[package]['classes'][actualClass]['name'] = actualClass;
				this.docs[package]['classes'][actualClass]['abstract'] = /abstract/.test(splitedSource[i]);
				this.docs[package]['classes'][actualClass]['private'] = ! /public/.test(splitedSource[i]);
				this.docs[package]['classes'][actualClass]['properties'] = { length: 0 };
				this.docs[package]['classes'][actualClass]['methods'] = { length: 0 };
				
				this.docs[package]['classes'].length++;
				
				continue;
			}
			
			if ( docs ) {
				tags = [];
				tmpTags = docs.toString().match(/@\w+ .*/g);
				
				// not all programers write an space
				// at the end of the comment, so we add it
				description = docs.toString().replace(/@(.*?) (.*)/g, '').replace(/\n\t*\s*\* ?\/?/g, '\n').replace('/**', '').replace('*/', '').replace(/\t/g, '');
				description = trim(description.split('\n').join(' '));
				
				visibility = /(private|protected)?/.exec(splitedSource[i]);
				isConstant = /constant/.test(splitedSource[i]);
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
					this.docs[package]['globals'][name]['name'] = name;
					this.docs[package]['globals'][name]['description'] = description;
					this.docs[package]['globals'][name]['tags'] = tags;
					this.docs[package]['globals'][name]['visibility'] = visibility;
					this.docs[package]['globals'][name]['constant'] = isConstant;
					this.docs[package]['globals'][name]['array'] = isArray;
					this.docs[package]['globals'][name]['default'] = '';
					
					if ( /(?: *= *)(.*)/.test(splitedSource[i]) ) {
						this.docs[package]['globals'][name]['default'] = /(?: *= *)(.*)/.exec(splitedSource[i])[1];
					}
					
					this.docs[package]['globals'].length++;
				} else {
					if ( /(?:abstract )?function .*/.test(splitedSource[i]) ) {
						name = /(?:abstract )?function (.*?)\(/.exec(splitedSource[i])[1];
						
						if ( actualClass ) {
							this.docs[package]['classes'][actualClass]['methods'][name] = [];
							this.docs[package]['classes'][actualClass]['methods'][name]['name'] = name;
							this.docs[package]['classes'][actualClass]['methods'][name]['description'] = description;
							this.docs[package]['classes'][actualClass]['methods'][name]['tags'] = tags;
							this.docs[package]['classes'][actualClass]['methods'][name]['visibility'] = visibility;
							this.docs[package]['classes'][actualClass]['methods'][name]['static'] = isStatic;
							this.docs[package]['classes'][actualClass]['methods'][name]['abstract'] = /abstract/.test(splitedSource[i]);
							
							this.docs[package]['classes'][actualClass]['methods'].length++;
						} else {
							this.docs[package]['functions'][name] = [];
							this.docs[package]['functions'][name]['name'] = name;
							this.docs[package]['functions'][name]['description'] = description;
							this.docs[package]['functions'][name]['tags'] = tags;
							this.docs[package]['functions'][name]['visibility'] = visibility;
							
							this.docs[package]['functions'].length++;
						}
					} else {
						name = /(?:public )?(?:constant )?\b.+\b \b(\w+)\b/.exec(splitedSource[i].replace(/[\t\n]/g, ''))[1];

						this.docs[package]['classes'][actualClass]['properties'][name] = [];
						this.docs[package]['classes'][actualClass]['properties'][name]['name'] = name;
						this.docs[package]['classes'][actualClass]['properties'][name]['description'] = description;
						this.docs[package]['classes'][actualClass]['properties'][name]['tags'] = tags;
						this.docs[package]['classes'][actualClass]['properties'][name]['visibility'] = visibility;
						this.docs[package]['classes'][actualClass]['properties'][name]['static'] = isStatic;
						this.docs[package]['classes'][actualClass]['properties'][name]['constant'] = isConstant && isStatic;
						this.docs[package]['classes'][actualClass]['properties'][name]['array'] = isArray;
						this.docs[package]['classes'][actualClass]['properties'][name]['default'] = '';
						
						if ( /(?: *= *)(.*)/.test(splitedSource[i]) ) {
							this.docs[package]['classes'][actualClass]['properties'][name]['default'] = /(?: *= *)(.*)/.exec(splitedSource[i])[1];
						}
						
						this.docs[package]['classes'][actualClass]['properties'].length++;
					}
				}
				
				docs = null;
			}
		}
		
		console.log('Package ' + package + ' documented!');
	},
	
	/**
	 * Iterate throw every file/folder
	 * and extract its documentation
	 */
	start: function() {
		var files;

		for ( var i in this.conf.paths ) {
			// if relative path is entered, this returns false
			//if ( fs.exists(this.conf.paths[i]) || fs.exists(path.resolve(process.cwd(), this.conf.paths[i])) ) {
				if ( fs.lstatSync(this.conf.paths[i]).isFile() ) {
					racun.writeDocumentation(fs.readFileSync(this.conf.paths[i], 'utf8'));
				} else if ( fs.lstatSync(this.conf.paths[i]).isDirectory() ) {
					files = fs.readdirSync(this.conf.paths[i]);

					for ( var x in files ) {
						racun.writeDocumentation(fs.readFileSync(this.conf.paths[i] + '/' + files[x], 'utf8'));
					}
				} else {
					console.log('Eror: Path "' + this.conf.paths[i] + '" does not seems to be a directory or file');
				}
			//} else {
			//	console.log('Error: Path "' + this.conf.paths[i] + '" seems to be incorrect (does not exist)');
			//}
		}
	},
	
	/**
	 * Initializer
	 * 
	 * @param Array args Arguments passed to the shell
	 */
	init: function(args) {
		console.log('\n==========================================');
		console.log('Racun - Document generator for wurst files');
		console.log('==========================================');
		
		if ( args.length <= 2 ) {
			console.log('Help: to do, sorry <.<');
		} else {
			this.args = args;
			if ( this.setPaths() ) {
				this.start();
				this.generatePages();
			}
		}
	}
};

module.exports = racun;