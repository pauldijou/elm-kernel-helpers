# elm-kernel-helpers

Never forget that writing Native or Kernel code in Elm is dangerous. You should try to avoid it as much as possible. But if you really need to, this package will help you doing it.

- No more Elm specific syntax: break free from all those `_oh$god$Whats$Happening.Here` and stuff like that, it will all be hidden behind a nice and clean API.
- Create tasks like a boss from callback or promise without copy/pasting all that `scheduler` and `nativeBinding` stuff.
- No more `AX` and `FX` on most common functions, we will take care of that for you.
- No longer rely on `if (value.ctor === 'Nothing')`, we have better helpers for that.


## Be aware of...

- This package is not published in the official Elm registry since it contains Kernel / Native code. You can still install it using [elm-github-install](https://github.com/gdotdesign/elm-github-install) or [elm-proper-install](https://github.com/eeue56/elm-proper-install).

- Do not confuse Elm values and JavaScript values. A JavaScript array is neither an Elm `List` nor Elm `Array`, those a three different data structures. `null` and `undefined` are not the same as `Nothing`. You should probably never use either of them in your code.


## Usage

1. Add `pauldijou/elm-kernel-helpers` as a dependency inside your `elm-package.json`
2. Add `import Native.Kernel.Helpers` inside modules with Kernel / Native code needing them
3. Import the helpers inside your native using `var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers`
4. Enjoy all the following helpers...


## API

### basics

**basics.ctorOf(value): undefined | string**

Try to retrieve the `ctor` or `constructor type` of an Elm value, mostly work for union types and some other specific types. For example, `ctorOf(maybe.nothing)` will return `'Nothing'`, `ctorOf(list.empty)` will return `[]`, but `ctorOf(<an elm record>)` will return `undefined` since records does not have a `ctor`.

**basics.scheduler: Scheduler**

Return the Elm scheduler. Useful for some specific operations. Be careful that it might be removed in the next 0.19 version, so you should try to avoid using it as much as possible. Check the **task** API.

**basics.equals(a: Any, b: Any): Bool**

Test if any two Elm values are equals.

**basics.update(record: Record, updateFields: Object): Record**

Create a new record from the 1st argument `record`, updating only the fields from `updateFields`. Similar to `Object.assign` but immutable.

**toString(value: Any): String**

Convert any Elm value to the "best" possible string. This is not serialization but more for debugging and `console.log` stuff.

### dict

**dict.empty: Dict**

Return the empty `Dict`.

**dict.insert(key: comparable, value: Any, dict: Dict): Dict**



**dict.update(key: comparable, updater: Maybe -> Maybe, dict: Dict)**

**dict.remove(key: comparable, dict: Dict): Dict**

**dict.isEmpty(dict: Dict): Bool**

**dict.member(key: comparable, dict: Dict): Bool**

**dict.get(key: comparable, dict: Dict): Maybe**

**dict.size(dict: Dict): Int**

**dict.keys(dict: Dict): List String**

**dict.toList(dict: Dict): List (comparable, Any)**

**dict.fromList(list: List (comparable, Any)): Dict**

**dict.map(mapper: comparable -> Any -> Any, dict: Dict): Dict**

**dict.foldl(folder: comparable -> Any -> accumulator -> accumulator, init: accumulator, dict: Dict): accumulator**

**dict.foldr(folder: comparable -> Any -> accumulator -> accumulator, init: accumulator, dict: Dict): accumulator**

**dict.filter(predicate: comparable -> Any -> Bool, dict: Dict): Dict**

**dict.partition(predicate: comparable -> Any -> Bool, dict: Dict): (Dict, Dict)**

**dict.union(dict1: Dict, dict2: Dict): Dict**

**dict.intersect(dict1: Dict, dict2: Dict): Dict**

**dict.diff(dict1: Dict, dict2: Dict): Dict**

**dict.merge(
  leftOnly: comparable -> a -> result -> result,
  both: comparable -> a -> b -> result -> result,
  rightOnly: comparable -> b -> result -> result,
  dictA: Dict,
  dictB: Dict,
  init: result
): result**

### list

**list.empty: List**

> Return the empty list.

**list.singleton(value: Any): List**

> Return a `List` with your value as single element.

**list.isEmpty(list: List): Bool**

> Test if a list is empty.

**list.length(list: List): Int**

> Return the length of a list.

**list.reverse(list: List): List**

> Return a new list with all elements in the reverse order.

**list.member(value: Any, list: List): Bool**

> Test if your value is inside the list.

**list.filter(predicate: Any -> Bool, list: List): List**

> Return a new list with only the elements that match the predicate.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

var result = helpers.list.singleton(helpers.maybe.nothing)
result = helpers.list.filter(helpers.maybe.isOk, result)
result = helpers.list.isEmpty(result)
// result === true
```

**list.fromArray(array: JavaScript Array): List**

Create a list from a JavaScript array. Do not confuse with the Elm Array type.

**list.toArray(list: List): JavaScript Array**

Convert a list to a JavaScript array. Do not confuse with the Elm Array type.

### maybe

**maybe.nothing: Maybe**

Return the `Nothing` value.

**maybe.just(value: Any): Maybe**

Wrap your value inside a `Just`, returning a `Maybe`.

**maybe.isNothing(value: Maybe): Bool**

Test if your maybe value is actually a `Nothing`.

**maybe.isJust(value: Maybe): Bool**

Test if your maybe value is actually a `Just`.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

helpers.maybe.isNothing(maybe.nothing) // true
helpers.maybe.isNothing(maybe.just(0)) // false
helpers.maybe.isJust(maybe.nothing)    // false
helpers.maybe.isJust(maybe.just('a'))  // true
```

### result

**result.ok(value: Any): Result**

Wrap your value inside a `Ok`, returning a `Result`.

**result.err(value: Any): Result**

Wrap your value inside a `Err`, returning a `Result`.

**result.isOk(result: Result): Bool**

Test if your maybe value is actually a `Ok`.

**result.isErr(result: Result): Bool**

Test if your maybe value is actually a `Err`.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

helpers.result.isOk(result.ok(0))             // true
helpers.result.isOk(result.err('you failed')) // false
helpers.result.isErr(result.ok(true))         // false
helpers.result.isErr(result.err())            // true
```

### task

**task.succeed(value: Any): Task**

Return a successful task with your value as the success.

**task.fail(value: Any): Task**

Return a failed task with your value as the failure.

**task.spawn(task: Task): Task**

Will call `rawSpawn` and wrap the process inside a task.

**task.rawSpawn(task: Task): Process**

This one is a bit tricky to explain. Let's just say that the task will be executed but will or will not go inside your `update` function depending on how you created it. If it's only a raw task, it will probably be just a fire and forget, but if it is linked to a `Plateform.Router`, it might go to your app `update` or self msg on an effect module. Not 100% at all to be honest.

**task.fromCallback(callback: Function): Task**

The `callback` argument should be a function with two arguments, `succeed` and `fail`, that you should call when resolving your task. It's the exact same pattern as when creating a `Promise` in JavaScript.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

function doStuff() {
  return helpers.task.fromCallback(function (succeed, fail) {
    setTimeout(function () {
      if (yourTest) { succeed(yourSuccess) }
      else { fail(yourFailure) }
    }, 500)
  })
}
```

**task.fromPromise(promise: Promise): Task**

Create a task from a JavaScript `Promise`. If the promise succeed, the task will succeed, otherwise, both will fail.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

function doStuff() {
  return helpers.task.fromPromise(new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (yourTest) { resolve(yourSuccess) }
      else { reject(yourFailure) }
    }, 500)
  }))
}
```

### tuple

**empty: ()**

Return the empty tuple.

**pair(a: Any, b: Any): (a, b)**

Return a `Tuple2` with both values as first and second arguments.

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright Paul Dijou ([http://pauldijou.fr](http://pauldijou.fr)).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.