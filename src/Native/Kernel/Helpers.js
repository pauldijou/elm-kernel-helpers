var _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers = function () {
  var scheduler = _elm_lang$core$Native_Scheduler

  function ctorOf(value) {
    if (typeof value === 'object') {
      return value.ctor || undefined
    }

    return undefined
  }

  var Nil = _elm_lang$core$Native_List.Nil
  var Cons = _elm_lang$core$Native_List.Cons

  var Nothing = _elm_lang$core$Maybe$Nothing
  var Just = _elm_lang$core$Maybe$Just
  var NothingCtor = ctorOf(Nothing)
  var JustCtor = ctorOf(Just(0))

  function isNothing(value) { return ctorOf(value) === NothingCtor }
  function isJust(value)    { return ctorOf(value) === JustCtor }

  function maybeGet(value) {
    if (isJust(value)) { return value._0 }
    return undefined
  }

  var Ok = _elm_lang$core$Result$Ok
  var Err = _elm_lang$core$Result$Err
  var OkCtor = ctorOf(Ok(0))
  var ErrCtor = ctorOf(Err(0))

  function isOk(value)     { return ctorOf(value) === OkCtor }
  function isErr(value)    { return ctorOf(value) === ErrCtor }
  function isResult(value) { return isOk(value) || isErr(value) }

  function resultGet(value) {
    if (isResult(value)) { return value._0 }
    return undefined
  }

  return {
    // -------------------------------------------------------------------------
    // BASICS
    basics: {
      ctorOf: ctorOf,
      scheduler: scheduler,
      equals: _elm_lang$core$Native_Utils.eq,
      update: _elm_lang$core$Native_Utils.update,
      toString: _elm_lang$core$Native_Utils.toString
    },
    // -------------------------------------------------------------------------
    // DICT
    dict: {
      empty: _elm_lang$core$Dict$empty,
      insert: function dictInsert(key, value, dict) {
        return A3(_elm_lang$core$Dict$insert, key, value, dict)
      },
      update: function dictUpdate(key, updater, dict) {
        return A3(_elm_lang$core$Dict$update, key, updater, dict)
      },
      remove: function dictRemove(key, dict) {
        return A2(_elm_lang$core$Dict$remove, key, dict)
      },
      isEmpty: _elm_lang$core$Dict$isEmpty,
      member: function dictMember(key, dict) {
        return A2(_elm_lang$core$Dict$member, key, dict)
      },
      get: function dictGet(key, dict) {
        return A2(_elm_lang$core$Dict$get, key, dict)
      },
      size: _elm_lang$core$Dict$size,
      keys: _elm_lang$core$Dict$keys,
      values: _elm_lang$core$Dict$values,
      toList: _elm_lang$core$Dict$toList,
      fromList: _elm_lang$core$Dict$fromList,
      // map(function (key, value) { return newValue }, myDict)
      map: function dictMap(mapper, dict) {
        return A2(_elm_lang$core$Dict$map, F2(mapper), dict)
      },
      // foldl(function (key, value, acc) { return newAcc }, initAcc, dict)
      foldl: function dictFoldl(folder, acc, dict) {
        return A3(_elm_lang$core$Dict$foldl, F3(folder), acc, dict)
      },
      foldr: function dictFoldr(folder, acc, dict) {
        return A3(_elm_lang$core$Dict$foldr, F3(folder), acc, dict)
      },
      filter: function dictFilter(predicate, dict) {
        return A2(_elm_lang$core$Dict$filter, F2(predicate), dict)
      },
      partition: function dictPartition(predicate, dict) {
        return A2(_elm_lang$core$Dict$partition, F2(predicate), dict)
      },
      union: function dictUnion(dict1, dict2) {
        return A2(_elm_lang$core$Dict$union, dict1, dict2)
      },
      intersect: function dictIntersect(dict1, dict2) {
        return A2(_elm_lang$core$Dict$intersect, dict1, dict2)
      },
      diff: function dictDiff(dict1, dict2) {
        return A2(_elm_lang$core$Dict$diff, dict1, dict2)
      },
      merge: function dictMerge(left, both, right, leftDict, rightDict, acc) {
        return A6(_elm_lang$core$Dict$merge, left, both, right, leftDict, rightDict, acc)
      }
    },
    // -------------------------------------------------------------------------
    // LIST
    list: {
      empty: Nil,
      singleton: _elm_lang$core$List$singleton,
      isEmpty: _elm_lang$core$List$isEmpty,
      length: _elm_lang$core$List$length,
      reverse: _elm_lang$core$List$reverse,
      member: function listMember(value, list) {
        return A2(_elm_lang$core$List$member, value, list)
      },
      filter: function listFilter(predicate, list) {
        return A2(_elm_lang$core$List$filter, predicate, list)
      },
      fromArray: _elm_lang$core$Native_List.fromArray,
      toArray: _elm_lang$core$Native_List.toArray,
      prepend: function listPrepend(value, list) {
        return Cons(value, list)
      }
    },
    // -------------------------------------------------------------------------
    // MAYBE
    maybe: {
      nothing: Nothing,
      just: Just,
      isNothing: isNothing,
      isJust: isJust,
      isMaybe: function isMaybe(value) {
        return isNothing(value) || isJust(value)
      },
      get: maybeGet,
      withDefault: function maybeWithDefault(defaultValue, maybe) {
        return A2(_elm_lang$core$Maybe$withDefault, defaultValue, maybe)
      },
      map: function maybeMap(mapper, maybe) {
        return A2(_elm_lang$core$Maybe$map, mapper, maybe)
      },
      andThen: function maybeAndThen(fn, maybe) {
        return A2(_elm_lang$core$Maybe$andThen, fn, maybe)
      },
      caseOf: function maybeCaseOf(maybe, onNothing, onJust) {
        if (isJust(maybe)) {
          return onJust(maybeGet(maybe))
        }
        return onNothing()
      }
    },
    // -------------------------------------------------------------------------
    // RESULT
    result: {
      ok: Ok,
      err: Err,
      isOk: isOk,
      isErr: isErr,
      isResult: isResult,
      get: resultGet,
      withDefault: function resultWithDefault(defaultValue, result) {
        return A2(_elm_lang$core$Result$withDefault, defaultValue, result)
      },
      toMaybe: _elm_lang$core$Result$toMaybe,
      fromMaybe: function resultFromMaybe(err, maybe) {
        return A2(_elm_lang$core$Result$fromMaybe, err, maybe)
      },
      map: function resultMap(mapper, result) {
        return A2(_elm_lang$core$Result$map, mapper, result)
      },
      mapError: function resultMapError(mapper, result) {
        return A2(_elm_lang$core$Result$mapError, mapper, result)
      },
      andThen: function resultAndThen(fn, result) {
        return A2(_elm_lang$core$Result$andThen, fn, result)
      },
      caseOf: function resultCaseOf(result, onErr, onOk) {
        if (isErr(result)) { return onErr(resultGet(result)) }
        if (isOk(result))  { return onOk(resultGet(result)) }
        return undefined
      }
    },
    // -------------------------------------------------------------------------
    // TASK
    task: {
      succeed: scheduler.succeed,
      fail: scheduler.fail,
      spawn: scheduler.spawn,
      rawSpawn: scheduler.rawSpawn,
      // fromCallback(function (succeed, fail) {
      //   if (isOk) { succeed(result) } else { fail(failure) }
      // })
      fromCallback: function fromCallback(callback) {
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
        var wrappedPromise =
          promise
          .then(function (success) {
            return { ok: true, value: success }
          })
          .catch(function (failure) {
            return { ok: false, value: failure }
          })

        return scheduler.nativeBinding(function (schedulerCallback) {
          wrappedPromise
            .then(function (result) {
              if (result.ok) {
                schedulerCallback(scheduler.succeed(result.value))
              } else {
                schedulerCallback(scheduler.fail(result.value))
              }
            })
        })
      }
    },
    // -------------------------------------------------------------------------
    // TUPLE
    tuple: {
      empty: _elm_lang$core$Native_Utils.Tuple0,
      pair: function tuplePair(a, b) {
        return _elm_lang$core$Native_Utils.Tuple2(a, b)
      },
      first: _elm_lang$core$Tuple$first,
      second: _elm_lang$core$Tuple$second
    }
  }
}()
