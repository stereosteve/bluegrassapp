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

* pickerCtrl should have a `songQuery` and a `artistQuery` as well as `getSongs()` and `getArtists()`:

```
songQuery: {
  limit: 50,
  offset: 150,
  searchTerm: 'a'
}
```

* use ejs for views - conditionally include the appcache for production.
* build a simple crud web app - separate from mobile client.

* ability to add song to playlist
