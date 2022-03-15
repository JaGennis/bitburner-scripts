import Data.List          ( dropWhileEnd )
import System.Environment ( getArgs )

buySell :: [Int] -> Int -> (Int, Int) -> Int
buySell prices balance (buyDay, sellDay) = balance - (prices !! buyDay)
                                                   + (prices !! sellDay)

makeNPairs :: Ord a => [a] -> Int -> a -> [[(a,a)]]
makeNPairs l 0 min = [[]]
makeNPairs l n min = [(x,y):z | x <- l, x >= min,
                                y <- l, y >= x,
                                z <- makeNPairs l (n-1) y]

makeNDistinctPairs :: Ord a => [a] -> Int -> a -> [[(a,a)]]
makeNDistinctPairs l 0 min = [[]]
makeNDistinctPairs l n min = [(x,y):z | x <- l, x > min,
                                        y <- l, y > x,
                                        z <- makeNDistinctPairs l (n-1) y]

main :: IO ()
main = do
    maxTrans <- read . head <$> getArgs
    prices <- read . (!! 1) <$> getArgs
    let days     = [0..(length prices - 1)]
        trans    = if maxTrans == -1 then [1..div (length prices) 2] else [maxTrans]
    print $ maximum $ concat $ (map.map) (foldl (buySell prices) 0) $ map (\x -> makeNDistinctPairs days x (-1)) trans
