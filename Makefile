APPCACHE=./public/offline.appcache

build: clean bump js ejs

bump:
	sed 's/# version [0-9]*/# version '`date +%s`'/g' ${APPCACHE} > tmpfile; mv tmpfile ${APPCACHE}

clean:
	rm -rf public/compiled

js: bump
	mkdir -p public/compiled
	cat app/scripts/controllers.js > public/compiled/pickbook.js

ejs: bump
	node ejs2html.js




deploy: build
	rm -rf ../gh-pages-pickbook/*
	cp -r public/* ../gh-pages-pickbook/
	cd ../gh-pages-pickbook && git add -A && git commit -m "deploy" && git push origin gh-pages -f


