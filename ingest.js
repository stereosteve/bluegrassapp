var agent = require('superagent')
  , csv = require('csv')
  , _ = require('underscore')


var ingest = module.exports = function(cb) {
  var fields = []
  var data = {}

  function onResponse(text) {
    csv()
      .from(text)
      .on('record', onRecord)
      .on('end', function() {
        cb(data)
      })
  }

  function onRecord(row, index) {
    if (index === 0) {
      fields = row
      return
    }
    var song = _.object(fields, row)
    song.id = index
    song.tags = song.tags.split('\n')
    data[song.id] = song
  }

  agent
    .get('https://docs.google.com/spreadsheet/pub?key=0AlzWAe7sSRCrdFYzWEJfWThCRDBoMXNBczdLQm9PS3c&output=csv')
    .end(function(resp) {
      onResponse(resp.text)
    })
}


// test
if (!module.parent) {
  ingest(function(data) {
    console.log("DATA", data)
  })
}
