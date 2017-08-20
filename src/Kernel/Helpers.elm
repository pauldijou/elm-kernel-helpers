module Kernel.Helpers exposing (noWarnings)

{-| Add kernel / native helpers on your JavaScript

@docs noWarnings

-}

import Native.Kernel.Helpers

{-| Use this useless constant to remove warnings from elm-make -}
noWarnings: String
noWarnings = ""
