#merge-utils
Allows you to merge sets of identifyable objects:


``` js
var originSet = [{id:1, value: '1.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
var changedSet1 = [{id:1, value: 'set2.1'}, {id:2, value:'1.2'}, {id:3, value:'1.3'}]
var changedSet2 = [{id:1, value: '3.1'}, {id:2, value:'3.2'}, {id:3, value:'1.3'}]

// we use this as a simple conflict handler:
var conflictHandler = function(id, value1, value2, originValue) {
  return value1;
}

var merged = merge.sets(changedSet1, changedSet2, originSet)

```