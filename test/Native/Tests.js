var _pauldijou$elm_kernel_helpers$Native_Tests = function () {
  var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

  return {
    jsArray: [ 1, 2, 3 ],
    ctorOf: helpers.basics.ctorOf,
    equals: function (params) { return helpers.basics.equals(params.first, params.second) },
    update: function (params) { return helpers.basics.update(params.record, params.patch) },
    toString: helpers.basics.toString,
    dictEmpty: helpers.dict.empty,
    dictInsert: function (params) {
      return helpers.dict.insert(params.key, params.value, params.dict)
    },
    list_empty: helpers.list.empty,
    list_singleton: helpers.list.singleton,
    list_isEmpty: helpers.list.isEmpty,
    list_length: helpers.list.length,
    list_reverse: helpers.list.reverse,
    list_member: function (params) { return helpers.list.member(params.value, params.list) },
    list_filter: function (params) { return helpers.list.filter(params.predicate, params.list) },
    list_fromArray: helpers.list.fromArray,
    list_toArray: helpers.list.toArray,
    list_prepend: function (params) { return helpers.list.prepend(params.value, params.list) },
    maybeNothing: helpers.maybe.nothing,
    maybeJust: helpers.maybe.just,
    maybeIsNothing: helpers.maybe.isNothing,
    maybeIsJust: helpers.maybe.isJust,
    maybeIsMaybe: helpers.maybe.isMaybe,
    maybeGet: helpers.maybe.get,
    maybeWithDefault: function (params) { return helpers.maybe.withDefault(params.def, params.maybe) },
    maybe_map: function (params) { return helpers.maybe.map(params.mapper, params.maybe) },
    maybe_andThen: function (params) { return helpers.maybe.andThen(params.next, params.maybe) },
    resultOk: helpers.result.ok,
    resultErr: helpers.result.err,
    resultIsOk: helpers.result.isOk,
    resultIsErr: helpers.result.isErr,
    resultIsResult: helpers.result.isResult,
    resultGet: helpers.result.get,
    result_withDefault: function (params) { return helpers.result.withDefault(params.def, params.result) },
    result_map: function (params) { return helpers.result.map(params.mapper, params.result) },
    result_mapError: function (params) { return helpers.result.mapError(params.mapper, params.result) },
    result_andThen: function (params) { return helpers.result.andThen(params.next, params.result) },
    result_toMaybe: helpers.result.toMaybe,
    result_fromMaybe: function (params) { return helpers.result.fromMaybe(params.error, params.result) },
    taskSucceed: helpers.task.succeed,
    taskFail: helpers.task.fail,
    taskFromCallback: function (value) {
      return helpers.task.fromCallback(function (succeed) {
        setTimeout(function () {
          succeed(value)
        }, 5)
      })
    },
    taskFromCallbackFail: function (value) {
      return helpers.task.fromCallback(function (succeed, fail) {
        setTimeout(function () {
          fail(value)
        }, 5)
      })
    },
    taskFromPromise: function (value) {
      return helpers.task.fromPromise(new Promise(function (resolve) {
        setTimeout(function () {
          resolve(value)
        }, 5)
      }))
    },
    taskFromPromiseFail: function (value) {
      return helpers.task.fromPromise(new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(value)
        }, 5)
      }))
    },
    tupleEmpty: helpers.tuple.empty,
    tuplePair: function (params) { return helpers.tuple.pair(params.first, params.second) },
    tupleFirst: helpers.tuple.first,
    tupleSecond: helpers.tuple.second
  }
}()
