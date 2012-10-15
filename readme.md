# pickbook

Mobile app for bluegrass lyrics.

## Setup

Install dependencies:
```
sudo gem install foreman watchr
npm install less -g
npm install
```

Run server + watch and recompile assets:
```
make dev
```

## Deploy

Deploy is done to github pages - similar to Bootstrap.
Checkout the gh-pages branch **adjacent** to this src dir:
```
git clone -b gh-pages git@github.com:stereosteve/pickbook.git gh-pages-pickbook
```

Then, to deploy:
```
make deploy
```

## TODO

* ditch bootstrap
* write data to localstorage
* include version / hashsum in asset URLs & offline cache

* fixed position stuff: http://stackoverflow.com/questions/743123/fixed-positioning-in-mobile-safari
