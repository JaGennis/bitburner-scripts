#!/usr/bin/env runhaskell
-- TODO: Remove "" from output, rename variables
import System.Environment ( getArgs )
import Data.List ( intercalate )

splitAt' :: Int -> [a] -> [[a]]
splitAt' n l = [take n l, drop n l]

isValidNumber :: String -> Bool
isValidNumber x = read x >= 0 && read x <= 255 && not (head x == '0' && read x > 0)

consume :: [String] -> [[String]]
consume ip = map ((init ip ++) . (\x -> splitAt' x (last ip))) [1..3]

generateIPAdresses :: String -> [String]
generateIPAdresses n = map (intercalate ".") $ filter (all isValidNumber) $ consume (return n) >>= consume >>= consume

main :: IO ()
main = do
    n <- generateIPAdresses . head <$> getArgs
    putStrLn $ filter (/= '"') $ show n
