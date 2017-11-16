module EmptyAppTest exposing (..)

import Kernel.Helpers
import Native.Tests

type alias Model = {}

type Msg = None

init: (Model, Cmd Msg)
init =
  let a = Native.Tests.emptyApp() in
  {} ! []

main: Program Never Model Msg
main =
  Platform.program
    { init = init
    , update = (\_ _ -> {} ! [])
    , subscriptions = (\_ -> Sub.none)
    }

noWarnings: String
noWarnings =
  Kernel.Helpers.noWarnings
