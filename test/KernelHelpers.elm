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
      [ test "ctorOf Nothing" (
        Native.Tests.ctorOf Nothing
        |> shouldEqual "Nothing"
      )
      , test "ctorOf Just" (
        Native.Tests.ctorOf (Just 1)
        |> shouldEqual "Just"
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
      , test "isNothing of Nothing" (
        Native.Tests.maybeIsNothing Nothing
        |> shouldEqual True
      )
      , test "isNothing of Just" (
        Native.Tests.maybeIsNothing (Just 1)
        |> shouldEqual False
      )
      , test "isJust of Nothing" (
        Native.Tests.maybeIsJust Nothing
        |> shouldEqual False
      )
      , test "isJust of Just" (
        Native.Tests.maybeIsJust (Just 1)
        |> shouldEqual True
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
      , test "isOk of Ok" (
        Native.Tests.resultIsOk (Ok "a")
        |> shouldEqual True
      )
      , test "isOk of Err" (
        Native.Tests.resultIsOk (Err 1)
        |> shouldEqual False
      )
      , test "isErr of Ok" (
        Native.Tests.resultIsErr (Ok 1)
        |> shouldEqual False
      )
      , test "isErr of Err" (
        Native.Tests.resultIsErr (Err 1)
        |> shouldEqual True
      )
      ]
    , describe "task"
      [ test "fromCallback success" (
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
      ]
    ]
