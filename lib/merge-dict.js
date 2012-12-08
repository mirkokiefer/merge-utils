
var _ = require('underscore')

var merge = function(dictOrigin, dict1, dict2, conflictFn) {
  var result = {}
  var setKey = function(value, key) {
    if(value != undefined) {
      result[key] = value
    }
  }
  _.each(dict1, function(dict1Entry, key) {
    var dict2Entry = dict2[key]
    var originEntry = dictOrigin[key]
    if(dict2Entry == originEntry) {
      setKey(dict1Entry, key)
    } else if (dict1Entry == originEntry) {
      setKey(dict2Entry, key)
    } else {
      setKey(conflictFn(key, originEntry, dict1Entry, dict2Entry), key)
    }
  })
  // check all keys in dict2 that don't exist in dict1:
  _.each(dict2, function(dict2Entry, key) {
    var dict1Entry = dict1[key]
    var originEntry = dictOrigin[key]
    if(!dict1Entry) {
      if(dict1Entry == originEntry) {
        setKey(dict2Entry, key)
      } else {
        setKey(conflictFn(key, originEntry, dict1Entry, dict2Entry), key)
      }
    }
  })
  return result
}

module.exports = merge