port module KernelHelpers exposing (..)

import Dict
import Task

import Ordeal exposing (..)

import Native.Kernel.Helpers
import Native.Tests

main: Ordeal
main = run emit all

port emit : Event -> Cmd msg

all: Test
all =
  describe "Kernel Helpers"
    [ describe "basics"
      [ test "ctorOf" (
        success
        |> andThen (
          Native.Tests.ctorOf Nothing |> shouldEqual "Nothing"
        )
        |> andThen (
          Native.Tests.ctorOf (Just 1) |> shouldEqual "Just"
        )
        |> andThen (
          Native.Tests.ctorOf [] |> shouldEqual "[]"
        )
        |> andThen (
          Native.Tests.ctorOf [ 1 ] |> shouldEqual "::"
        )
      )
      , test "equals" (
        success
        |> andThen (
          Native.Tests.equals { first = { a = "a", b = 1 }, second = { b = 1, a = "a" } }
          |> shouldEqual True
        )
        |> andThen (
          Native.Tests.equals { first = 1, second = 2 }
          |> shouldEqual False
        )
        |> andThen (
          Native.Tests.equals { first = True, second = 1 }
          |> shouldEqual False
        )
      )
      ]
    , describe "dict"
      [ test "empty" (
        Native.Tests.dictEmpty
        |> shouldEqual Dict.empty
      )
      , test "insert" (
        Native.Tests.dictInsert { key = "a", value = 1, dict = Dict.empty }
        |> shouldEqual (Dict.empty |> Dict.insert "a" 1)
      )
      ]
    , describe "list"
      [ test "empty" (
        Native.Tests.listEmpty
        |> shouldEqual []
      )
      ]
    , describe "maybe"
      [ test "nothing" (
        Native.Tests.maybeNothing
        |> shouldEqual Nothing
      )
      , test "just" (
        Native.Tests.maybeJust { a = 1 }
        |> shouldEqual (Just { a = 1 })
      )
      , test "isNothing" (
        success
        |> andThen (Native.Tests.maybeIsNothing Nothing  |> shouldEqual True)
        |> andThen (Native.Tests.maybeIsNothing (Just 1) |> shouldEqual False)
      )
      , test "isJust" (
        success
        |> andThen (Native.Tests.maybeIsJust Nothing  |> shouldEqual False)
        |> andThen (Native.Tests.maybeIsJust (Just 1) |> shouldEqual True)
      )
      , test "isMaybe" (
        success
        |> andThen (Native.Tests.maybeIsMaybe Nothing  |> shouldEqual True)
        |> andThen (Native.Tests.maybeIsMaybe (Just 1) |> shouldEqual True)
      )
      , test "get" (
        Native.Tests.maybeGet (Just 1) |> shouldEqual 1
      )
      , test "withDefault" (
        success
        |> andThen (Native.Tests.maybeWithDefault { def = 1, maybe = Nothing } |> shouldEqual 1)
        |> andThen (Native.Tests.maybeWithDefault { def = 1, maybe = Just 2  } |> shouldEqual 2)
      )
      , test "map" (
        success
        |> andThen (
          Native.Tests.maybe_map { mapper = (\_ -> ""), maybe = Nothing }
          |> shouldEqual Nothing
        )
        |> andThen (
          Native.Tests.maybe_map { mapper = (\v -> v + 1), maybe = Just 1 }
          |> shouldEqual (Just 2)
        )
      )
      , test "andThen" (
        success
        |> andThen (
          Native.Tests.maybe_andThen { next = (\_ -> Just ""), maybe = Nothing }
          |> shouldEqual Nothing
        )
        |> andThen (
          Native.Tests.maybe_andThen { next = (\v -> Nothing), maybe = Just 1 }
          |> shouldEqual Nothing
        )
        |> andThen (
          Native.Tests.maybe_andThen { next = (\v -> Just (v + 1)), maybe = Just 1 }
          |> shouldEqual (Just 2)
        )
      )
      ]
    , describe "result"
      [ test "ok" (
        Native.Tests.resultOk True
        |> shouldEqual (Ok True)
      )
      , test "err" (
        Native.Tests.resultErr { a = 1 }
        |> shouldEqual (Err { a = 1 })
      )
      , test "isOk" (
        success
        |> andThen (Native.Tests.resultIsOk (Ok "a") |> shouldEqual True)
        |> andThen (Native.Tests.resultIsOk (Err 1)  |> shouldEqual False)
      )
      , test "isErr" (
        success
        |> andThen (Native.Tests.resultIsErr (Ok 1)  |> shouldEqual False)
        |> andThen (Native.Tests.resultIsErr (Err 1) |> shouldEqual True)
      )
      , test "isResult" (
        success
        |> andThen (Native.Tests.resultIsResult (Ok 1)  |> shouldEqual True)
        |> andThen (Native.Tests.resultIsResult (Err 1) |> shouldEqual True)
      )
      , test "get" (
        success
        |> andThen (Native.Tests.resultGet (Ok 1)  |> shouldEqual 1)
        |> andThen (Native.Tests.resultGet (Err 1) |> shouldEqual 1)
      )
      , test "withDefault" (
        success
        |> andThen (Native.Tests.result_withDefault { def = 1, result = Ok 2 } |> shouldEqual 2)
        |> andThen (Native.Tests.result_withDefault { def = 1, result = Err 2  } |> shouldEqual 1)
      )
      , test "map" (
        success
        |> andThen (
          Native.Tests.result_map { mapper = (\_ -> ""), result = Err 1 }
          |> shouldEqual (Err 1)
        )
        |> andThen (
          Native.Tests.result_map { mapper = (\v -> v + 1), result = Ok 1 }
          |> shouldEqual (Ok 2)
        )
      )
      , test "andThen" (
        success
        |> andThen (
          Native.Tests.result_andThen { next = (\_ -> Just ""), result = Err 1 }
          |> shouldEqual (Err 1)
        )
        |> andThen (
          Native.Tests.result_andThen { next = (\v -> Err 2), result = Ok 1 }
          |> shouldEqual (Err 2)
        )
        |> andThen (
          Native.Tests.result_andThen { next = (\v -> Ok (v + 1)), result = Ok 1 }
          |> shouldEqual (Ok 2)
        )
      )
      ]
    , describe "task"
      [ test "succeed" (
        Native.Tests.taskSucceed "a"
        |> shouldSucceedWith "a"
      )
      , test "fail" (
        Native.Tests.taskFail "a"
        |> shouldFailWith "a"
      )
      , test "fromCallback success" (
        Native.Tests.taskFromCallback 42
        |> shouldSucceedWith 42
      )
      , test "fromCallback failure" (
        Native.Tests.taskFromCallbackFail 42
        |> shouldFailWith 42
      )
      , test "fromPromise success" (
        Native.Tests.taskFromPromise "42"
        |> shouldSucceedWith "42"
      )
      , test "fromPromise failure" (
        Native.Tests.taskFromPromiseFail "42"
        |> shouldFailWith "42"
      )
      ]
    , describe "tuple"
      [ test "empty" (
        Native.Tests.tupleEmpty
        |> shouldEqual ()
      )
      , test "pair" (
        Native.Tests.tuplePair { first = 1, second = "a" }
        |> shouldEqual (1, "a")
      )
      , test "first" (
        Native.Tests.tupleFirst ("a", True)
        |> shouldEqual "a"
      )
      , test "second" (
        Native.Tests.tupleSecond ("a", True)
        |> shouldEqual True
      )
      ]
    ]
