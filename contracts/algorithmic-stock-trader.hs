import Data.List          ( subsequences )
import System.Environment ( getArgs )
import Control.Parallel.Strategies
import Data.Bool ( bool )

buySell :: [Int] -> Int
buySell [] = 0
buySell l = (negate . head) l + (l !! 1) + buySell (drop 2 l)

main = do
    stocks <- read . (!! 1) <$> getArgs
    trans <- (\x -> bool x (div (length stocks) 2) (x == -1)) . read .  head  <$> getArgs
    let profits = map buySell $ filter (\sublist -> length sublist <= trans * 2 && (even . length) sublist) $ subsequences stocks
    print $ maximum (profits `using` parBuffer 8192 rdeepseq)
