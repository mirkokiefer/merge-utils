
var _ = require('underscore')
var utils = require('./utils')
var mergeDict = require('./merge-dict')

merge = function(set1, set2, originSet, conflictFn) {
  var setDicts = [set1, set2].map(utils.objectSetToDict)
  var originSetDict = utils.objectSetToDict(originSet)
  var result = mergeDict(setDicts[0], setDicts[1], originSetDict, conflictFn)
  return utils.objectDictToSet(result)
}

module.exports = merge