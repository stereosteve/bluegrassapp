# pickbook

Mobile app for bluegrass lyrics.

## setup

Requires:

* Node.js
* MongoDB

Install dependencies:
```
npm install less -g
npm install
```

Import songs
```
npm run etl
```

Start server:
```
node server.js
```


Watch setup:
```
gem install watchr
watchr watch.rb
```

## TODO

* favicon, splash screen, apple icons

* app status visibility
  - online / offline status
  - current URL - download date - jitsu deploy version - manifest version - etc etc etc
  - javascript debug output from appcache stuffs

* Indicate to the user that content is loading.

* Need a template for Song List - code currently copy pasted in Song Index, Artist Detail and Playlist Detail

* might want to limit filter search results to `song.name` and `artist.name`
* might want to separate controllers for song and artist?  but this woud make things wetter (ie not DRY)

* build a simple crud web app - separate from mobile client.
