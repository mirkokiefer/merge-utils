
var _ = require('underscore')
var utils = require('./utils')
var mergeDict = require('./merge-dict')

merge = function(originSet, set1, set2, conflictFn) {
  var setDicts = [set1, set2].map(utils.objectSetToDict)
  var originSetDict = utils.objectSetToDict(originSet)
  var result = mergeDict(originSetDict, setDicts[0], setDicts[1], conflictFn)
  return utils.objectDictToSet(result)
}

module.exports = merge