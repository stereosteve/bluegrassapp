APPCACHE=./public/offline.appcache


bump: public/index.html public/app.js public/style.css
	sed 's/# version [0-9]*/# version '`date +%s`'/g' ${APPCACHE} > tmpfile; mv tmpfile ${APPCACHE}

hint:
	jshint public/app.js


deploy: bump hint
	rm -rf ../gh-pages-pickbook/*
	cp -r public/* ../gh-pages-pickbook/
	cd ../gh-pages-pickbook && git add -A && git commit -m "deploy" && git push origin gh-pages -f


