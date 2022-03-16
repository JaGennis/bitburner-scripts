import Control.Parallel.Strategies
import Data.List ( subsequences )
import System.Environment ( getArgs )

buySell' :: [Int] -> Int
buySell' [] = 0
buySell' l = (negate . head) l + (l !! 1) + buySell' (drop 2 l)

main = do
    trans' <- read .  head  <$> getArgs
    stocks <- read . (!! 1) <$> getArgs
    let trans = if trans' == -1 then div (length stocks) 2 else trans'
    let profits = map buySell' $ filter (\x -> length x <= trans * 2 && (even . length) x) $ subsequences stocks
    print $ maximum (profits `using` parBuffer 8192 rdeepseq)

