#!/usr/bin/env runhaskell
import Data.List ( inits )
import System.Environment ( getArgs )

main = do
    array <- read . head <$> getArgs
    print $ maximum $ map sum $ concatMap (inits . (`drop` array)) [0..length array - 1]
