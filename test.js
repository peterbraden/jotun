var jotunn = require('./jotunn')
  , _ = require('underscore')


var testUrls = [
	'http://en.wikipedia.org/wiki/Troll'
  , 'http://www.smithsonianmag.com/history-archaeology/Fort-Sumter-The-Civil-War-Begins.html' // Good history article
]	

_.each(testUrls, function(x){
  jotunn.rankURL(x, function(rank){console.log(x, ":", rank)});
});
