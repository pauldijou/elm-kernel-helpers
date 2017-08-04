module Kernel.Helpers exposing (removeWarnings)

{-| Add kernel / native helpers on your JavaScript

@docs removeWarnings

-}

import Native.Kernel.Helpers

{-| Use this useless constant to remove warnings from elm-make -}
removeWarnings: String
removeWarnings = ""
