#!/usr/bin/env runhaskell
import System.Environment ( getArgs )

trim = filter (/= ' ')

tail' [] = []
tail' x = tail x

spiralizeMatrix :: Eq a => [[a]] -> [a]
spiralizeMatrix [[]] = []
spiralizeMatrix [[x]] = [x]
spiralizeMatrix matrix = if any null matrix
                         then []
                         else top ++ right ++ bottom ++ left ++ spiralizeMatrix rest
    where top    = head matrix
          right  = map last . tail' . init $ matrix
          bottom = reverse . last $ matrix
          left   = reverse . map head . tail' . init $ matrix
          rest   = map (tail' . init)  . tail' . init $ matrix

main :: IO ()
main = do
    filename  <- head <$> getArgs
    rawMatrix <- readFile filename
    let fixMatrix = trim . init . concatMap (++ " ,") . tail . init . lines
    let fixedMatrix = read ("[" ++ fixMatrix rawMatrix ++ "]") :: [[Int]]
    print $ spiralizeMatrix fixedMatrix
