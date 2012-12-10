#merge-utils
*Note: [id-merge](https://github.com/mirkok/id-merge) is a far more sophisticated 3-way merging library and has kind of deprecated this one.*

Allows you to merge sets of identifyable objects:

Simple merging:
``` js
var merge = require('merge-utils')

var originSet = [{id:1, value:'1.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
var changedSet1 = [{id:1, value:'set2.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
var changedSet2 = [{id:1, value:'3.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]

// we use this as a simple conflict handler:
var conflictHandler = function(id, originValue, value1, value2) {
  return value1;
}

var merged = merge.sets(originSet, changedSet1, changedSet2)
// returns:
[{id:1, value: '2.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]
```

Merging with created and deleted objects:
``` js
var origin = [{id: 2, value:0 }]
var set1 = [{id:2, value:0}, {id: 3, value:1}, {id:1, value:2}]
var set2 = [{id:3, value:2}]

var merged = merge.sets(origin, set1, set2, conflictFn)
// returns:
[{id:1, value:2}, {id:3, value:1}]
```

Merging resolving position conflicts:

``` js
var originList = [{id:1, value: '1.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
var list1 = [{id:1, value:'2.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
var list2 = [{id:1, value:'3.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]

var valueConflictFn = function(id, originValue, value1, value2) {
  return value1;
}
var posConflictFn = function(id, originPos, pos1, pos2) {
  return pos1;
}

var merged = merge.orderedSets(originList, list1, list2, valueConflictFn, posConflictFn)
// returns:
[{id:1, value:'2.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]
```