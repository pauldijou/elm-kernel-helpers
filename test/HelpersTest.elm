port module HelpersTest exposing (..)

import Dict
import Task

import Ordeal exposing (..)

import Kernel.Helpers
import Native.Tests

main: Ordeal
main = run emit tests

port emit : Event -> Cmd msg

tests: Test
tests =
  describe "Helpers"
    [ describe "basics"
      [ test "ctorOf" (
        all
          [ Native.Tests.ctorOf Nothing |> shouldEqual "Nothing"
          , Native.Tests.ctorOf (Just 1) |> shouldEqual "Just"
          , Native.Tests.ctorOf [] |> shouldEqual "[]"
          , Native.Tests.ctorOf [ 1 ] |> shouldEqual "::"
          ]
      )
      , test "equals" (
        all
          [ Native.Tests.equals { first = { a = "a", b = 1 }, second = { b = 1, a = "a" } }
            |> shouldEqual True
          , Native.Tests.equals { first = 1, second = 2 }
            |> shouldEqual False
          , Native.Tests.equals { first = True, second = 1 }
            |> shouldEqual False
          ]
      )
      , test "toString" (
        all
          [ Native.Tests.toString 1 |> shouldEqual "1"
          , Native.Tests.toString 4.2 |> shouldEqual "4.2"
          , Native.Tests.toString "a" |> shouldEqual "\"a\""
          , Native.Tests.toString True |> shouldEqual "True"
          , Native.Tests.toString False |> shouldEqual "False"
          ]
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
        Native.Tests.list_empty
        |> shouldEqual []
      )
      , test "singleton" (
        Native.Tests.list_singleton 1
        |> shouldEqual [ 1 ]
      )
      , test "length" (
        Native.Tests.list_length [ 1, 2, 3 ]
        |> shouldEqual 3
      )
      , test "reverse" (
        Native.Tests.list_reverse [ 1, 2, 3 ]
        |> shouldEqual [ 3, 2, 1 ]
      )
      , test "member" (
        all
          [ Native.Tests.list_member { value = 1, list = [ 1, 2, 3 ] } |> shouldEqual True
          , Native.Tests.list_member { value = 2, list = [ 1, 2, 3 ] } |> shouldEqual True
          , Native.Tests.list_member { value = 3, list = [ 1, 2, 3 ] } |> shouldEqual True
          , Native.Tests.list_member { value = 4, list = [ 1, 2, 3 ] } |> shouldEqual False
          , Native.Tests.list_member { value = 5, list = [ 1, 2, 3 ] } |> shouldEqual False
          ]
      )
      , test "filter" (
        Native.Tests.list_filter { predicate = (\v -> v % 2 == 0), list = [ 1, 2, 3, 4 ] }
        |> shouldEqual [ 2, 4 ]
      )
      , test "fromArray" (
        Native.Tests.list_fromArray Native.Tests.jsArray
        |> shouldEqual [ 1, 2, 3 ]
      )
      , test "toArray" (
        Native.Tests.list_toArray [ 1, 2, 3 ]
        |> shouldEqual Native.Tests.jsArray
      )
      , test "prepend" (
        Native.Tests.list_prepend { value = 1, list = [ 2, 3 ] }
        |> shouldEqual [ 1, 2, 3 ]
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
        all
          [ Native.Tests.maybeIsNothing Nothing  |> shouldEqual True
          , Native.Tests.maybeIsNothing (Just 1) |> shouldEqual False
          ]
      )
      , test "isJust" (
        all
          [ Native.Tests.maybeIsJust Nothing  |> shouldEqual False
          , Native.Tests.maybeIsJust (Just 1) |> shouldEqual True
          ]
      )
      , test "isMaybe" (
        all
          [ Native.Tests.maybeIsMaybe Nothing  |> shouldEqual True
          , Native.Tests.maybeIsMaybe (Just 1) |> shouldEqual True
          ]
      )
      , test "get" (
        Native.Tests.maybeGet (Just 1) |> shouldEqual 1
      )
      , test "withDefault" (
        all
          [ Native.Tests.maybeWithDefault { def = 1, maybe = Nothing } |> shouldEqual 1
          , Native.Tests.maybeWithDefault { def = 1, maybe = Just 2  } |> shouldEqual 2
          ]
      )
      , test "map" (
        success
        |> and (
          Native.Tests.maybe_map { mapper = (\_ -> ""), maybe = Nothing }
          |> shouldEqual Nothing
        )
        |> and (
          Native.Tests.maybe_map { mapper = (\v -> v + 1), maybe = Just 1 }
          |> shouldEqual (Just 2)
        )
      )
      , test "andThen" (
        success
        |> and (
          Native.Tests.maybe_andThen { next = (\_ -> Just ""), maybe = Nothing }
          |> shouldEqual Nothing
        )
        |> and (
          Native.Tests.maybe_andThen { next = (\v -> Nothing), maybe = Just 1 }
          |> shouldEqual Nothing
        )
        |> and (
          Native.Tests.maybe_andThen { next = (\v -> Just (v + 1)), maybe = Just 1 }
          |> shouldEqual (Just 2)
        )
      )
      , test "caseOf" (
        success
        |> and (
          Native.Tests.maybe_caseOf { maybe = Nothing, onNothing = (\_ -> 1), onJust = (\_ -> 2)}
          |> shouldEqual 1
        )
        |> and (
          Native.Tests.maybe_caseOf { maybe = Just 1, onNothing = (\_ -> 3), onJust = (\v -> v + 1)}
          |> shouldEqual 2
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
        all
          [ Native.Tests.resultIsOk (Ok "a") |> shouldEqual True
          , Native.Tests.resultIsOk (Err 1)  |> shouldEqual False
          ]
      )
      , test "isErr" (
        all
          [ Native.Tests.resultIsErr (Ok 1)  |> shouldEqual False
          , Native.Tests.resultIsErr (Err 1) |> shouldEqual True
          ]
      )
      , test "isResult" (
        all
          [ Native.Tests.resultIsResult (Ok 1)  |> shouldEqual True
          , Native.Tests.resultIsResult (Err 1) |> shouldEqual True
          ]
      )
      , test "get" (
        all
          [ Native.Tests.resultGet (Ok 1)  |> shouldEqual 1
          , Native.Tests.resultGet (Err 1) |> shouldEqual 1
          ]
      )
      , test "withDefault" (
        all
          [ Native.Tests.result_withDefault { def = 1, result = Ok 2 } |> shouldEqual 2
          , Native.Tests.result_withDefault { def = 1, result = Err 2  } |> shouldEqual 1
          ]
      )
      , test "map" (
        success
        |> and (
          Native.Tests.result_map { mapper = (\_ -> ""), result = Err 1 }
          |> shouldEqual (Err 1)
        )
        |> and (
          Native.Tests.result_map { mapper = (\v -> v + 1), result = Ok 1 }
          |> shouldEqual (Ok 2)
        )
      )
      , test "caseOf" (
        success
        |> and (
          Native.Tests.result_caseOf { result = Err 1, onErr = (\v -> v + 1), onOk = (\v -> v + 2)}
          |> shouldEqual 2
        )
        |> and (
          Native.Tests.result_caseOf { result = Ok 1, onErr = (\v -> v + 1), onOk = (\v -> v + 2)}
          |> shouldEqual 3
        )
      )
      , test "andThen" (
        success
        |> and (
          Native.Tests.result_andThen { next = (\_ -> Just ""), result = Err 1 }
          |> shouldEqual (Err 1)
        )
        |> and (
          Native.Tests.result_andThen { next = (\v -> Err 2), result = Ok 1 }
          |> shouldEqual (Err 2)
        )
        |> and (
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
      , test "fromPromise success" <| lazy (\_ ->
        Native.Tests.taskFromPromise "42"
        |> shouldSucceedWith "42"
      )
      , test "fromPromise failure" <| lazy (\_ ->
        Native.Tests.taskFromPromiseFail "42"
        |> shouldFailWith "42"
      )
      , test "fromPromiseFunction success" (
        Native.Tests.taskFromPromiseFunction "42"
        |> shouldSucceedWith "42"
      )
      , test "fromPromiseFunction failure" (
        Native.Tests.taskFromPromiseFunctionFail "42"
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
