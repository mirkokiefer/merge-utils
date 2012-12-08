
var assert = require('assert')
var _ = require('underscore')

var merge = require('../lib/index')

sortByID = function(a,b) {return a.id < b.id}
assertArraysEqual = function(array, arrayExpected) {
  array.forEach(function(each) {
    var found = _.find(arrayExpected, function(eachExpected) {return each.id == eachExpected.id})
    assert.equal(each.value, found.value)
  })
  arrayExpected.forEach(function(eachExpected) {
    var found = _.find(array, function(each) {return each.id == eachExpected.id})
    assert.equal(found.value, eachExpected.value)
  })
}
assertDictsEqual = function(dict, dictExpected) {
  _.each(dict, function(value, key) {
    assert.equal(value, dictExpected[key])
  })
  _.each(dictExpected, function(value, key) {
    assert.equal(dict[key], value)
  })
}

describe('dictionary merging', function() {
  var originDict = {
    key1: 1,
    key2: 2
  }
  var conflictFn = function(key, value1, value2, valueOrigin) {
    return value1
  }
  it('should merge with no conflicts', function() {
    var dict1 = {
      key1: 1,
      key2: 3
    }
    var dict2 = {
      key1: 2,
      key2: 2
    }
    var expected = {
      key1: 2,
      key2: 3
    }
    var merged = merge.dictionaries(dict1, dict2, originDict, conflictFn)
    _.each(expected, function(value, key) {
      assert.equal(merged[key], value)
    })
  })
  it('should merge with conflicts', function() {
    var dict1 = {
      key1: 1,
      key2: 3
    }
    var dict2 = {
      key1: 2,
      key2: 4
    }
    var expected = {
      key1: 2,
      key2: 3
    }
    var merged = merge.dictionaries(dict1, dict2, originDict, conflictFn)
    assertDictsEqual(merged, expected)
  })
  it('should merge with conflicts and added/deleted keys', function() {
    var dict1 = {
      key1: 3,
      key3: 4
    }
    var dict2 = {
      key5: 5
    }
    var expected = {
      key1: 3,
      key3: 4,
      key5: 5
    }
    var merged = merge.dictionaries(dict1, dict2, originDict, conflictFn)
    assertDictsEqual(merged, expected)
  })
})

describe('set merging', function() {
  var set1 = [{id:1, value: 'set1.1'}, {id:2, value:'set1.2'}, {id:3, value:'1.3'}]
  var set2 = [{id:1, value: 'set2.1'}, {id:2, value:'set1.2'}, {id:3, value:'1.3'}]
  var set3 = [{id:1, value: 'set3.1'}, {id:2, value:'set3.2'}, {id:3, value:'1.3'}]
  var conflictFn = function(id, value1, value2, originValue) {
    return value1;
  }
  it('should resolve a conflict', function() {
    var expected = [{id:1, value: 'set2.1'}, {id:2, value:'set3.2'}, {id:3, value:'1.3'}] 
    var merged = merge.sets(set2, set3, set1, conflictFn)
    assertArraysEqual(merged, expected)
  })
  var set4 = []
  it('should merge an empty array', function() {
    var expected = []
    var merged = merge.sets(set4, set2, set1, conflictFn)
    assert.equal(merged.length, 0)
  })
  it('should not have to merge anything', function() {
    var set1 = [ { id: 1, value: 0 }, { id: 2, value: 1 }, { id: 3, value: 2 } ]
    var set2 = [ { id: 1, value: 0 }, { id: 2, value: 1 }, { id: 3, value: 2 } ]
    var set3 = [ { id: 1, value: 0 }, { id: 2, value: 1 }, { id: 3, value: 2 } ]
    var expected = set1
    var merged = merge.sets(set1, set2, set3, conflictFn)
    assertArraysEqual(merged, expected)
  })
  it('should work with different orders', function() {
    var origin = [ { id: 2, value: 0 }, { id: 1, value: 1 }, { id: 3, value: 2 } ]
    var set1 = [ { id: 2, value: 0 }, { id: 3, value: 1 }, { id: 1, value: 2 } ]
    var set2 = [ { id: 1, value: 0 }, { id: 2, value: 1 }, { id: 3, value: 2 } ]
    var expected = [ { id: 1, value: 2 }, { id: 2, value: 1 }, { id: 3, value: 1 } ]
    var merged = merge.sets(set1, set2, origin, conflictFn)
    assertArraysEqual(merged, expected)
  })
  it('should work with added and deleted IDs', function() {
    var origin = [ { id: 2, value: 0 }]
    var set1 = [ { id: 2, value: 0 }, { id: 3, value: 1 }, { id: 1, value: 2 } ]
    var set2 = [ { id: 3, value: 2 } ]
    var expected = [ { id: 1, value: 2 }, { id: 3, value: 1 } ]
    var merged = merge.sets(set1, set2, origin, conflictFn)
    assertArraysEqual(merged, expected)
  })
})

describe('list merging', function() {
  var originList = [{id:1, value: '1.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
  var valueConflictFn = function(id, value1, value2, originValue) {
    return value1;
  }
  var posConflictFn = function(id, pos1, pos2, originPos) {
    return pos1;
  }
  it('should do a merge with value conflicts but no order conflicts', function() {
    var list1 = [{id:1, value:'2.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
    var list2 = [{id:1, value:'3.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]
    var expected = [{id:1, value:'2.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]
    var merged = merge.orderedSets(list1, list2, originList, valueConflictFn, posConflictFn)
    expected.forEach(function(each, i) {
      assert.equal(merged[i].value, each.value) 
    })
  })
  it('should do a merge with only order conflicts', function() {
    var list1 = [{id:2, value:'1.2'}, {id:1, value: '1.1'}, {id:3, value:'1.3'}]
    var list2 = [{id:2, value:'1.2'}, {id:3, value:'1.3'}, {id:1, value: '1.1'}]
    var expected = [{id:2, value:'1.2'}, {id:1, value: '1.1'}, {id:3, value:'1.3'}]
    var merged = merge.orderedSets(list1, list2, originList, valueConflictFn, posConflictFn)
    expected.forEach(function(each, i) {
      assert.equal(merged[i].value, each.value) 
    })
  })
})
