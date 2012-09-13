APPCACHE=./public/offline.appcache
BOOTSTRAP_LESS=./app/styles/bootstrap.less

all: bump clean lessc js ejs

bump:
	sed 's/# version [0-9]*/# version '`date +%s`'/g' ${APPCACHE} > tmpfile; mv tmpfile ${APPCACHE}

clean:
	rm -rf public/compiled

lessc:
	mkdir -p public/compiled
	lessc ${BOOTSTRAP_LESS} public/compiled/pickbook.css

js:
	mkdir -p public/compiled
	cat app/scripts/routes.js app/scripts/services.js app/scripts/controllers.js > public/compiled/pickbook.js

ejs:
	node ejs2html.js


deploy:
	APPCACHE=true make
	echo "DEPLOY"
	rm -rf ../gh-pages-pickbook/*
	cp -r public/* ../gh-pages-pickbook/
	cd ../gh-pages-pickbook && git add -A && git commit -m "deploy" && git push origin gh-pages
	make


