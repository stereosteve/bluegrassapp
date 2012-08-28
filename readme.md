# pocketpicker

Mobile app for bluegrass lyrics.

## setup

Install dependencies:
```
npm install
```

Import songs (you will have to `ctrl + c` this for now):
```
npm run etl
```

Start server:
```
node server.js
```

## TODO

* ADD TO PLAYLIST allready
* Need a template for Song List - code currently copy pasted in Song Index, Artist Detail and Playlist Detail

* might want to limit filter search results to `song.name` and `artist.name`
* might want to separate controllers for song and artist?  but this woud make things wetter (ie not DRY)

* build a simple crud web app - separate from mobile client.
