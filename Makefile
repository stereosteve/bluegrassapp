APPCACHE=./public/offline.appcache
BOOTSTRAP_LESS=./less/bootstrap.less

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
	cat app/routes.js app/services.js app/controllers.js > public/compiled/pickbook.js

ejs:
	node ejs2html.js


slowless:
	recess --compress ${BOOTSTRAP_LESS} > public/bootstrap/css/bootstrap.min.css
	recess --compile ${BOOTSTRAP_RESPONSIVE_LESS} > public/bootstrap/css/bootstrap-responsive.css
	recess --compress ${BOOTSTRAP_RESPONSIVE_LESS} > public/bootstrap/css/bootstrap-responsive.min.css
