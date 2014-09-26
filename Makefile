VERSION=0.1.1
PACKAGE_NAME=dropandforget-$(VERSION)
PACKAGE_FILES=dropandforget.html dropandforget.css dropandforget.js LICENSE.TXT

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

.PHONY: package
package:
	tar cvzf $(PACKAGE_NAME).tar.gz $(PACKAGE_FILES)
	zip $(PACKAGE_NAME).zip $(PACKAGE_FILES)
