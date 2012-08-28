APPCACHE=./public/offline.appcache

all: bump

bump:
	sed 's/# version [0-9]*/# version '`date +%s`'/g' ${APPCACHE} > tmpfile; mv tmpfile ${APPCACHE}
