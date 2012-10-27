var chokidar = require('chokidar');
var spawn = require('child_process').spawn
var util = require('util')
var _ = require('underscore')

function exec(cmd, args) {
  spawn(cmd, args, {stdio: 'inherit'});
}

function makeWatcher(path, cmd, args) {
  var watcher = chokidar.watch(path, {persistent: true})
  var onChange = function(ev, path) {
    exec(cmd, args);
  }
  watcher.on('change', _.throttle(onChange, 400))
  watcher.on('error', function(err) {
    console.error("ERROR", err)
  })
  exec(cmd, args);
  return watcher
}

makeWatcher('app/scripts', 'make', ['js'])
makeWatcher('app/views', 'make', ['ejs'])
