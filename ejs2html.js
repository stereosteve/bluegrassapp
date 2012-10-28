var ejs = require('ejs')
  , fs = require('fs')
  , info = require('./package.json');

var srcFile = __dirname + '/app/views/layout.ejs';
var destFile = __dirname + '/public/index.html';

var manifestTag = '';
if (process.env.APPCACHE || true) manifestTag = 'manifest="/offline.appcache"';

var ctx = {
  manifestTag: manifestTag,
  startview: function(name) {
    return '<script type="text/ng-template" id="' + name + '">';
  },
  endview: '</script>',
  version: info.version,
  filename: srcFile,
}

fs.readFile(srcFile, 'utf8', function(err, contents) {
  var out = ejs.render(contents, ctx);
  fs.writeFile(destFile, out);
});


