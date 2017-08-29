# elm-kernel-helpers

Never forget that writing Native or Kernel code in Elm is dangerous. You should try to avoid it as much as possible. But if you really need to (missing web APIs, server-side code, ...), this package will help you doing it.

- No more Elm specific syntax: break free from all those `_oh$god$Whats$Happening.Here` and stuff like that, it will all be hidden behind a nice and clean API.
- Create tasks like a boss from callback or promise without copy/pasting all that `scheduler` and `nativeBinding` stuff.
- No more `AX` and `FX` on most common functions, we will take care of that for you.
- No more `.ctor`, `._0` or `_1` on basic types.
- No longer rely on stuff like `if (value.ctor === 'Nothing')`, we have better helpers for that.


## Be aware of...

- This package is not published in the official Elm registry since it contains Kernel / Native code. You can still install it using [elm-github-install](https://github.com/gdotdesign/elm-github-install).

- Do not confuse Elm values and JavaScript values. A JavaScript array is neither an Elm `List` nor Elm `Array`, those a three different data structures. `null` and `undefined` are not the same as `Nothing`, you should probably never use either of them in your code. On the other hand, nearly all primitives are the same (boolean, string, date, record/object), but be sure to floor/round/ceil a JavaScript number if you want an `Int`, otherwise consider it a `Float`.

- If you are missing any documentation on a function, check the [Elm one](http://package.elm-lang.org/packages/elm-lang/core/5.1.1), all those functions are the same as the Elm ones but with a JavaScript syntax.

- Pretty please, don't hate me for this project. Even if Kernel / Native is not the way to go when you are using Elm, sometime, you just need to write some (even more if you are doing server-side Elm), so you might as well do it with some helpers, right?

## Strict mode

By default, the helpers will try to catch as much potential errors as possible. For example, if you try to call `Result.fromMaybe` with an argument that isn't actually a `Maybe`, it will throw a `TypeError`. There are a huge lot of limitations of course, we cannot know the type of a `List` as long as it is empty, we cannot determine if several types are part of the same union type without parsing the actual Elm code (and there is no plan at all to do that).

Anyway, it's good for you but far from perfect and, in any case, disable it in production, some checks are long and it's too late to catch them.

```javascript
helpers.strict(false)
```

By the way, want to know what's cool? If you are using Elm libs which are also using `elm-kernel-helpers`, disabling it once in your production app will disable it for all libs using it. Pretty sweet right?

## Usage

1. Add `pauldijou/elm-kernel-helpers` as a dependency inside your `elm-package.json`
2. Add `import Kernel.Helpers` inside modules with Kernel / Native code needing them
3. If you need to get rid of warnings for `unused import`, you can always use `Kernel.Helpers.noWarnings` constant, which returns an empty string.
4. Import the helpers inside your native code using `var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers`
5. Enjoy all the following helpers...


## API

### basics

**basics.ctorOf(value): undefined | string**

> Try to retrieve the `ctor` or `constructor type` of an Elm value, mostly work for union types and some other specific types. For example, `ctorOf(maybe.nothing)` will return `'Nothing'`, `ctorOf(list.empty)` will return `'[]'`, but `ctorOf(<an elm record>)` will return `undefined` since records does not have a `ctor`.

**basics.scheduler: Scheduler**

> Return the Elm scheduler. Useful for some specific operations. Be careful that it might be removed in the next 0.19 version, so you should try to avoid using it as much as possible. Check the **task** API.

**basics.equals(a: Any, b: Any): Bool**

> Test if any two Elm values are equals.

**basics.update(record: Record, updateFields: Object): Record**

> Create a new record from the 1st argument `record`, updating only the fields from `updateFields`. Similar to `Object.assign` but immutable.

**toString(value: Any): String**

> Convert any Elm value to the "best" possible string. This is not serialization but more for debugging and `console.log` stuff.

**basics.union.create(ctor: string, values: args...): Union Type**

> Create a union type value based on its name and arguments

```elm
type Foo = Bar Int String
```

```javascript
helpers.basics.create('Bar', 5, 'something')
```

**basics.union.at(unionType: any, index: int): any**

> Retrieve the argument at the specified index

```elm
type Foo = Bar Int String

value: Foo
value = Bar 42 "hey there"
```

```javascript
helpers.basics.union.at(value, 0) // returns 42
helpers.basics.union.at(value, 1) // returns 'hey there'
```

### dict

**dict.empty: Dict**

> Return the empty `Dict`.

**dict.insert(key: comparable, value: Any, dict: Dict): Dict**

>  Insert a key/value pair inside a dict

**dict.update(key: comparable, updater: Maybe -> Maybe, dict: Dict)**

> Update a value based on its key

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

var dict = helpers.dict.empty
dict = helpers.dict.insert('key', 'value', dict)
dict = helpers.dict.update('key', (value) => {
  if (helpers.maybe.isJust(value)) {
    // We did find a value for this key,
    // let's extract it from the maybe and update it
    return helpers.maybe.just('updated' + helpers.maybe.get(value))
  } else {
    // there was no value with the 'key' key
    // let's create one
    return helpers.maybe.just('newValue')
  }
}, dict)
// dict == { key: 'updatedvalue' }
```

**dict.remove(key: comparable, dict: Dict): Dict**

> Remove a particular key (and its value) from a dict

**dict.isEmpty(dict: Dict): Bool**

> Test if a dict is empty

**dict.member(key: comparable, dict: Dict): Bool**

> Test if a key is inside a dict

**dict.get(key: comparable, dict: Dict): Maybe**

> Try to extract the value corresponding to the key from a dict

**dict.size(dict: Dict): Int**

> Return the number of keys inside a dict

**dict.keys(dict: Dict): List String**

> Return the list of keys inside a dict

**dict.toList(dict: Dict): List (comparable, Any)**

> Transform a dict to a list of `Tuple2` (key, value)

**dict.fromList(list: List (comparable, Any)): Dict**

> Create a dict from a list of `Tuple2` (key, value)

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

> Create a list from a JavaScript array. Do not confuse with the Elm Array type.

**list.toArray(list: List): JavaScript Array**

> Convert a list to a JavaScript array. Do not confuse with the Elm Array type.

**list.prepend(value: Any, list: List): List**

> Prepend `value` at the beginning of `list`, just like the `::` operator.

### maybe

**maybe.nothing: Maybe**

> Return the `Nothing` value.

**maybe.just(value: Any): Maybe**

> Wrap your value inside a `Just`, returning a `Maybe`.

**maybe.isNothing(value: Maybe): Bool**

> Test if your maybe value is actually a `Nothing`.

**maybe.isJust(value: Maybe): Bool**

> Test if your maybe value is actually a `Just`.

**maybe.isMaybe(value: Maybe): Bool**

> Test if your value is a `Maybe`, either `Just` or `Nothing`.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

helpers.maybe.isNothing(maybe.nothing) // true
helpers.maybe.isNothing(maybe.just(0)) // false
helpers.maybe.isJust(maybe.nothing)    // false
helpers.maybe.isJust(maybe.just('a'))  // true
helpers.maybe.isMaybe(maybe.nothing)   // true
helpers.maybe.isMaybe(maybe.just('a')) // true
```

**maybe.get(value: Maybe): Any | undefined**

> If value is a `Just`, will return the value inside it. Otherwise, return `undefined`.

**maybe.withDefault(default: Any, value: Maybe): Any**

> If value is `Nothing`, return `default`, else return the value inside `Just`.

**maybe.map(mapper: Any -> Any, value: Maybe): Maybe**

> If `value` is a `Just`, apply `mapper` to its wrapped value, otherwise do nothing.

**maybe.andThen(next: Any -> Maybe, value: Maybe): Maybe**

> If `value` is a `Just`, extract its wrapped value, apply `next` to it and return it, otherwise do nothing.

### result

**result.ok(value: Any): Result**

> Wrap your value inside a `Ok`, returning a `Result`.

**result.err(value: Any): Result**

> Wrap your value inside a `Err`, returning a `Result`.

**result.isOk(result: Result): Bool**

> Test if your maybe value is actually a `Ok`.

**result.isErr(result: Result): Bool**

> Test if your maybe value is actually a `Err`.

**result.isResult(value: Result): Bool**

> Test if your value is a `Result`, either `Ok` or `Err`.

```javascript
var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

helpers.result.isOk(result.ok(0))             // true
helpers.result.isOk(result.err('you failed')) // false
helpers.result.isErr(result.ok(true))         // false
helpers.result.isErr(result.err())            // true
helpers.result.isResult(result.ok(true))      // true
helpers.result.isResult(result.err())         // true
```

**result.get(value: Maybe): Any | undefined**

> If value is a `Result`, will return the value inside it. Otherwise, return `undefined`.

**result.withDefault(default: Any, value: Result): Any**

> If value is `Err`, return `default`, else return the value inside `Ok`.

**result.map(mapper: Any -> Any, value: Result): Result**

> If `value` is a `Ok`, apply `mapper` to its wrapped value, otherwise do nothing.

**result.mapError(mapper: Any -> Any, value: Result): Result**

> If `value` is a `Err`, apply `mapper` to its wrapped value, otherwise do nothing.

**result.andThen(next: Any -> Result, value: Result): Result**

> If `value` is a `Ok`, extract its wrapped value, apply `next` to it and return it, otherwise do nothing.

**result.toMaybe(value: Result): Maybe**

> If `value` is a `Ok`, return a `Just` with the same value inside, otherwise return `Nothing`.

**result.fromMaybe(error: Any, value: Maybe): Result**

> If `value` is `Nothing`, return an `Err` with `error` inside it, otherwise return `Ok` with the wrapped value inside `Just` in it.

### task

**task.succeed(value: Any): Task**

> Return a successful task with your value as the success.

**task.fail(value: Any): Task**

> Return a failed task with your value as the failure.

**task.spawn(task: Task): Task**

> Will call `rawSpawn` and wrap the process inside a task.

**task.rawSpawn(task: Task): Process**

> This one is a bit tricky to explain. Let's just say that the task will be executed but will or will not go inside your `update` function depending on how you created it. If it's only a raw task, it will probably be just a fire and forget, but if it is linked to a `Plateform.Router`, it might go to your app `update` or self msg on an effect module. Not 100% at all to be honest.

**task.fromCallback(callback: Function): Task**

> The `callback` argument should be a function with two arguments, `succeed` and `fail`, that you should call when resolving your task. It's the exact same pattern as when creating a `Promise` in JavaScript.

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

**task.fromPromise(promise: Promise | Function): Task**

> Create a task from a JavaScript `Promise`. If the promise succeed, the task will succeed, otherwise, both will fail. If you pass a `function`, it will be called when the task is actually started and should return a `Promise` (which will be wrapped as a task)

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

> Return the empty tuple.

**pair(a: Any, b: Any): (a, b)**

> Return a `Tuple2` with both values as first and second arguments.

**first((a: Any, b: Any)): Any**

> Return the first value `a` from a `Tuple2`

**second((a: Any, b: Any)): Any**

> Return the second value `b` from a `Tuple2`

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright Paul Dijou ([http://pauldijou.fr](http://pauldijou.fr)).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
