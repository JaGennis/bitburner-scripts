#!/usr/bin/env runhaskell
import Control.Arrow      ( (&&&), first )
import Data.Bool          ( bool )
import Data.List          ( subsequences )
import System.Environment ( getArgs )
import Control.Parallel.Strategies

type BuySellPairs = [(Int, Int)]
type PriceList = [Int]

head' [] = -1000
head' l = head l

getSellPrice :: Int -> PriceList -> [(BuySellPairs,PriceList)]
getSellPrice _ [] = []
getSellPrice buyPrice prices = newItem ++ getSellPrice buyPrice restPrices
    where (restPrices, sellPrice) = drop 1 &&& head' $ dropWhile (<= buyPrice) prices
          --newItem = [([(buyPrice, sellPrice)],restPrices) | not . null $ restPrices]
          newItem = [([(buyPrice, sellPrice)],restPrices)]

findBuySellPair :: PriceList -> [(BuySellPairs, PriceList)]
findBuySellPair prices = concatMap (\x -> getSellPrice (prices !! x) (drop (succ x) prices)) [0..pred . length $ prices]

buildNbsPairs :: Int -> PriceList -> [(BuySellPairs, PriceList)]
buildNbsPairs 0     priceList = return ([], priceList)
buildNbsPairs trans priceList = buildNbsPairs (pred trans) priceList >>= mmm
    where mmm (pairs,priceList) = map (first (pairs ++)) $ findBuySellPair priceList

maxProfit :: Int -> PriceList -> Int
maxProfit n pl = maximum $ map (negate. sum . map (uncurry (-)) . fst) $ concatMap (\x -> buildNbsPairs x pl) w
    --where w = if n == -1 then [1..div (length pl) 2] else [n]
    --where w = [1..div (length pl) 2]
    where w = [1..n]

main = do
    input <- getArgs
    let ast [trans, stocks] = (read trans,read . ("[" ++ ) . (++ "]") $ stocks)
    let ast4 [x] = (read . takeWhile isDigit . tail $ x, read . tail . dropWhile isDigit . init . tail $ x)
    let transStockPair = (if (head . head $ input) == '[' then ast4 else ast) input
    print $ uncurry maxProfit transStockPair
