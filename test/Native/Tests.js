var _pauldijou$elm_kernel_helpers$Native_Tests = function () {
  var helpers = _pauldijou$elm_kernel_helpers$Native_Kernel_Helpers

  return {
    ctorOf: helpers.basics.ctorOf,
    equals: function (params) { return helpers.basics.equals(params.first, params.second) },
    update: function (params) { return helpers.basics.update(params.record, params.patch) },
    toString: helpers.basics.toString,
    dictEmpty: helpers.dict.empty,
    dictInsert: function (params) {
      return helpers.dict.insert(params.key, params.value, params.dict)
    },
    listEmpty: helpers.list.empty,
    maybeNothing: helpers.maybe.nothing,
    maybeJust: helpers.maybe.just,
    maybeIsNothing: helpers.maybe.isNothing,
    maybeIsJust: helpers.maybe.isJust,
    resultOk: helpers.result.ok,
    resultErr: helpers.result.err,
    resultIsOk: helpers.result.isOk,
    resultIsErr: helpers.result.isErr,
    taskSucceed: helpers.task.succeed,
    taskFail: helpers.task.fail,
    taskFromCallback: function (value) {
      return helpers.task.fromCallback(function (succeed) {
        setTimeout(function () {
          succeed(value)
        }, 10)
      })
    },
    taskFromCallbackFail: function (value) {
      return helpers.task.fromCallback(function (succeed, fail) {
        setTimeout(function () {
          fail(value)
        }, 10)
      })
    },
    taskFromPromise: function (value) {
      return helpers.task.fromPromise(new Promise(function (resolve) {
        setTimeout(function () {
          resolve(value)
        }, 10)
      }))
    },
    taskFromPromiseFail: function (value) {
      return helpers.task.fromPromise(new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(value)
        }, 10)
      }))
    },
    tupleEmpty: helpers.tuple.empty,
    tuplePair: function (params) { return helpers.tuple.pair(params.first, params.second) }
  }
}()
