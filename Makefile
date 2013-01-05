srcs = src/*.js

dropandforget.js: $(srcs)
	./node_modules/.bin/browserify --alias 'jquery:jquery-browserify' -e src/main.js | ./node_modules/.bin/uglifyjs -m - > dropandforget.js

modules:
	npm install jslint
	npm install browserify
	npm install jquery
	npm install jquery-browserify
	npm install uglify-js

.PHONY: test
test:
	node test/item.test.js
	node test/list.test.js
	node test/list-view.test.js

jslint: $(srcs)
	./node_modules/.bin/jslint --nomen --plusplus --browser $(srcs)
