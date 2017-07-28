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

  var Ok = _elm_lang$core$Result$Ok
  var Err = _elm_lang$core$Result$Err
  var OkCtor = ctorOf(Ok(0))
  var ErrCtor = ctorOf(Err(0))

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
      insert: function insert(key, value, dict) {
        return A3(_elm_lang$core$Dict$insert, key, value, dict)
      },
      update: function update(key, updater, dict) {
        return A3(_elm_lang$core$Dict$update, key, updater, dict)
      },
      remove: function remove(key, dict) {
        return A2(_elm_lang$core$Dict$remove, key, dict)
      },
      isEmpty: _elm_lang$core$Dict$isEmpty,
      member: function member(key, dict) {
        return A2(_elm_lang$core$Dict$member, key, dict)
      },
      get: function get(key, dict) {
        return A2(_elm_lang$core$Dict$get, key, dict)
      },
      size: _elm_lang$core$Dict$size,
      keys: _elm_lang$core$Dict$keys,
      values: _elm_lang$core$Dict$values,
      toList: _elm_lang$core$Dict$toList,
      fromList: _elm_lang$core$Dict$fromList,
      // map(function (key, value) { return newValue }, myDict)
      map: function map(mapper, dict) {
        return A2(_elm_lang$core$Dict$map, F2(mapper), dict)
      },
      // foldl(function (key, value, acc) { return newAcc }, initAcc, dict)
      foldl: function foldl(folder, acc, dict) {
        return A3(_elm_lang$core$Dict$foldl, F3(folder), acc, dict)
      },
      foldr: function foldr(folder, acc, dict) {
        return A3(_elm_lang$core$Dict$foldr, F3(folder), acc, dict)
      },
      filter: function filter(predicate, dict) {
        return A2(_elm_lang$core$Dict$filter, F2(predicate), dict)
      },
      partition: function partition(predicate, dict) {
        return A2(_elm_lang$core$Dict$partition, F2(predicate), dict)
      },
      union: function union(dict1, dict2) {
        return A2(_elm_lang$core$Dict$union, dict1, dict2)
      },
      intersect: function intersect(dict1, dict2) {
        return A2(_elm_lang$core$Dict$intersect, dict1, dict2)
      },
      diff: function diff(dict1, dict2) {
        return A2(_elm_lang$core$Dict$diff, dict1, dict2)
      },
      merge: function merge(left, both, right, leftDict, rightDict, acc) {
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
      member: function member(value, list) {
        return A2(_elm_lang$core$List$member, value, list)
      },
      filter: function filter(predicate, list) {
        return A2(_elm_lang$core$List$filter, predicate, list)
      },
      fromArray: _elm_lang$core$Native_List.fromArray,
      toArray: _elm_lang$core$Native_List.toArray,
      prepend: function prepend(value, list) {
        return Cons(value, list)
      }
    },
    // -------------------------------------------------------------------------
    // MAYBE
    maybe: {
      nothing: Nothing,
      just: Just,
      isNothing: function isNothing(value) {
        return ctorOf(value) === NothingCtor
      },
      isJust: function isJust(value) {
        return ctorOf(value) === JustCtor
      }
    },
    // -------------------------------------------------------------------------
    // RESULT
    result: {
      ok: Ok,
      err: Err,
      isOk: function isOk(value) {
        return ctorOf(value) === OkCtor
      },
      isErr: function isErr(value) {
        return ctorOf(value) === ErrCtor
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
      fromPromise: function fromPromise(promise) {
        return scheduler.nativeBinding(function (schedulerCallback) {
          promise
            .then(function (success) {
              schedulerCallback(scheduler.succeed(success))
            })
            .catch(function (failure) {
              schedulerCallback(scheduler.fail(failure))
            })
        })
      }
    },
    // -------------------------------------------------------------------------
    // TUPLE
    tuple: {
      empty: _elm_lang$core$Native_Utils.Tuple0,
      pair: function pair(a, b) {
        return _elm_lang$core$Native_Utils.Tuple2(a, b)
      }
    }
  }
}()
