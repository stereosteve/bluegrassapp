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
foreman start
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
