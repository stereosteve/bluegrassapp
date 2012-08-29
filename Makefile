APPCACHE=./public/offline.appcache
BOOTSTRAP_LESS = ./public/bootstrap/less/bootstrap.less
BOOTSTRAP_RESPONSIVE_LESS = ./public/bootstrap/less/responsive.less

all: bump less

bump:
	sed 's/# version [0-9]*/# version '`date +%s`'/g' ${APPCACHE} > tmpfile; mv tmpfile ${APPCACHE}

less:
	rm -f public/bootstrap/css/*.css
	recess --compile ${BOOTSTRAP_LESS} > public/bootstrap/css/bootstrap.css

slowless:
	recess --compress ${BOOTSTRAP_LESS} > public/bootstrap/css/bootstrap.min.css
	recess --compile ${BOOTSTRAP_RESPONSIVE_LESS} > public/bootstrap/css/bootstrap-responsive.css
	recess --compress ${BOOTSTRAP_RESPONSIVE_LESS} > public/bootstrap/css/bootstrap-responsive.min.css
