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

* pickerCtrl should have one getSongs method which will apply all the query criteria (including limit + offset)
* ability to add song to playlist
