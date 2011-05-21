var request = require('request')
  , _ = require('underscore')
  , readability = require('readability')

var SCRIPT_TAGS = /\<script(.*)\/script\>/g
  , CSS_TAGS = /\<style(.*)\/style\>/g
  , HTML_TAGS = /\<([^\>]*)\>/gi


exports.rank = function(text, cb, ranking){
  var words = text.replace(/[^\w\s]|_/g, "").split(/\s/g) 
    , wordFreq = {}
    , wordLen = 0
    , totalWords = 0 
 
  ranking = ranking || {}
  
  ranking.numbers = 0
  ranking.commonWords = 0


  var wc = function(word){
	var w = word.toLowerCase()  
    if (!wordFreq[w]){
	  wordFreq[w] = 0
    }	
	return wordFreq[w]++
  }
 
  _.each(words, wc);

  // Clean frequency table
  if (wordFreq[''])
    delete wordFreq['']

  _.each(wordFreq, function(count, word){
    if(parseInt(word)){
	  delete wordFreq[word]
	  ranking.numbers ++
	  return;
	}
  
    if(_(exports.COMMON_WORDS).indexOf(word) > -1){
      delete wordFreq[word];
      ranking.commonWords ++ 
      return;
    }
	
	if (word.length > 30){ // Longest non-coined english word
      delete wordFreq[word]
      return;
    }

    wordLen += word.length * count
	totalWords += count
  });
  

  ranking.uniqWords = _(wordFreq).keys().length
  ranking.totalWords = totalWords
  ranking.avgWordLen = wordLen/totalWords
  

  //console.log(_(wordFreq).map(function(ct, w){
  //  return [ct, w]
  //}).sort(function(a,b){return b[0] - a[0]}))

  cb(ranking)
}




//
// HTML heuristics include:
//   - Number of scripts
//   - Amount of html to text
//
exports.rankHTML = function(html, cb){
  //console.log(html)

  var scripts = html.match(SCRIPT_TAGS)
	, tags = html.match(HTML_TAGS)
	, styles = html.match(CSS_TAGS)
    , text
	
  text = (html
		    .replace(SCRIPT_TAGS, ' ') 
  			.replace(CSS_TAGS, ' ')
			.replace(HTML_TAGS, ' ')
			.replace(/\s/g, ' ')
		)

  //console.log(scripts.length, "!!!!!!!!")
  //console.log(text);
  exports.rank(text, cb)
}




exports.rankURL = function(url, cb){
  request.get({uri:url}, function(err, h, s){
	//TODO Could use URL reliability heuristic here  
	readability.parse(s, url, function(r){
      exports.rankHTML(r.content, cb);
    })
  });
}	


// Apparently, 30% of English
exports.COMMON_WORDS = [
'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 
'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I ', 'at', 'be', 'this', 
'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 
'were', 'we', 'when', 'your', 'can', 'said ', 'there', 'use', 'an', 'each', 
'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 
'out', 'many', 'then', 'them', 'these', 'so ', 'some', 'her', 'would', 'make', 
'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'go', 
'see', 'number', 'no', 'way', 'could', 'people ', 'my', 'than', 'first', 
'water', 'been', 'call', 'who', 'oil', 'its', 'now', 'find', 'long', 'down', 
'day', 'did', 'get', 'come', 'made', 'may', 'part'
]







