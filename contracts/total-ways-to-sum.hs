#!/usr/bin/env runhaskell
import System.Environment ( getArgs )

p n k
    | n == k = 1 + p n (k-1)
    | k == 0 || n < 0 = 0
    | n == 0 || k == 1 = 1
    | otherwise = p n (k-1) + p (n-k) k

main = do
    n <- read . head <$> getArgs
    print $ pred $ p n n
