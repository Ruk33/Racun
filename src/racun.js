/**
 * @param {String} s
 * @return {String}
 */
function trim(s) {
	return s.replace(/^\s+|\s+$/g, '');
}

var Racun = function() {
	var docs = [];
	
	var regexpr = {
		package: /package (.*?)(?=\n|\r)/,
		spliter: /((public )?class .*|[\t\s]*(public )?(abstract )?function .*|\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\/|(?!\t).+)/,
		docBlock: /\/\*\*[^*]*\*+(?:[^*/][^*]*\*+)*\//,
		function: /(?:abstract )?function (.*?)\(/,
		class: /(?:abstract )?(?:class )(\w+)/,
		abstract: /abstract/,
		public: /public/,
		visibility: /(private|protected)?/,
		constant: /constant/,
		static: /static/,
		array: /array/,
		docTags: /@(.*?) (.*)/g,
		globals: /(?:public )?(?:constant )?\b.+\b \b(\w+)\b/,
		defaultValue: /(?: *= *)(.*)/,
		property: /(?:public )?(?:constant )?\b.+\b \b(\w+)\b/
	};
	
	/**
	 * @return {Array}
	 */
	this.getPackages = function() {
		return docs;
	};
	
	/**
	 * @return {Array}
	 */
	this.getPackage = function(package) {
		for ( var i in docs ) {
			if ( docs[i].name == package ) {
				return docs[i];
			}
		}
		
		return [];
	};
	
	/**
	 * 
	 * @param {String} package
	 * @returns {Array}
	 */
	this.getClassesFromPackage = function(package) {
		var classes = this.getPackage(package);
		
		if ( classes.classes ) {
			classes = classes.classes;
		}
		
		return classes;
	};
	
	/**
	 * @param {String} package
	 * @param {String} className
	 * @returns {Array}
	 */
	this.getClassFromPackage = function(package, className) {
		var classes = this.getClassesFromPackage(package);
		
		for ( var i in classes ) {
			if ( classes[i].name == className ) {
				return classes[i];
			}
		}
		
		return [];
	};
	
	/**
	 * 
	 * @param {String} package
	 * @param {String} className
	 * @param {String} methodName
	 * @returns {Array}
	 */
	this.getMethodFromClass = function(package, className, methodName) {
		var packageClass = this.getClassFromPackage(package, className);
		var methods;
		
		if ( packageClass.methods ) {
			methods = packageClass.methods;
			for ( var i in methods ) {
				if ( methods[i].name == methodName ) {
					return methods[i];
				}
			}
		}
		
		return [];
	};
	
	/**
	 * 
	 * @param {String} package
	 * @param {String} className
	 * @param {String} propertyName
	 * @returns {Array}
	 */
	this.getPropertyFromClass = function(package, className, propertyName) {
		var packageClass = this.getClassFromPackage(package, className);
		var properties;
		
		if ( packageClass.properties ) {
			properties = packageClass.properties;
			for ( var i in properties ) {
				if ( properties[i].name == propertyName ) {
					return properties[i];
				}
			}
		}
		
		return [];
	};
	
	/**
	 * 
	 * @param {String} package
	 * @returns {Array}
	 */
	this.getFunctionsFromPackage = function(package) {
		var functions = this.getPackage(package);
		
		if ( functions.functions ) {
			functions = functions.functions;
		}
		
		return functions;
	};
	
	/**
	 * 
	 * @param {String} package
	 * @param {String} functionName
	 * @returns {Array}
	 */
	this.getFunctionFromPackage = function(package, functionName) {
		var functions = this.getFunctionsFromPackage(package);
		
		for ( var i in functions ) {
			if ( functions[i].name == functionName ) {
				return functions[i];
			}
		}
		
		return [];
	}
	
	/**
	 * 
	 * @param {String} package
	 * @returns {Array}
	 */
	this.getGlobalsFromPackage = function(package) {
		var globals = this.getPackage(package);
		
		if ( globals.globals ) {
			globals = globals.globals;
		}
		
		return globals;
	};
	
	/**
	 * 
	 * @param {String} package
	 * @param {String} globalName
	 * @returns {Array}
	 */
	this.getGlobalFromPackage = function(package, globalName) {
		var globals = this.getGlobalsFromPackage(package);
		
		for ( var i in globals ) {
			if ( globals[i].name == globalName ) {
				return globals[i];
			}
		}
		
		return [];
	}
	
	/**
	 * Obtain tags (like @return, @param) and description from block comment
	 * @param {String} commentBlock
	 * @returns {Object}
	 */
	var getDocumentationFromCommentBlock = function(commentBlock) {
		var tags = [];
		var tmpTags = commentBlock.toString().match(regexpr.docTags);

		// not all programers write an space
		// at the end of the comment, so we add it
		var description = commentBlock.toString().replace(regexpr.docTags, '').replace(/\n\t*\s*\* ?\/?/g, '\n').replace('/**', '').replace('*/', '').replace(/\t/g, '');
		description = trim(description.split('\n').join(' '));

		for ( var tag in tmpTags ) {
			tmpTags[tag] = tmpTags[tag].split(' ');
			tags[tmpTags[tag][0]] = tmpTags[tag][1];
		}
		
		return {
			description: description,
			tags: tags
		};
	}
	
	/**
	 * 
	 * @param {String} code
	 */
	this.generateDocumentationFor = function(code) {
		if ( ! code ) {
			return;
		}
		
		var packageDocumentation = {
			name: regexpr.package.exec(code)[1],
			code: code,
			globals: [],
			classes: [],
			functions: []
		};
		var splitedCode = code.replace(/\r/g, '').split(regexpr.spliter);
		var visibility;
		var docBlock;
		var actualClass = null;
		
		for ( var i = 0, max = splitedCode.length; i < max; i++ ) {
			if ( ! splitedCode[i] || ! trim(splitedCode[i].replace(/[\t\n\r]/g, '')) ) {
				continue;
			}
			
			if ( regexpr.package.test(splitedCode[i]) ) {
				continue;
			}
			
			if ( regexpr.docBlock.test(splitedCode[i]) ) {
				docBlock = regexpr.docBlock.exec(splitedCode[i]);
				continue;
			} else {
				if ( actualClass !== null && regexpr.function.test(splitedCode[i]) && splitedCode[i].replace('\n', '').charAt(0) != '\t' ) {
					actualClass = null;
				}
			}
			
			// Check if we are in a class
			if ( actualClass === null && regexpr.class.test(splitedCode[i]) ) {
				actualClass = packageDocumentation.classes.length;
				
				packageDocumentation.classes.push({
					name: regexpr.class.exec(splitedCode[i])[1],
					abstract: regexpr.abstract.test(splitedCode[i]),
					private: ! regexpr.public.test(splitedCode[i]),
					properties: [],
					methods: []
				});
				
				continue;
			}
			
			if ( docBlock ) {
				docBlock = getDocumentationFromCommentBlock(docBlock);
				visibility = regexpr.visibility.exec(splitedCode[i]);
				
				if ( visibility && visibility[1] ) {
					visibility = visibility[1];
				} else {
					visibility = 'public';
				}
				
				docBlock.visibility = visibility;
				docBlock.constant = regexpr.constant.test(splitedCode[i]);
				docBlock.array = regexpr.array.test(splitedCode[i]);
				docBlock.default = '';
					
				if ( regexpr.defaultValue.test(splitedCode[i]) ) {
					docBlock.default = regexpr.defaultValue.exec(splitedCode[i])[1];
				}
				
				// Check for global variables
				if ( actualClass === null && ! /(\t|function|class)/.test(splitedCode[i]) ) {
					docBlock.name = regexpr.globals.exec(splitedCode[i].replace(/[\t\n]/g, ''))[1];
					packageDocumentation.globals.push(docBlock);
				} else {
					if ( regexpr.function.test(splitedCode[i]) ) {
						docBlock.name = regexpr.function.exec(splitedCode[i])[1];
						
						if ( actualClass !== null ) {
							docBlock.static = regexpr.static.test(splitedCode[i]);
							docBlock.abstract = regexpr.abstract.test(splitedCode[i]);
							
							packageDocumentation.classes[actualClass].methods.push(docBlock);
						} else {
							packageDocumentation.functions.push(docBlock);
						}
					} else {
						docBlock.name = regexpr.property.exec(splitedCode[i].replace(/[\t\n]/g, ''))[1];
						docBlock.static = regexpr.static.test(splitedCode[i]);
						
						packageDocumentation.classes[actualClass].properties.push(docBlock);
					}
				}
				
				docBlock = null;
			}
		}
		
		docs.push(packageDocumentation);
		
		console.log('Package ' + packageDocumentation.name + ' documented!');
	};
};

module.exports = Racun;