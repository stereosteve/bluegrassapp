var Spider = require('spider'),
    events = require('events'),
    slugs = require('slugs');






//
// Spider
//

var spider = Spider().log('debug');

spider.route("bluegrasslyrics.com", "/lyrics*", function(win, $) {
  var addLink = function() {
    var href = $(this).attr('href');
    if (href.charAt(0) === '/') href = 'http://bluegrasslyrics.com' + href;
    spider.get(href);
  };
  $('a', '.views-table tbody').each(addLink);
  $('a', 'ul.pager').each(addLink);
});

spider.route("bluegrasslyrics.com", "/node/*", function(win, $) {

  var getField = function(fieldName) {
    var value = $(fieldName, '.content').text();
    value = value.replace(/\w+:/g, '');
    //value = php.html_entity_decode(value)
    value = value.replace(/\s+/g, ' ').trim();
    if (value === 'na')
      return;
    return value;
  };

  var verses = [];
  $('p', '.content').each(function(index, para) {
    var text = $(para).text().replace(/&nbsp;/g, ' ');
    verses.push(text);
  });

  var song = {};
  //song.title = php.html_entity_decode($('h2').text())
  song.name = $('h2').text();
  song.artist = getField('.field-field-lyrics-version') || getField('.field-field-lyrics-author');
  if (song.name) song.id = slugs(song.name);
  if (song.artist) song.artistId = slugs(song.artist);
  //song.version = getField('.field-field-lyrics-version');
  //song.author = getField('.field-field-lyrics-author');
  //song.drupal_node = url.split('/').slice(-1)[0];
  song.lyrics = verses.join('\n\n');

  spider.emit('song', song);
});



spider.everything = function() {
  spider.get("http://bluegrasslyrics.com/lyrics?page=0");
};

spider.jimAndJesse = function() {
  spider.get("http://bluegrasslyrics.com/lyrics?field_lyrics_version_value=jim+and+jesse");
  spider.get("http://bluegrasslyrics.com/lyrics?field_lyrics_version_value=jim+%26+jesse");
  spider.get("http://bluegrasslyrics.com/lyrics?field_lyrics_version_value=McReynolds");
};

spider.oneSong = function() {
  spider.get("http://bluegrasslyrics.com/node/624");
};


module.exports = spider;
