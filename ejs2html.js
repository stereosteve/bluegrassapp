var ejs = require('ejs')
  , fs = require('fs')
  , info = require('./package.json');

var srcFile = __dirname + '/views/layout.ejs';
var destFile = __dirname + '/public/index.html';

/*
  manifestTag: '',
  manifestTag: 'manifest="/offline.appcache"',
*/

var ctx = {
  manifestTag: '',
  startview: function(name) {
    return '<script type="text/ng-template" id="' + name + '.html">';
  },
  endview: '</script>',
  version: info.version,
  filename: srcFile,
}

fs.readFile(srcFile, 'utf8', function(err, contents) {
  var out = ejs.render(contents, ctx);
  fs.writeFile(destFile, out);
});


