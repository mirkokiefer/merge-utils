
var _ = require('underscore')

setToDict = function(set) {
  return _.object(set.map(function(each) {return [each, each]}))
}

objectSetToDict = function(set) {
  return _.object(set.map(function(each) {return [each.id, each.value]}))
}

objectDictToSet = function(obj) {
  var set = []
  _.each(obj, function(value, key) {
    set.push({id:key, value:value})
  })
  return set
}

module.exports = {
  setToDict: setToDict,
  objectSetToDict: objectSetToDict,
  objectDictToSet: objectDictToSet
}