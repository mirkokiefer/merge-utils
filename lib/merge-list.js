
var _ = require('underscore')
var mergeSet = require('./merge-set')
var utils = require('./utils')

merge = function(list1, list2, originList, valueConflictFn, posConflictFn) {
  var resolvedValues = mergeSet(list1, list2, originList, valueConflictFn)
  var positions = [list1, list2, originList].map(function(list) {
    return utils.objectSetToDict(list.map(function(each, i) {
      return {id:each.id, value:i}      
    }))
  })
  var result = []
  var insertEntry = function(entry, pos) {
    if(result[pos]) {
      result[pos] = result[pos].concat(entry)
    } else {
      result[pos] = [entry]
    }
  }
  resolvedValues.forEach(function(each) {
    var list1Pos = positions[0][each.id]
    var list2Pos = positions[1][each.id]
    var originPos = positions[2][each.id]
    if ((list1Pos == undefined) || (list1Pos == originPos)) {
      insertEntry(each, list2Pos)
    } else if ((list2Pos == undefined) || (list1Pos == originPos)) {
      insertEntry(each, list1Pos)
    } else {
      var resolvedPos = posConflictFn(each.id, list1Pos, list2Pos, originPos)
      insertEntry(each, resolvedPos)
    }
  })
  return _.flatten(result)
}

module.exports = merge