#!/usr/bin/env runhaskell
{-# LANGUAGE TypeApplications #-}

import System.Environment ( getArgs )
import Data.List          ( sort, union )

containsAny [] _ = False
containsAny _ [] = False
containsAny search (x:xs) = elem x search || containsAny search xs

unfoldIntervall :: Enum a => [[a]] -> [[a]]
unfoldIntervall = map (\[x,y] -> [x..y])

foldIntervall :: [[a]] -> [[a]]
foldIntervall = map (\x -> [head x, last x])

merge :: Eq a => [[a]] -> [[a]]
--merge []  = []
merge [x] = [x]
merge (x:xs:xss) = if containsAny x xs
                   then merge (union x xs : xss)
                   else x : merge (xs : xss)

fixpoint :: Eq a => (a -> a) -> a -> a
fixpoint f x = if f x == x then x else f (f x)

main = do
    intervalls <- read @[[Int]] . head <$> getArgs
    print . foldIntervall . fixpoint merge . sort . unfoldIntervall $ intervalls
