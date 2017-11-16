var _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers = function () {
  var strict = true



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // UTILS
  var hasNativeUtils = typeof _elm_lang$core$Native_Utils !== 'undefined'
  var hasDictModule = typeof _elm_lang$core$Dict$empty !== 'undefined'
  var hasListModule = typeof _elm_lang$core$List$singleton !== 'undefined'
  var hasMaybeModule = typeof _elm_lang$core$Maybe$Nothing !== 'undefined'
  var hasResultModule = typeof _elm_lang$core$Result$Ok !== 'undefined'
  var hasTaskModule = typeof _elm_lang$core$Native_Scheduler !== 'undefined'
  var hasTupleModule = true



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // SCHEDULER & TASKS

  var scheduler = hasTaskModule ? _elm_lang$core$Native_Scheduler : undefined

  var ctorKey = 'ctor'

  function ctorOf(value) {
    if (typeof value === 'object') {
      return value[ctorKey] || undefined
    }
    return undefined
  }

  function indexToUnionKey(idx) {
    return '_' + idx
  }

  function stringify(value) {
    try {
      return _elm_lang$core$Native_Utils.toString(value)
    } catch (e) {
      return '' + value
    }
  }

  var basicsHelpers =
    !hasNativeUtils ? {} :
    {
      ctorOf: ctorOf,
      scheduler: scheduler,
      equals: _elm_lang$core$Native_Utils.eq,
      update: function basicsUpdate(record, patch) {
        if (strict) {
          Object.keys(patch).forEach(function (key) {
            if (!record.hasOwnProperty(key)) {
              throw new TypeError('Cannot update record since it does not have property named: ' + key)
            }
            checkSame(record[key], patch[key])
          })
        }
        return _elm_lang$core$Native_Utils.update(record, patch)
      },
      toString: _elm_lang$core$Native_Utils.toString,
      order: {
        lt: _elm_lang$core$Basics$LT,
        eq: _elm_lang$core$Basics$EQ,
        gt: _elm_lang$core$Basics$GT
      },
      compare: function basicsCompare(x, y) {
        return A2(_elm_lang$core$Basics$compare, x, y)
      },
      union: {
        create: function basicsCreate() {
          var result = {}
          for (var i = 0; i < arguments.length; ++i) {
            if (strict) { checkString(arguments[0]) }
            result[i === 0 ? ctorKey : '_' + (i - 1)] = arguments[i]
          }
          return result
        },
        at: function (unionType, idx) {
          return unionType[indexToUnionKey(idx)]
        }
      }
    }



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // DICT
  var DictEmpty = hasDictModule && _elm_lang$core$Dict$empty
  var DictSingleton = hasDictModule && A3(_elm_lang$core$Dict$insert, 'a', 'b', DictEmpty)
  var DictEmptyCtor = hasDictModule && ctorOf(DictEmpty)
  var DictSingletonCtor = hasDictModule && ctorOf(DictSingleton)

  function isDict(dict) {
    return ctorOf(dict) === DictEmptyCtor
        || ctorOf(dict) === DictSingletonCtor
  }

  var coreDictIsEmpty = hasDictModule && _elm_lang$core$Dict$isEmpty
  var coreDictKeys = hasDictModule && _elm_lang$core$Dict$keys
  var coreDictValues = hasDictModule && _elm_lang$core$Dict$values

  var dictHelpers =
    !hasDictModule ? {} :
    {
      isDict: isDict,
      empty: DictEmpty,
      singleton: function dictSingleton(key, value) {
        if (strict) { checkComparable(key) }
        return A2(_elm_lang$core$Dict$singleton, key, value)
      },
      insert: function dictInsert(key, value, dict) {
        if (strict) { checkComparable(key); checkDict(dict); checkDictKey(key, dict); checkDictValue(value, dict) }
        return A3(_elm_lang$core$Dict$insert, key, value, dict)
      },
      update: function dictUpdate(key, updater, dict) {
        if (strict) { checkComparable(key); checkFunction(updater); checkDict(dict); checkDictKey(key, dict) }
        return A3(_elm_lang$core$Dict$update, key, updater, dict)
      },
      remove: function dictRemove(key, dict) {
        if (strict) { checkComparable(key); checkDict(dict); checkDictKey(key, dict) }
        return A2(_elm_lang$core$Dict$remove, key, dict)
      },
      isEmpty: function dictIsEmpty(dict) {
        if (strict) { checkDict(dict) }
        return coreDictIsEmpty(dict)
      },
      member: function dictMember(key, dict) {
        if (strict) { checkComparable(key); checkDict(dict); checkDictKey(key, dict) }
        return A2(_elm_lang$core$Dict$member, key, dict)
      },
      get: function dictGet(key, dict) {
        if (strict) { checkComparable(key); checkDict(dict); checkDictKey(key, dict) }
        return A2(_elm_lang$core$Dict$get, key, dict)
      },
      size: function dictSize(dict) {
        if (strict) { checkDict(dict) }
        return _elm_lang$core$Dict$size(dict)
      },
      keys: function dictKeys(dict) {
        if (strict) { checkDict(dict) }
        return coreDictKeys(dict)
      },
      values: function dictValues(dict) {
        if (strict) { checkDict(dict) }
        return coreDictValues(dict)
      },
      toList: function dictToList(dict) {
        if (strict) { checkDict(dict) }
        return _elm_lang$core$Dict$toList(dict)
      },
      fromList: function dictFromList(dict) {
        if (strict) { checkDict(dict) }
        return _elm_lang$core$Dict$fromList(dict)
      },
      // map(function (key, value) { return newValue }, myDict)
      map: function dictMap(mapper, dict) {
        if (strict) { checkFunction(mapper); checkDict(dict) }
        return A2(_elm_lang$core$Dict$map, F2(mapper), dict)
      },
      // foldl(function (key, value, acc) { return newAcc }, initAcc, dict)
      foldl: function dictFoldl(folder, acc, dict) {
        if (strict) { checkFunction(folder); checkDict(dict) }
        return A3(_elm_lang$core$Dict$foldl, F3(folder), acc, dict)
      },
      foldr: function dictFoldr(folder, acc, dict) {
        if (strict) { checkFunction(folder); checkDict(dict) }
        return A3(_elm_lang$core$Dict$foldr, F3(folder), acc, dict)
      },
      filter: function dictFilter(predicate, dict) {
        if (strict) { checkFunction(predicate); checkDict(dict) }
        return A2(_elm_lang$core$Dict$filter, F2(predicate), dict)
      },
      partition: function dictPartition(predicate, dict) {
        if (strict) { checkFunction(predicate); checkDict(dict) }
        return A2(_elm_lang$core$Dict$partition, F2(predicate), dict)
      },
      union: function dictUnion(dict1, dict2) {
        if (strict) { checkDict(dict1); checkDict(dict2) }
        return A2(_elm_lang$core$Dict$union, dict1, dict2)
      },
      intersect: function dictIntersect(dict1, dict2) {
        if (strict) { checkDict(dict1); checkDict(dict2) }
        return A2(_elm_lang$core$Dict$intersect, dict1, dict2)
      },
      diff: function dictDiff(dict1, dict2) {
        if (strict) { checkDict(dict1); checkDict(dict2) }
        return A2(_elm_lang$core$Dict$diff, dict1, dict2)
      },
      merge: function dictMerge(left, both, right, leftDict, rightDict, acc) {
        if (strict) { checkFunction(left); checkFunction(both); checkFunction(right); checkDict(leftDict); checkDict(rightDict) }
        return A6(_elm_lang$core$Dict$merge, left, both, right, leftDict, rightDict, acc)
      }
    }



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // LIST
  var Nil = hasListModule && _elm_lang$core$Native_List.Nil
  var Cons = hasListModule && _elm_lang$core$Native_List.Cons
  var NilCtor = hasListModule && ctorOf(_elm_lang$core$Native_List.Nil)
  var ListSingletonCtor = hasListModule && ctorOf(_elm_lang$core$List$singleton(1))

  function isList(list) {
    return ctorOf(list) === NilCtor
        || ctorOf(list) === ListSingletonCtor
  }

  function listAll(predicate, list) {
    if (strict) { checkFunction(predicate); checkList(list) }
    return A2(_elm_lang$core$List$all, predicate, list)
  }

  var coreListIsEmpty = hasListModule && _elm_lang$core$List$isEmpty
  var coreListHead = hasListModule && _elm_lang$core$List$head

  var listHelpers =
    !hasListModule ? {} :
    {
      isList: isList,
      empty: Nil,
      singleton: _elm_lang$core$List$singleton,
      isEmpty: function listIsEmpty(list) {
        if (strict) { checkList(list) }
        return coreListIsEmpty(list)
      },
      length: function listLength(list) {
        if (strict) { checkList(list) }
        return _elm_lang$core$List$length(list)
      },
      reverse: function listReverse(list) {
        if (strict) { checkList(list) }
        return _elm_lang$core$List$reverse(list)
      },
      member: function listMember(value, list) {
        if (strict) { checkList(list); checkListValue(value, list) }
        return A2(_elm_lang$core$List$member, value, list)
      },
      head: function listHead(list) {
        if (strict) { checkList(list) }
        return coreListHead(list)
      },
      tail: function listTail(list) {
        if (strict) { checkList(list) }
        return _elm_lang$core$List$tail(list)
      },
      filter: function listFilter(predicate, list) {
        if (strict) { checkFunction(predicate); checkList(list) }
        return A2(_elm_lang$core$List$filter, predicate, list)
      },
      fromArray: function listFromArray(array) {
        if (strict) { checkJsArray(array) }
        return _elm_lang$core$Native_List.fromArray(array)
      },
      toArray: function listToArray(list) {
        if (strict) { checkList(list) }
        return _elm_lang$core$Native_List.toArray(list)
      },
      prepend: function listPrepend(value, list) {
        if (strict) { checkList(list); checkListValue(value, list) }
        return Cons(value, list)
      }
    }

  // -------------------------------------------------------------------------
  // MAYBE
  var Nothing = hasMaybeModule && _elm_lang$core$Maybe$Nothing
  var Just = hasMaybeModule && _elm_lang$core$Maybe$Just
  var NothingCtor = hasMaybeModule && ctorOf(Nothing)
  var JustCtor = hasMaybeModule && ctorOf(Just(0))

  function isNothing(value) { return ctorOf(value) === NothingCtor }
  function isJust(value)    { return ctorOf(value) === JustCtor }
  function isMaybe(value)   { return isNothing(value) || isJust(value) }

  function maybeGetImpl(value) {
    if (isJust(value)) { return value._0 }
    return undefined
  }

  var maybeHelpers =
    !hasMaybeModule ? {} :
    {
      nothing: Nothing,
      just: Just,
      isNothing: isNothing,
      isJust: isJust,
      isMaybe: isMaybe,
      get: function maybeGet(maybe) {
        if (strict) { checkMaybe(maybe) }
        return maybeGetImpl(maybe)
      },
      withDefault: function maybeWithDefault(defaultValue, maybe) {
        if (strict) { checkMaybe(maybe) }
        return A2(_elm_lang$core$Maybe$withDefault, defaultValue, maybe)
      },
      map: function maybeMap(mapper, maybe) {
        if (strict) { checkFunction(mapper); checkMaybe(maybe) }
        return A2(_elm_lang$core$Maybe$map, mapper, maybe)
      },
      andThen: function maybeAndThen(next, maybe) {
        if (strict) { checkFunction(next); checkMaybe(maybe) }
        return A2(_elm_lang$core$Maybe$andThen, next, maybe)
      },
      caseOf: function maybeCaseOf(maybe, onNothing, onJust) {
        if (strict) { checkMaybe(maybe); checkFunction(onNothing); checkFunction(onJust) }
        if (isJust(maybe)) { return onJust(maybeGetImpl(maybe)) }
        return onNothing()
      },
      parse: function maybeParse(value) {
        if (value === null || value === undefined) { return Nothing }
        if (typeof value === 'number' && isNaN(value)) { return Nothing }
        return Just(value)
      }
    }



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // RESULT
  var Ok = hasResultModule && _elm_lang$core$Result$Ok
  var Err = hasResultModule && _elm_lang$core$Result$Err
  var OkCtor = hasResultModule && ctorOf(Ok(0))
  var ErrCtor = hasResultModule && ctorOf(Err(0))

  function isOk(value)     { return ctorOf(value) === OkCtor }
  function isErr(value)    { return ctorOf(value) === ErrCtor }
  function isResult(value) { return isOk(value) || isErr(value) }

  function resultGetImpl(value) {
    if (isResult(value)) { return value._0 }
    return undefined
  }

  var resultHelpers =
    !hasResultModule ? {} :
    {
      ok: Ok,
      err: Err,
      isOk: isOk,
      isErr: isErr,
      isResult: isResult,
      get: function resultGet(result) {
        if (strict) { checkResult(result) }
        return resultGetImpl(result)
      },
      withDefault: function resultWithDefault(defaultValue, result) {
        if (strict) { checkResult(result) }
        return A2(_elm_lang$core$Result$withDefault, defaultValue, result)
      },
      toMaybe: function resultToMaybe(result) {
        if (strict) { checkResult(result) }
        return _elm_lang$core$Result$toMaybe(result)
      },
      fromMaybe: function resultFromMaybe(err, maybe) {
        if (strict) { checkMaybe(maybe) }
        return A2(_elm_lang$core$Result$fromMaybe, err, maybe)
      },
      map: function resultMap(mapper, result) {
        if (strict) { checkFunction(mapper); checkResult(result) }
        return A2(_elm_lang$core$Result$map, mapper, result)
      },
      mapError: function resultMapError(mapper, result) {
        if (strict) { checkFunction(mapper); checkResult(result) }
        return A2(_elm_lang$core$Result$mapError, mapper, result)
      },
      andThen: function resultAndThen(next, result) {
        if (strict) { checkFunction(next); checkResult(result) }
        return A2(_elm_lang$core$Result$andThen, next, result)
      },
      caseOf: function resultCaseOf(result, onErr, onOk) {
        if (strict) { checkResult(result); checkFunction(onErr); checkFunction(onOk) }
        if (isErr(result)) { return onErr(resultGetImpl(result)) }
        if (isOk(result))  { return onOk(resultGetImpl(result)) }
      }
    }



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // TASK
  function isThenable(promise) {
    return (promise && typeof promise['then'] === 'function')
  }

  function normalizePromise(promise) {
    return promise.then(function (success) {
        return { ok: true, value: success }
      }, function (failure) {
        return { ok: false, value: failure }
      })
  }

  function isTask(task) {
    return (ctorOf(task) || '').indexOf('_Task_') === 0
  }

  var taskHelpers =
    !hasTaskModule ? {} :
    {
      succeed: scheduler.succeed,
      fail: scheduler.fail,
      spawn: function taskSpawn(task) {
        if (strict) { checkTask(task) }
        return scheduler.spawn(task)
      },
      rawSpawn: function taskRawSpawn(task) {
        if (strict) { checkTask(task) }
        return scheduler.rawSpawn(task)
      },
      // fromCallback(function (succeed, fail) {
      //   if (isOk) { succeed(result) } else { fail(failure) }
      // })
      fromCallback: function fromCallback(callback) {
        if (strict) { checkFunction(callback) }
        return scheduler.nativeBinding(function (schedulerCallback) {
          callback(
            function (success) { schedulerCallback(scheduler.succeed(success)) },
            function (failure) { schedulerCallback(scheduler.fail(failure)) }
          )
        })
      },
      // we need to wrap the promise right away because it will start running
      // as soon as created but the nativeBinding might be called way later
      // after it's already completed and we do not want to catch errors
      // asynchronously
      fromPromise: function fromPromise(promise) {
        if (strict && !isFunction(promise) && !isThenable(promise)) {
          throw new TypeError('Expected a function or a Promise, got: ' + promise)
        }

        if (isThenable(promise)) {
          promise = normalizePromise(promise)
        }

        return scheduler.nativeBinding(function (schedulerCallback) {
          if (typeof promise === 'function') {
            promise = promise()
            if (strict && !isThenable(promise)) {
              throw new TypeError('Expected the function to return a Promise, got: ' + promise)
            }
            promise = normalizePromise(promise)
          }

          promise.then(function (result) {
            if (result.ok) {
              schedulerCallback(scheduler.succeed(result.value))
            } else {
              schedulerCallback(scheduler.fail(result.value))
            }
          })
        })
      }
    }



  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // TUPLE
  function tuplePair(a, b) {
    return _elm_lang$core$Native_Utils.Tuple2(a, b)
  }

  var Tuple2 = hasTupleModule && tuplePair(1, 2)
  var Tuple2Ctor = hasTupleModule && ctorOf(Tuple2)

  function isTuple2(tuple) {
    return ctorOf(tuple) === Tuple2Ctor
  }

  function isTuple(tuple) {
    return (ctorOf(tuple) || '').indexOf('_Tuple') === 0
  }

  // private function
  function tupleAll(predicate, tuple) {
    return Object.keys(tuple).reduce(function (res, key) {
      if (key === ctorKey) { return res }
      return res && predicate(tuple[key])
    }, true)
  }

  var tupleHelpers =
    !hasTupleModule ? {} :
    {
      empty: _elm_lang$core$Native_Utils.Tuple0,
      pair: tuplePair,
      first: function tupleFirst(tuple) {
        if (strict) { checkTuple2(tuple) }
        return _elm_lang$core$Tuple$first(tuple)
      },
      second: function tupleSecond(tuple) {
        if (strict) { checkTuple2(tuple) }
        return _elm_lang$core$Tuple$second(tuple)
      }
    }

  // -------------------------------------------------------------------------
  // CHECKS
  function isRecord(record) {
    return (record instanceof Object) &&
      (ctorOf(record) === undefined)
  }

  function isString(value) {
    return typeof value === 'string'
  }

  function isInt(value) {
    return isFloat(value) &&
      (-2147483647 < value) &&
      (value < 2147483647) &&
      ((value | 0) === value)
  }

  function isFloat(value) {
    return (typeof value === 'number') && (!isNaN(value))
  }

  function isBool(value) {
    return typeof value === 'boolean'
  }

  function isSame(a, b) {
    if (a === b) { return true }
    if (a === undefined) { return b === undefined }
    if (a === null) { return b === null }
    if (isString(a)) { return isString(b) }
    if (isInt(a)) { return isInt(b) }
    if (isFloat(a)) { return isFloat(b) }
    if (isBool(a)) { return isBool(b) }

    if (hasMaybeModule && isNothing(a)) { return isMaybe(b) }
    if (hasMaybeModule && isJust(a)) { return isNothing(b) || (isJust(b) && isSame(maybeGetImpl(a), maybeGetImpl(b))) }

    if (hasResultModule && isOk(a)) { return isErr(b) || (isOk(b) && isSame(resultGetImpl(a), resultGetImpl(b))) }
    if (hasResultModule && isErr(a)) { return isOk(b) || (isErr(b) && isSame(resultGetImpl(a), resultGetImpl(b))) }

    if (hasListModule && isList(a)) {
      return isList(b) && isSame(coreListHead(a), coreListHead(b))
    }

    if (hasDictModule && isDict(a)) {
      return isDict(b) && isSame(coreDictKeys(a), coreDictKeys(b)) && isSame(coreDictValues(a), coreDictValues(b))
    }

    if (isRecord(a)) {
      return isRecord(b) &&
        (Object.keys(a).length === Object.keys(b).length) &&
        Object.keys(a).reduce(function (acc, key) { return acc && isSame(a[key], b[key]) }, true)
    }

    if (isTuple(a)) {
      return isTuple(b) &&
        (Object.keys(a).length === Object.keys(b).length) &&
        Object.keys(a).reduce(function (acc, key) {
          return key === ctorKey ? acc : acc && isSame(a[key], b[key])
        }, true)
    }

    if (hasTaskModule && isTask(a)) {
      return isTask(b)
    }

    return true
  }

  function isComparable(value) {
    return isString(value)
      || isFloat(value)
      || (hasListModule && isList(value) && listAll(isComparable, value))
      || (hasTupleModule && isTuple(value) && tupleAll(isComparable, value))
  }

  function isFunction(value) {
    return typeof value === 'function'
  }

  function checkSame(value1, value2) {
    if (!isSame(value1, value2)) {
      throw new TypeError('Expected both values to be the same but first one was ' + stringify(value1) + ', while second one was ' + stringify(value2))
    }
  }

  function checkString(value) {
    if (!isString(value)) { throw new TypeError('Expected a string, got: ' + stringify(value)) }
  }

  function checkFunction(value) {
    if (!isFunction(value)) { throw new TypeError('Expected a function, got: ' + stringify(value)) }
  }

  function checkComparable(value) {
    if (!isComparable(value)) { throw new TypeError('Expected a comparable value, got: ' + stringify(value)) }
  }

  function checkList(value) {
    if (!isList(value)) { throw new TypeError('Expected a List, got: ' + stringify(value)) }
  }

  function checkListValue(value, list) {
    var head = coreListHead(list)
    if (isJust(head)) { checkSame(value, maybeGetImpl(head)) }
  }

  function checkDict(value) {
    if (!isDict(value)) { throw new TypeError('Expected a Dict, got: ' + stringify(value)) }
  }

  function checkDictKey(key, dict) {
    var firstKey = coreListHead(coreDictKeys(dict))
    if (isJust(firstKey)) { checkSame(key, maybeGetImpl(firstKey)) }
  }

  function checkDictValue(value, dict) {
    var firstValue = coreListHead(coreDictValues(dict))
    if (isJust(firstValue)) { checkSame(value, maybeGetImpl(firstValue)) }
  }

  function checkMaybe(value) {
    if (!isMaybe(value)) { throw new TypeError('Expected a Maybe, got: ' + stringify(value)) }
  }

  function checkResult(value) {
    if (!isResult(value)) { throw new TypeError('Expected a Result, got: ' + stringify(value)) }
  }

  function checkTask(value) {
    if (!isTask(value)) { throw new TypeError('Expected a Task, got: ' + stringify(value)) }
  }

  function checkTuple2(value) {
    if (!isTuple2(value)) { throw new TypeError('Expected a Tuple2, got: ' + stringify(value)) }
  }

  function checkJsArray(value) {
    if (!Array.isArray(value)) { throw new TypeError('Expected a JavaScript array, got: ' + stringify(value)) }
  }

  return {
    noWarnings: '',
    strict: function (value) {
      strict = value
    },
    basics: basicsHelpers,
    dict: dictHelpers,
    list: listHelpers,
    maybe: maybeHelpers,
    result: resultHelpers,
    task: taskHelpers,
    tuple: tupleHelpers
  }
}()
