![](http://i.imgur.com/LiS4nP2.png)

Racun
=====

Racun is a NodeJS application that generates API documentation from comments in source of wurst files.

How to install?
===============

Note: you need NodeJS and GIT.

	git clone git@github.com:Ruk33/Racun.git

How to use it?
==============

Note: You can include several paths by separating them by a coma (,).
Note: You can pass directly a single file.

	node folder/to/racun.js --paths path/to/folder/with/wurst/scripts[,second/path,path/to/file.wurst]

How to run tests?
=================

Note: you need nodeunit

	nodeunit folder/to/racun/tests/unit/racun.js

TODOS
=====

* Add support to detect automatically some elements (like returns, type of variable, etc)
* Add support for override methods
* HTML pages
* CSS default styles
* Help message