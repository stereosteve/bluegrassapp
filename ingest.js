var agent = require('superagent');
var csv = require('csv');

agent
  .get('https://docs.google.com/spreadsheet/pub?key=0AlzWAe7sSRCrdFYzWEJfWThCRDBoMXNBczdLQm9PS3c&output=csv')
  .end(function(resp) {
    csv()
      .from(resp.text)
      .on('record', function(data, index) {
        console.log("\n\n-------------", index, '\n', data)
        console.log(data[2])
      })
  })
